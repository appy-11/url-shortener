/**
 * App component serves as the main entry point of the application.
 * It sets up the routing for different pages, including CreateUrlPage, LinksPage, AnalyticsPage, and NotFoundPage.
 * The Navbar component is included for navigation across the application.
 * It uses React's Suspense to handle lazy loading of pages for better performance.
 * Default styles are applied to ensure a consistent look and feel across the application.
 */
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import Navbar from '@/components/layout/Navbar'
import CreateUrlPage from '@/pages/CreateUrlPage'
import LoadingState from '@/components/ui/LoadingState'

const LinksPage = lazy(() => import('@/pages/LinksPage'))
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route path="/" element={<CreateUrlPage />} />

          <Route path="/links" element={<LinksPage />} />

          <Route path="/links/:id" element={<AnalyticsPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
