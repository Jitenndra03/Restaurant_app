/**
 * MyBookings - Displays the logged-in user's reservations.
 * Fetches from GET /api/reservation/my-reservations.
 */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Loader2, CalendarDays } from "lucide-react";

const MyBookings = () => {
  const { navigate, user, axios } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Fetch user reservations on mount */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get("/api/reservation/my-reservations");
        if (data.success) {
          setBookings(data.reservations);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBookings();
    else setLoading(false);
  }, [user, axios]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <CalendarDays size={48} className="text-gray-300" />
        <p className="text-gray-500 text-lg">Please login to view bookings</p>
        <button onClick={() => navigate("/login")} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-semibold transition cursor-pointer">
          Login
        </button>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No reservations yet</p>
            <button
              onClick={() => navigate("/book-table")}
              className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-semibold transition cursor-pointer"
            >
              Book a Table
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{b.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(b.reservationDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {" at "}
                      {b.reservationTime}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      b.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : b.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {b.status || "Pending"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm text-gray-600">
                  <div>
                    <span className="text-gray-400">Guests</span>
                    <p className="font-medium text-gray-900">{b.numberOfGuests}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone</span>
                    <p className="font-medium text-gray-900">{b.phone}</p>
                  </div>
                  {b.occasion && (
                    <div>
                      <span className="text-gray-400">Occasion</span>
                      <p className="font-medium text-gray-900">{b.occasion}</p>
                    </div>
                  )}
                  {b.specialRequests && (
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-gray-400">Notes</span>
                      <p className="font-medium text-gray-900 truncate">{b.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
