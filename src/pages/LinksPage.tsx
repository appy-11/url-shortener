import { Link } from "react-router-dom";

import UrlTable from "@/components/urls/UrlTable";
import { MOCK_URLS } from "@/data/url.data";

const LinksPage = () => {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Your Links
          </h2>

          <p className="mt-2 text-slate-500">
            Manage and track your shortened URLs.
          </p>
        </div>

        <Link
          to="/"
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Create Short URL
        </Link>
      </div>

      <UrlTable urls={MOCK_URLS} />
    </main>
  );
};

export default LinksPage;