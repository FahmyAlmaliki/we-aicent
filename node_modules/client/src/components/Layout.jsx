import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/activities", label: "Activities" },
  { to: "/contact", label: "Contact" },
];

export default function Layout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="brand-block">
          <div className="brand-mark">AI</div>
          <div>
            <p className="brand-kicker">Universitas Brawijaya</p>
            <h1>AI Center UB Workshop</h1>
          </div>
        </div>

        <nav className="site-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/admin/login" className="nav-admin">
            Admin
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>AI Center Universitas Brawijaya</p>
        <p>Mendorong ekosistem AI yang kolaboratif, aplikatif, dan berdampak.</p>
      </footer>
    </div>
  );
}
