export type ExpiryOption =
  | "never"
  | "1h"
  | "1d"
  | "7d"
  | "30d"
  | "custom";

export interface CreateUrlPayload {
  url: string;
  alias?: string;
  expiry?: ExpiryOption;
}