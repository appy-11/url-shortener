export type ExpiryOption =
  | "never"
  | "1h"
  | "1d"
  | "7d"
  | "30d"
  | "custom";

export type UrlStatus = "active" | "expired";

export interface CreateUrlPayload {
  url: string;
  alias?: string;
  expiry?: ExpiryOption;
}

export interface ShortUrl {
  id: string;
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  expiresAt: string | null;
  status: UrlStatus;
}