/**
 * BookingTable - Table reservation form.
 * Posts to POST /api/reservation/create with:
 *   { name, email, phone, numberOfGuests, reservationDate, reservationTime, specialRequests, occasion }
 */
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Loader2, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";

const BookingTable = () => {
  const { navigate, user, axios } = useContext(AppContext);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    numberOfGuests: 2,
    reservationDate: "",
    reservationTime: "",
    specialRequests: "",
    occasion: "",
  });
  const [loading, setLoading] = useState(false);

  /** Update form fields */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** Submit reservation */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localSTORAGE.getItem("token")
    if (!user) {
      toast.error("Please login to book a table");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/reservation/create", form,{
       headers : {Authorization : `Bearer ${token},} 
      });
      if (data.success) {
        toast.success("Table reserved successfully!");
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Reservation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Reserve a Table</h1>
          <p className="text-gray-500 mt-2">Book your spot for an unforgettable dining experience</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange} required
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input
                type="text" name="phone" value={form.phone} onChange={handleChange} required
                placeholder="+1 555-0000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              />
            </div>
            {/* Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Guests</label>
              <input
                type="number" name="numberOfGuests" value={form.numberOfGuests} onChange={handleChange} required min={1} max={20}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reservation Date</label>
              <input
                type="date" name="reservationDate" value={form.reservationDate} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              />
            </div>
            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reservation Time</label>
              <input
                type="time" name="reservationTime" value={form.reservationTime} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Occasion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Occasion (optional)</label>
            <select
              name="occasion" value={form.occasion} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
            >
              <option value="">Select occasion</option>
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Business">Business Meeting</option>
              <option value="Date">Date Night</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Special requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Requests (optional)</label>
            <textarea
              name="specialRequests" value={form.specialRequests} onChange={handleChange}
              rows={3}
              placeholder="Dietary preferences, seating preference, etc."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition cursor-pointer"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CalendarDays size={18} />}
            {loading ? "Booking..." : "Book Table"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingTable;
