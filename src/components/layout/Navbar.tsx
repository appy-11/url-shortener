import { APP_CONFIG } from "@/config/app.config";

const Navbar = () => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight">
          {APP_CONFIG.name}
        </h1>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <a
            href="/links"
            className="text-slate-600 hover:text-slate-900"
          >
            Links
          </a>

          <a
            href="/analytics"
            className="text-slate-600 hover:text-slate-900"
          >
            Analytics
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;