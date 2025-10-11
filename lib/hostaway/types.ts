// Hostaway API types
export interface HostawayReview {
  id: number;
  listingId: number;
  guestName: string;
  rating: number;
  publicReview?: string;
  cleanliness?: number;
  communication?: number;
  accuracy?: number;
  location?: number;
  checkin?: number;
  value?: number;
  respectRules?: number;
  channel: string;
  type: string;
  status: string;
  submittedAt: string;
}

export interface HostawayReviewsResponse {
  status: string;
  result: HostawayReview[];
  count: number;
}

export interface HostawayAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface HostawayListingResponse {
  status: string;
  result: {
    id: number;
    name: string;
    address?: string;
    city?: string;
    country?: string;
  };
}

