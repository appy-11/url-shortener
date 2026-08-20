/**
 * Service for creating short URLs.
 * @param payload - The payload containing the original URL and optional alias.
 * @returns A promise that resolves to the created short URL.
 */
import type { CreateUrlPayload, ShortUrl } from "../types/url";

export const createShortUrl = async (
  payload: CreateUrlPayload
): Promise<ShortUrl> => {
  await new Promise((resolve) => {
    setTimeout(resolve, 800);
  });

  const shortCode =
    payload.alias ||
    Math.random().toString(36).substring(2, 7);

  return {
    id: crypto.randomUUID(),
    shortCode,
    originalUrl: payload.url,
    clicks: 0,
    createdAt: new Date().toISOString(),
    expiresAt: null,
    status: "active",
  };
};