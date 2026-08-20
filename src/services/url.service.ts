/**
 * Service for creating short URLs.
 * This service provides functions to interact with the 
 * backend API for creating and retrieving short URLs.
 * Currently, it uses mock data to simulate API 
 * responses for development and testing purposes.
 * @param payload - The payload containing the original URL and optional alias.
 * @returns A promise that resolves to the created short URL.
 */
import { MOCK_URLS } from "../data/url.data";
import type { CreateUrlPayload,ShortUrl } from "../types/url";


const MOCK_API_DELAY = 800;

const delay = (ms: number) => 
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const getShortUrls = async (): Promise<ShortUrl[]> => {
  await delay(MOCK_API_DELAY);

  return MOCK_URLS;
};

export const createShortUrl = async (
  payload: CreateUrlPayload
): Promise<ShortUrl> => {
  await delay(MOCK_API_DELAY);

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