/**
 * MyOrders - Displays the logged-in user's order history with cancel support.
 * Fetches from GET /api/order/my-orders.
 */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Loader2, Package, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const MyOrders = () => {
  const { navigate, user, axios } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token")
      try {
        const { data } = await axios.get("/api/order/my-orders",{
          headers: {Authorization : `Bearer ${token}`,}
        });
        if (data.success) setOrders(data.orders);
      } catch (error) { console.log(error); }
      finally { setLoading(false); }
    };
    if (user) fetchOrders();
    else setLoading(false);
  }, [user, axios]);

  /** Cancel an order (only if pending/confirmed) */
  const cancelOrder = async (id) => {
     const token = localStorage.getItem("token")
    if (!confirm("Cancel this order?")) return;
    try {
      const { data } = await axios.patch(`/api/order/cancel/${id}`,
                                        {
          headers: {Authorization : `Bearer ${token}`,}
        }
                                        );
      if (data.success) {
        toast.success("Order cancelled");
        setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status: "cancelled" } : o)));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed");
    }
  };

  /** Status badge colors — lowercase to match backend enum values */
  const statusColor = (s) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      preparing: "bg-indigo-100 text-indigo-700",
      "out-for-delivery": "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return map[s] || "bg-amber-100 text-amber-700";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Package size={48} className="text-gray-300" />
        <p className="text-gray-500 text-lg">Please login to view orders</p>
        <button onClick={() => navigate("/login")} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-semibold transition cursor-pointer">Login</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={36} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders yet</p>
            <button onClick={() => navigate("/menu")} className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-semibold transition cursor-pointer">Browse Menu</button>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="font-mono text-sm text-gray-700">{order._id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(order.status)}`}>
                      {order.status || "pending"}
                    </span>
                    {/* Cancel button (only for pending / confirmed) */}
                    {["pending", "confirmed"].includes(order.status) && (
                      <button onClick={() => cancelOrder(order._id)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition cursor-pointer" title="Cancel order">
                        <XCircle size={14} /> Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items?.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {entry.menuItem?.image && (
                        <img src={entry.menuItem.image} alt={entry.menuItem.name} className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{entry.menuItem?.name || "Item"}</p>
                        <p className="text-xs text-gray-500">Qty: {entry.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        &#8377;{(entry.price * entry.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                  <p className="font-bold text-amber-600 text-lg">&#8377;{order.totalAmount?.toFixed(2) || "0.00"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
