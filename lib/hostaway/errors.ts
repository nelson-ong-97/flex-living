/**
 * Custom error types for Hostaway API integration
 */

export enum HostawayErrorType {
  // Configuration errors
  CREDENTIALS_NOT_CONFIGURED = "CREDENTIALS_NOT_CONFIGURED",
  
  // Authentication errors
  AUTH_FAILED = "AUTH_FAILED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  
  // API errors
  API_REQUEST_FAILED = "API_REQUEST_FAILED",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  LISTING_NOT_FOUND = "LISTING_NOT_FOUND",
  INVALID_LISTING_ID = "INVALID_LISTING_ID",
  
  // Network errors
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT = "TIMEOUT",
  
  // Data errors
  INVALID_RESPONSE = "INVALID_RESPONSE",
  
  // Fallback
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export class HostawayError extends Error {
  public readonly type: HostawayErrorType;
  public readonly statusCode?: number;
  public readonly originalError?: unknown;
  public readonly usingMockData: boolean;

  constructor(
    type: HostawayErrorType,
    message: string,
    options?: {
      statusCode?: number;
      originalError?: unknown;
      usingMockData?: boolean;
    }
  ) {
    super(message);
    this.name = "HostawayError";
    this.type = type;
    this.statusCode = options?.statusCode;
    this.originalError = options?.originalError;
    this.usingMockData = options?.usingMockData || false;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    switch (this.type) {
      case HostawayErrorType.CREDENTIALS_NOT_CONFIGURED:
        return "Hostaway API credentials are not configured. Using mock data for development.";
      
      case HostawayErrorType.INVALID_CREDENTIALS:
        return "Invalid Hostaway API credentials. Please check your Client ID and Client Secret.";
      
      case HostawayErrorType.AUTH_FAILED:
        return "Failed to authenticate with Hostaway API. Please verify your credentials.";
      
      case HostawayErrorType.TOKEN_EXPIRED:
        return "Hostaway API token has expired. Please try again.";
      
      case HostawayErrorType.RATE_LIMIT_EXCEEDED:
        return "Hostaway API rate limit exceeded. Please try again later.";
      
      case HostawayErrorType.LISTING_NOT_FOUND:
        return "The specified property listing was not found in Hostaway.";
      
      case HostawayErrorType.INVALID_LISTING_ID:
        return "Invalid listing ID provided. Please check the property configuration.";
      
      case HostawayErrorType.API_REQUEST_FAILED:
        return `Hostaway API request failed${this.statusCode ? ` (Status: ${this.statusCode})` : ""}. ${this.message}`;
      
      case HostawayErrorType.NETWORK_ERROR:
        return "Network error while connecting to Hostaway API. Please check your internet connection.";
      
      case HostawayErrorType.TIMEOUT:
        return "Request to Hostaway API timed out. Please try again.";
      
      case HostawayErrorType.INVALID_RESPONSE:
        return "Received invalid response from Hostaway API. Please try again.";
      
      default:
        return `An unexpected error occurred: ${this.message}`;
    }
  }

  /**
   * Check if error is recoverable (can retry)
   */
  isRecoverable(): boolean {
    return [
      HostawayErrorType.NETWORK_ERROR,
      HostawayErrorType.TIMEOUT,
      HostawayErrorType.TOKEN_EXPIRED,
      HostawayErrorType.RATE_LIMIT_EXCEEDED,
    ].includes(this.type);
  }

  /**
   * Check if error should use mock data fallback
   */
  shouldUseMockData(): boolean {
    return [
      HostawayErrorType.CREDENTIALS_NOT_CONFIGURED,
      HostawayErrorType.INVALID_CREDENTIALS,
      HostawayErrorType.AUTH_FAILED,
    ].includes(this.type);
  }
}

/**
 * Parse HTTP error response and create appropriate HostawayError
 */
export function parseHostawayHttpError(
  response: Response,
  context: string
): HostawayError {
  const statusCode = response.status;

  switch (statusCode) {
    case 401:
      return new HostawayError(
        HostawayErrorType.INVALID_CREDENTIALS,
        "Authentication failed - invalid credentials",
        { statusCode }
      );
    
    case 403:
      return new HostawayError(
        HostawayErrorType.AUTH_FAILED,
        "Access forbidden - check API permissions",
        { statusCode }
      );
    
    case 404:
      return new HostawayError(
        HostawayErrorType.LISTING_NOT_FOUND,
        "Resource not found",
        { statusCode }
      );
    
    case 429:
      return new HostawayError(
        HostawayErrorType.RATE_LIMIT_EXCEEDED,
        "Too many requests - rate limit exceeded",
        { statusCode }
      );
    
    case 500:
    case 502:
    case 503:
    case 504:
      return new HostawayError(
        HostawayErrorType.API_REQUEST_FAILED,
        "Hostaway server error - please try again later",
        { statusCode }
      );
    
    default:
      return new HostawayError(
        HostawayErrorType.API_REQUEST_FAILED,
        `${context} failed with status ${statusCode}`,
        { statusCode }
      );
  }
}

/**
 * Parse network/fetch errors
 */
export function parseNetworkError(error: unknown): HostawayError {
  if (error instanceof Error) {
    // Check for timeout
    if (error.name === "AbortError" || error.message.includes("timeout")) {
      return new HostawayError(
        HostawayErrorType.TIMEOUT,
        "Request timed out",
        { originalError: error }
      );
    }
    
    // Check for network errors
    if (
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("ECONNREFUSED")
    ) {
      return new HostawayError(
        HostawayErrorType.NETWORK_ERROR,
        "Network connection failed",
        { originalError: error }
      );
    }
  }
  
  return new HostawayError(
    HostawayErrorType.UNKNOWN_ERROR,
    error instanceof Error ? error.message : "Unknown error occurred",
    { originalError: error }
  );
}

