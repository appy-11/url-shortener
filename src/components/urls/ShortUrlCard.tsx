/**
 * ShortUrlCard component displays the details of a created short URL, 
 * including the short URL itself, the original URL it redirects to, 
 * and its expiration date. It also provides options to copy the short 
 * URL to the clipboard, view analytics for the URL, and create another short URL.
 */
import { useState } from "react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";
import Card from "../ui/Card";

import { APP_CONFIG } from "@/config/app.config";
import type { ShortUrl } from "@/types/url";

interface ShortUrlCardProps {
  url: ShortUrl;
  onCreateAnother: () => void;
}

const ShortUrlCard = ({
  url,
  onCreateAnother,
}: ShortUrlCardProps) => {
  const [copied, setCopied] = useState(false);

  const shortUrl = `https://${APP_CONFIG.shortUrlDomain}/${url.shortCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card>
      <div className="text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
          ✓
        </div>

        <h3 className="mt-4 text-xl font-semibold">
          URL created successfully
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Your short URL is ready to share.
        </p>
      </div>

      <div className="mt-8">
        <p className="mb-2 text-sm font-medium text-slate-700">
          Your short URL
        </p>

        <div className="flex overflow-hidden rounded-lg border border-slate-300">
          <input
            value={shortUrl}
            readOnly
            className="min-w-0 flex-1 bg-slate-50 px-4 py-3 text-sm outline-none"
          />

          <Button
            type="button"
            variant="secondary"
            onClick={() => void handleCopy()}
            className="rounded-none border-0 border-l border-slate-300"
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-slate-500">
          Redirects to
        </p>

        <p className="mt-1 truncate text-sm text-slate-700">
          {url.originalUrl}
        </p>
      </div>

      <div className="mt-6">
        <p className="text-sm text-slate-500">
          Expires
        </p>

        <p className="mt-1 text-sm font-medium text-slate-700">
          {url.expiresAt
            ? new Date(url.expiresAt).toLocaleString()
            : "Never"}
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          to={`/links/${url.id}`}
          className="flex-1"
        >
          <Button
            type="button"
            variant="secondary"
            fullWidth
          >
            View Analytics
          </Button>
        </Link>

        <Button
          type="button"
          onClick={onCreateAnother}
          className="flex-1"
        >
          Create Another
        </Button>
      </div>
    </Card>
  );
};

export default ShortUrlCard;