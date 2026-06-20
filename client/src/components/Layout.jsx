import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { apiFetch, getImageUrl } from "../api";

const navItems = [
  { to: "/", label: "Beranda" },
  { to: "/about", label: "Tentang" },
  { to: "/team", label: "Tim" },
  { to: "/activities", label: "Kegiatan" },
  { to: "/contact", label: "Kontak" },
];

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logo, setLogo] = useState("");
  const location = useLocation();

  useEffect(() => {
    apiFetch("/api/config").then((c) => setLogo(c.logo || "")).catch(() => {});
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const darkPages = ["/", "/about", "/team", "/activities", "/contact"];
  const hasDarkHero = darkPages.includes(location.pathname);
  const isTransparent = hasDarkHero && !scrolled;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg shadow-navy/5"
            : isTransparent
              ? "bg-transparent"
              : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <NavLink to="/" className="flex items-center gap-3 group">
              {logo ? (
                <img
                  src={getImageUrl(logo)}
                  alt="Logo"
                  className="h-10 w-auto max-w-[120px] object-contain group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center font-extrabold text-navy text-sm shadow-md group-hover:scale-105 transition-transform">
                  AI
                </div>
              )}
              <div className="leading-tight">
                <p className={`text-xs font-medium tracking-widest uppercase transition-colors duration-300 ${isTransparent ? "text-white/70" : "text-slate-500"}`}>
                  Universitas Brawijaya
                </p>
                <p className={`font-bold text-sm transition-colors duration-300 ${isTransparent ? "text-white" : "text-navy"}`}>
                  AI Center UB Workshop
                </p>
              </div>
            </NavLink>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? isTransparent
                          ? "bg-white/20 text-white shadow-sm"
                          : "bg-navy text-white hover:text-white hover:bg-navy shadow-sm"
                        : isTransparent
                          ? "text-white/80 hover:text-white hover:bg-white/10"
                          : "text-slate-600 hover:text-navy hover:bg-slate-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/admin"
                className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-amber-400 hover:bg-amber-500 text-navy transition-all duration-200 shadow-sm"
              >
                Admin
              </NavLink>
            </nav>

            <button
              type="button"
              className={`lg:hidden p-2 rounded-lg transition-colors ${isTransparent ? "text-white hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-0.5 bg-current mb-1 transition-all" />
              <div className="w-5 h-0.5 bg-current mb-1 transition-all" />
              <div className="w-5 h-0.5 bg-current transition-all" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-navy/95 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/admin"
                className="px-4 py-2.5 rounded-lg text-sm font-medium bg-amber-400 hover:bg-amber-500 text-navy transition-colors"
              >
                Admin
              </NavLink>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-navy text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {logo ? (
                  <img
                    src={getImageUrl(logo)}
                    alt="Logo"
                    className="h-10 w-auto max-w-[120px] object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center font-extrabold text-navy text-sm">
                    AI
                  </div>
                )}
                <div>
                  <p className="font-bold">AI Center UB Workshop</p>
                  <p className="text-xs text-slate-400">Universitas Brawijaya</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Mendorong ekosistem AI yang kolaboratif, aplikatif, dan berdampak bagi civitas akademika UB.
              </p>
            </div>

            <div>
              <p className="font-semibold mb-4 text-amber-400">Navigasi</p>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-4 text-amber-400">Fokus Program</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Machine Learning & Deep Learning</li>
                <li>Computer Vision</li>
                <li>Natural Language Processing</li>
                <li>Bootcamp & Showcase</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} AI Center UB Workshop. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
