import CreateUrlForm from "@/components/urls/CreateUrlForm";

const CreateUrlPage = () => {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight">
            Create a short URL
          </h2>

          <p className="mt-3 text-slate-500">
            Turn long URLs into simple, shareable links.
          </p>
        </div>

        <CreateUrlForm />
      </section>
    </main>
  );
};

export default CreateUrlPage;