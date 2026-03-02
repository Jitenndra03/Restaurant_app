/**
 * Dashboard - Admin overview page.
 * Shows stat cards (total orders, reservations, menu items, categories)
 * and a recent-orders table. All data fetched via admin-only endpoints.
 */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import {
  ShoppingCart,
  CalendarDays,
  UtensilsCrossed,
  FolderOpen,
  Loader2,
} from "lucide-react";

const Dashboard = () => {
  const { axios } = useContext(AppContext);
  const [stats, setStats] = useState({ orders: 0, bookings: 0, menus: 0, categories: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Fetch overview data on mount */
  useEffect(() => {
    const load = async () => {
      try {
        // Fire requests in parallel for performance
        const [ordersRes, bookingsRes, menusRes, categoriesRes] = await Promise.all([
          axios.get("/api/order/"),
          axios.get("/api/reservation/"),
          axios.get("/api/menu/all"),
          axios.get("/api/category/all"),
        ]);

        setStats({
          orders: ordersRes.data.count || 0,
          bookings: bookingsRes.data.count || 0,
          menus: menusRes.data.count || 0,
          categories: categoriesRes.data.categories?.length || 0,
        });

        // Show latest 5 orders
        setRecentOrders((ordersRes.data.orders || []).slice(0, 5));
      } catch (error) {
        console.log("Dashboard load error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [axios]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  /** Stat card data */
  const cards = [
    { label: "Total Orders", value: stats.orders, icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Reservations", value: stats.bookings, icon: CalendarDays, color: "bg-emerald-500" },
    { label: "Menu Items", value: stats.menus, icon: UtensilsCrossed, color: "bg-amber-500" },
    { label: "Categories", value: stats.categories, icon: FolderOpen, color: "bg-purple-500" },
  ];

  /** Map order status → badge color */
  const statusColor = (s) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      preparing: "bg-indigo-100 text-indigo-700",
      "out-for-delivery": "bg-cyan-100 text-cyan-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return map[s] || "bg-gray-100 text-gray-700";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`${c.color} w-12 h-12 rounded-xl flex items-center justify-center text-white`}>
              <c.icon size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent orders ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Items</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                      {o._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{o.user?.name || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{o.items?.length || 0}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${o.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
