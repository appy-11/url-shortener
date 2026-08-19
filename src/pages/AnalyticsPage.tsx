import { Link, useParams } from "react-router-dom";

import { MOCK_URLS } from "@/data/url.data";
import { APP_CONFIG } from "@/config/app.config";
import Card from "@/components/ui/Card";

const AnalyticsPage = () => {
  const { id } = useParams<{ id: string }>();

  const url = MOCK_URLS.find((item) => item.id === id);

  if (!url) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-bold">
          URL not found
        </h2>

        <Link
          to="/links"
          className="mt-4 inline-block text-sm font-medium underline"
        >
          Back to links
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        to="/links"
        className="text-sm text-slate-500 hover:text-slate-900"
      >
        ← Back to links
      </Link>

      <div className="mt-6">
        <h2 className="text-3xl font-bold tracking-tight">
          URL Analytics
        </h2>

        <p className="mt-2 text-slate-500">
          Performance details for your shortened URL.
        </p>
      </div>

      <Card className="mt-8">
        <div>
          <p className="text-sm text-slate-500">
            Short URL
          </p>

          <p className="mt-1 text-lg font-semibold">
            {APP_CONFIG.shortUrlDomain}/{url.shortCode}
          </p>
        </div>

        <div className="mt-6">
          <p className="text-sm text-slate-500">
            Original URL
          </p>

          <p className="mt-1 break-all text-sm text-slate-700">
            {url.originalUrl}
          </p>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">
            Total Clicks
          </p>

          <p className="mt-2 text-3xl font-bold">
            {url.clicks.toLocaleString()}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Created
          </p>

          <p className="mt-2 text-lg font-semibold">
            {url.createdAt}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Expires
          </p>

          <p className="mt-2 text-lg font-semibold">
            {url.expiresAt ?? "Never"}
          </p>
        </Card>
      </div>

      <Card className="mt-6">
        <p className="text-sm font-medium text-slate-700">
          Clicks over time
        </p>

        <div className="mt-6 flex h-64 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-400">
          Analytics chart coming soon
        </div>
      </Card>
    </main>
  );
};

export default AnalyticsPage;