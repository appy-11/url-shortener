/**
 * NotFoundPage component for handling 404 errors.
 * This page is displayed when a user navigates to a route that does not exist.
 * It provides a user-friendly message indicating that the page was not found and includes a link to return to the home page.
 * It applies default styles for a consistent look and feel across the application.
 */
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="text-center">
        <p className="text-6xl font-bold">404</p>

        <h2 className="mt-4 text-2xl font-semibold">
          Page not found
        </h2>

        <p className="mt-2 text-slate-500">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;