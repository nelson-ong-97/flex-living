import {
  HostawayReview,
  HostawayReviewsResponse,
  HostawayAuthResponse,
} from "./types";
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

    // If credentials are not configured, return empty token (will use mock data)
    if (!this.clientId || !this.clientSecret) {
      console.warn("Hostaway credentials not configured, using mock data");
      return "";
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
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data: HostawayAuthResponse = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000;

      return this.accessToken;
    } catch (error) {
      console.error("Hostaway authentication error:", error);
      throw error;
    }
  }

  /**
   * Fetch reviews from Hostaway API or mock data
   */
  async getReviews(params: {
    listingId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<HostawayReview[]> {
    try {
      const token = await this.authenticate();

      console.log("token:", token);
      // If no token, use mock data
      if (!token) {
        return this.getMockReviews(params);
      }

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
        console.warn("Hostaway API request failed, falling back to mock data");
        return this.getMockReviews(params);
      }

      const data: HostawayReviewsResponse = await response.json();
      console.log("data:", data);
      return data.result;
    } catch (error) {
      console.error("Error fetching Hostaway reviews:", error);
      // Fallback to mock data on error
      return this.getMockReviews(params);
    }
  }

  /**
   * Get mock reviews (fallback when API is not available)
   */
  private getMockReviews(params: {
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
