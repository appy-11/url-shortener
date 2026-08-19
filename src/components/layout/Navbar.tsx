import { NavLink } from "react-router-dom";

import { APP_CONFIG } from "@/config/app.config";
import { NAVIGATION_CONFIG } from "@/config/navigation.config";

const Navbar = () => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink
          to="/"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          {APP_CONFIG.name}
        </NavLink>

        <nav className="flex items-center gap-6 text-sm font-medium">
          {NAVIGATION_CONFIG.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-900"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;