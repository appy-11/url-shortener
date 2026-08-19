//temp file until we have a backend to fetch data from
import type { ShortUrl } from "../types/url";

export const MOCK_URLS: ShortUrl[] = [
  {
    id: "1",
    shortCode: "aB72x",
    originalUrl: "https://example.com/course/react",
    clicks: 1284,
    createdAt: "2026-08-19",
    expiresAt: null,
    status: "active",
  },
  {
    id: "2",
    shortCode: "xK91p",
    originalUrl: "https://udemy.com/course/advanced-react",
    clicks: 842,
    createdAt: "2026-08-15",
    expiresAt: null,
    status: "active",
  },
  {
    id: "3",
    shortCode: "mN42q",
    originalUrl: "https://github.com/example/project",
    clicks: 421,
    createdAt: "2026-07-10",
    expiresAt: "2026-08-10",
    status: "expired",
  },
];