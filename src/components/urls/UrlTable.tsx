import { Link } from "react-router-dom";

import type { ShortUrl } from "@/types/url";
import { APP_CONFIG } from "@/config/app.config";

interface UrlTableProps {
  urls: ShortUrl[];
}

const UrlTable = ({ urls }: UrlTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-sm font-medium text-slate-600">
              Short URL
            </th>

            <th className="px-6 py-4 text-sm font-medium text-slate-600">
              Destination
            </th>

            <th className="px-6 py-4 text-sm font-medium text-slate-600">
              Clicks
            </th>

            <th className="px-6 py-4 text-sm font-medium text-slate-600">
              Status
            </th>

            <th className="px-6 py-4" />
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {urls.map((url) => (
            <tr
              key={url.id}
              className="hover:bg-slate-50"
            >
              <td className="px-6 py-4">
                <Link
                  to={`/links/${url.id}`}
                  className="font-medium text-slate-900 hover:underline"
                >
                  {APP_CONFIG.shortUrlDomain}/{url.shortCode}
                </Link>
              </td>

              <td className="max-w-xs truncate px-6 py-4 text-sm text-slate-500">
                {url.originalUrl}
              </td>

              <td className="px-6 py-4 text-sm text-slate-700">
                {url.clicks.toLocaleString()}
              </td>

              <td className="px-6 py-4">
                <span
                  className={
                    url.status === "active"
                      ? "rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                      : "rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
                  }
                >
                  {url.status}
                </span>
              </td>

              <td className="px-6 py-4 text-right">
                <Link
                  to={`/links/${url.id}`}
                  className="text-sm font-medium text-slate-700 hover:text-slate-950"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UrlTable;