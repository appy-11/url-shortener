import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import PageLoader from "@/components/ui/PageLoader";
import CreateUrlPage from "@/pages/CreateUrlPage";

const LinksPage = lazy(() => import("@/pages/LinksPage"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));



function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/"
            element={<CreateUrlPage />}
          />

          <Route
            path="/links"
            element={<LinksPage />}
          />

          <Route
            path="/links/:id"
            element={<AnalyticsPage />}
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;