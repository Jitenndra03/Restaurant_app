/**
 * Admin Orders - Lists all orders with status management.
 * GET  /api/order/          → fetch all orders (adminOnly)
 * PATCH /api/order/status/:id  → update status  body: { status }
 * PATCH /api/order/payment/:id → update payment body: { paymentStatus }
 * DELETE /api/order/delete/:id → delete order
 *
 * Valid statuses: pending, confirmed, preparing, out-for-delivery, delivered, cancelled
 * Valid payment:  pending, paid, failed, refunded
 */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

/** Status dropdown options */
const ORDER_STATUSES = ["pending", "confirmed", "preparing", "out-for-delivery", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

/** Badge colour mapping */
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

const paymentColor = (s) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-purple-100 text-purple-700",
  };
  return map[s] || "bg-gray-100 text-gray-700";
};

const Orders = () => {
  const { axios } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Fetch all orders */
  const fetchOrders = async () => {
    const token = localStorage.getItem("token")
    try {
      const { data } = await axios.get("/api/order/",{
        headers:{Authorization : `Bearer ${token}`,}
      });
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /** Update order status */
  const changeStatus = async (id, status) => {
    const token = localStorage.getItem("token")
    try {
      const { data } = await axios.patch(`/api/order/status/${id}`, { status },{
        headers:{Authorization : `Bearer ${token}`,}
      }
                                        );
      if (data.success) {
        toast.success("Status updated");
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status } : o))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  /** Update payment status */
  const changePayment = async (id, paymentStatus) => {
    try {
      const { data } = await axios.patch(`/api/order/payment/${id}`, { paymentStatus });
      if (data.success) {
        toast.success("Payment status updated");
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, paymentStatus } : o))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  /** Delete order */
  const handleDelete = async (id) => {
    if (!confirm("Delete this order permanently?")) return;
    try {
      const { data } = await axios.delete(`/api/order/delete/${id}`);
      if (data.success) {
        toast.success("Deleted");
        setOrders((prev) => prev.filter((o) => o._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders ({orders.length})</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
          <p className="text-gray-400">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              {/* Top row */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-mono">{order._id}</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {order.user?.name || "Guest"} &middot; {order.user?.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition cursor-pointer"
                    title="Delete order"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="flex flex-wrap gap-3 mb-4">
                {order.items?.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    {entry.menuItem?.image && (
                      <img src={entry.menuItem.image} alt="" className="w-8 h-8 rounded object-cover" />
                    )}
                    <span className="text-xs text-gray-700">
                      {entry.menuItem?.name} &times;{entry.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Controls row */}
              <div className="grid sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                {/* Status */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Order Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => changeStatus(order._id, e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Payment */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Payment</label>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => changePayment(order._id, e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition"
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Total + date */}
                <div className="flex items-end justify-between sm:flex-col sm:items-end">
                  <p className="text-lg font-bold text-amber-600">&#8377;{order.totalAmount?.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
