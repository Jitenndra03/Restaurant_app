/**
 * Admin Bookings - Lists all table reservations with status management.
 * GET   /api/reservation/            → all reservations (adminOnly)
 * PATCH /api/reservation/status/:id  → update status body: { status, tableNumber }
 * DELETE /api/reservation/delete/:id → delete reservation
 *
 * Valid statuses: pending, confirmed, seated, completed, cancelled, no-show
 */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const BOOKING_STATUSES = ["pending", "confirmed", "seated", "completed", "cancelled", "no-show"];

/** Badge colour mapping */
const statusColor = (s) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    seated: "bg-indigo-100 text-indigo-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    "no-show": "bg-gray-200 text-gray-600",
  };
  return map[s] || "bg-gray-100 text-gray-700";
};

const Bookings = () => {
  const { axios } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Fetch all reservations */
  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.get("/api/reservation/",
                                       {
        headers: { Authorization: `Bearer ${token}`, },
                                         
                                       }
                                      );
      if (data.success) setBookings(data.reservations);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /** Update reservation status */
  const changeStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(`/api/reservation/status/${id}`, { status });
      if (data.success) {
        toast.success("Status updated");
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status } : b))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  /** Delete reservation */
  const handleDelete = async (id) => {
    if (!confirm("Delete this reservation?")) return;
    try {
      const { data } = await axios.delete(`/api/reservation/delete/${id}`);
      if (data.success) {
        toast.success("Deleted");
        setBookings((prev) => prev.filter((b) => b._id !== id));
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Reservations ({bookings.length})
      </h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
          <p className="text-gray-400">No reservations found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">Guest</th>
                  <th className="px-5 py-3 text-left">Date &amp; Time</th>
                  <th className="px-5 py-3 text-center">Guests</th>
                  <th className="px-5 py-3 text-left">Occasion</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition">
                    {/* Guest info */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{b.name}</p>
                      <p className="text-xs text-gray-400">{b.email}</p>
                      <p className="text-xs text-gray-400">{b.phone}</p>
                    </td>
                    {/* Date & time */}
                    <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                      {new Date(b.reservationDate).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                      <br />
                      <span className="text-xs text-gray-400">{b.reservationTime}</span>
                    </td>
                    <td className="px-5 py-4 text-center text-gray-900 font-medium">{b.numberOfGuests}</td>
                    <td className="px-5 py-4 text-gray-500">{b.occasion || "—"}</td>
                    {/* Status dropdown */}
                    <td className="px-5 py-4">
                      <select
                        value={b.status}
                        onChange={(e) => changeStatus(b._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer ${statusColor(b.status)}`}
                      >
                        {BOOKING_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    {/* Delete */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
