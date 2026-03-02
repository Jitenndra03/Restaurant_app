/**
 * AdminLayout - Shared layout for all admin pages.
 * Provides a sidebar with navigation links, top bar with logout,
 * and an <Outlet /> for nested admin routes.
 * Acts as an auth guard: redirects to /admin/login if no admin session.
 */
import { useContext, useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderOpen,
  ShoppingCart,
  CalendarDays,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

/** Sidebar navigation items */
const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Categories", path: "/admin/categories", icon: FolderOpen },
  { label: "Menu Items", path: "/admin/menus", icon: UtensilsCrossed },
  { label: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { label: "Bookings", path: "/admin/bookings", icon: CalendarDays },
];

const AdminLayout = () => {
  const { navigate, admin, setAdmin, axios } = useContext(AppContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Auth guard: restore admin from localStorage or redirect ──
  useEffect(() => {
    if (!admin) {
      const stored = localStorage.getItem("admin");
      if (stored) {
        setAdmin(JSON.parse(stored));
      } else {
        navigate("/admin/login");
      }
    }
  }, [admin]);

  /** Logout admin - clear cookie, context and localStorage */
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch {
      // Ignore errors — we're logging out anyway
    }
    setAdmin(null);
    localStorage.removeItem("admin");
    toast.success("Logged out");
    navigate("/admin/login");
  };

  // Don't render until admin exists
  if (!admin) return null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ── Sidebar (desktop always visible, mobile overlay) ── */}
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-gray-300 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-800">
          <Link to="/admin/dashboard" className="text-lg font-bold tracking-tight">
            <span className="text-amber-400">Savory</span>
            <span className="text-white">Admin</span>
          </Link>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-amber-500/15 text-amber-400"
                    : "hover:bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition cursor-pointer"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="text-sm text-gray-500">
            Welcome, <span className="font-semibold text-gray-900">{admin.email}</span>
          </div>
          <Link
            to="/"
            className="text-sm text-amber-600 hover:underline hidden sm:block"
          >
            View Website &rarr;
          </Link>
        </header>

        {/* Page content (nested route renders here) */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
