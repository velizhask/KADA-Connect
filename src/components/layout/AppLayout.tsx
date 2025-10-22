import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout() {
  const base = "px-3 py-2 rounded-md text-sm font-medium";
  const active = "bg-gray-900 text-white";
  const inactive = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="bg-gray-800">
        <div className="container mx-auto flex h-14 items-center gap-4 px-4">
          <span className="text-white font-semibold">KADA Connect</span>
          <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
            Home
          </NavLink>
          <NavLink to="/company" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
            Company
          </NavLink>
          <NavLink to="/trainee" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
            Trainee
          </NavLink>
        </div>
      </nav>
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
      <footer className="border-t mt-10 p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} KADA Connect
      </footer>
    </div>
  );
}
