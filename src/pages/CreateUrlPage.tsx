/**
 * CreateUrlPage component for creating a new short URL.
 * This page includes a form for users to input a long URL, an optional alias, and an expiry option.
 * It utilizes the CreateUrlForm component to handle form state and submission.
 * It applies default styles for a consistent look and feel across the application.
 */
import CreateUrlForm from '@/components/urls/CreateUrlForm'

const CreateUrlPage = () => {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create a short URL
          </h2>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Turn long URLs into simple, shareable links.
          </p>
        </div>

        <CreateUrlForm />
      </section>
    </main>
  )
}

export default CreateUrlPage
