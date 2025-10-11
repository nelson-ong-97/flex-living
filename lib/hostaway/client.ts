import {
  HostawayReview,
  HostawayReviewsResponse,
  HostawayAuthResponse,
} from "./types";
import {
  HostawayError,
  HostawayErrorType,
  parseHostawayHttpError,
  parseNetworkError,
} from "./errors";
import mockReviews from "@/public/mock-reviews.json";

export class HostawayClient {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.baseUrl =
      process.env.HOSTAWAY_API_URL || "https://api.hostaway.com/v1";
    this.clientId = process.env.HOSTAWAY_CLIENT_ID || "";
    this.clientSecret = process.env.HOSTAWAY_CLIENT_SECRET || "";
  }

  /**
   * Authenticate with Hostaway API
   */
  private async authenticate(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // If credentials are not configured, throw error
    if (!this.clientId || !this.clientSecret) {
      throw new HostawayError(
        HostawayErrorType.CREDENTIALS_NOT_CONFIGURED,
        "Hostaway API credentials (Client ID and Client Secret) are not configured in environment variables",
        { usingMockData: true }
      );
    }

    try {
      const response = await fetch(`${this.baseUrl}/accessTokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });

      if (!response.ok) {
        throw parseHostawayHttpError(response, "Authentication");
      }

      const data: HostawayAuthResponse = await response.json();

      if (!data.access_token) {
        throw new HostawayError(
          HostawayErrorType.INVALID_RESPONSE,
          "Authentication response missing access token"
        );
      }

      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000;

      return this.accessToken;
    } catch (error) {
      // If it's already a HostawayError, re-throw it
      if (error instanceof HostawayError) {
        throw error;
      }

      // Otherwise, parse as network error
      throw parseNetworkError(error);
    }
  }

  /**
   * Fetch reviews from Hostaway API
   * Throws HostawayError on failure - caller decides whether to use mock data
   */
  async getReviews(params: {
    listingId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<HostawayReview[]> {
    try {
      // This will throw HostawayError if credentials not configured
      const token = await this.authenticate();

      const queryParams = new URLSearchParams();
      if (params.listingId)
        queryParams.append("listingId", params.listingId.toString());
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      if (params.status) queryParams.append("status", params.status);

      const response = await fetch(
        `${this.baseUrl}/reviews?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw parseHostawayHttpError(response, "Fetch reviews");
      }

      const data: HostawayReviewsResponse = await response.json();

      if (!data.result || !Array.isArray(data.result)) {
        throw new HostawayError(
          HostawayErrorType.INVALID_RESPONSE,
          "Invalid response format from Hostaway API"
        );
      }

      return data.result;
    } catch (error) {
      // If it's already a HostawayError, re-throw it
      if (error instanceof HostawayError) {
        throw error;
      }

      // Otherwise, parse as network error
      throw parseNetworkError(error);
    }
  }

  /**
   * Get mock reviews (fallback when API is not available)
   * Public method so it can be called explicitly when handling errors
   */
  getMockReviews(params: {
    listingId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): HostawayReview[] {
    let reviews = mockReviews.reviews.map((r) => ({
      ...r,
      id: parseInt(r.id),
    })) as HostawayReview[];

    // Filter by listingId if provided
    if (params.listingId) {
      reviews = reviews.filter((r) => r.listingId === params.listingId);
    }

    // Filter by status if provided
    if (params.status) {
      reviews = reviews.filter((r) => r.status === params.status);
    }

    // Filter by date range if provided
    if (params.startDate || params.endDate) {
      reviews = reviews.filter((r) => {
        const reviewDate = new Date(r.submittedAt);
        if (params.startDate && reviewDate < new Date(params.startDate)) {
          return false;
        }
        if (params.endDate && reviewDate > new Date(params.endDate)) {
          return false;
        }
        return true;
      });
    }

    return reviews;
  }
}

// Export singleton instance
export const hostawayClient = new HostawayClient();
