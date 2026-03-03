/**
 * MenuDetails - Full item page with image, price, description, veg badge,
 * star rating, review submission, and add-to-cart.
 */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { ShoppingCart, ArrowLeft, Loader2, Star } from "lucide-react";
import toast from "react-hot-toast";

const MenuDetails = () => {
  const { id } = useParams();
  const { axios, navigate, addToCart, user } = useContext(AppContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /** Fetch item */
  useEffect(() => {
    const fetchItem = async () => {
      const token = localStorage.getItem("token")
      try {
        const { data } = await axios.get(`/api/menu/${id}`,{
          headers : {Authorization : `Bearer ${token}`}
          
        });
        if (data.success) setItem(data.menuItem);
      } catch (error) { console.log(error); }
      finally { setLoading(false); }
    };
    fetchItem();
  }, [id, axios]);

  /** Fetch reviews */
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`/api/review/${id}`);
        if (data.success) setReviews(data.reviews);
      } catch (error) { console.log(error); }
    };
    fetchReviews();
  }, [id, axios]);

  /** Submit review */
  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to leave a review"); navigate("/login"); return; }
    if (myRating === 0) { toast.error("Please select a star rating"); return; }
    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/review/add", { menuItem: id, rating: myRating, comment });
      if (data.success) {
        toast.success("Review saved!");
        // Refresh reviews & item (to get updated avg rating)
        const [revRes, itemRes] = await Promise.all([
          axios.get(`/api/review/${id}`),
          axios.get(`/api/menu/${id}`),
        ]);
        if (revRes.data.success) setReviews(revRes.data.reviews);
        if (itemRes.data.success) setItem(itemRes.data.menuItem);
        setMyRating(0); setComment("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Review failed");
    } finally { setSubmitting(false); }
  };

  /** Star component */
  const StarBtn = ({ value }) => (
    <button
      type="button"
      onClick={() => setMyRating(value)}
      onMouseEnter={() => setHoverRating(value)}
      onMouseLeave={() => setHoverRating(0)}
      className="cursor-pointer"
    >
      <Star
        size={24}
        className={`transition ${(hoverRating || myRating) >= value ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
      />
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={36} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Item not found.</p>
        <button onClick={() => navigate("/menu")} className="text-amber-600 font-medium hover:underline">Back to Menu</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button onClick={() => navigate("/menu")} className="flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-8 transition cursor-pointer">
          <ArrowLeft size={18} /> Back to Menu
        </button>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="h-72 md:h-auto relative">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            {/* Veg indicator */}
            <span className={`absolute top-4 right-4 w-6 h-6 rounded-sm border-2 flex items-center justify-center ${item.isVeg !== false ? "border-green-600 bg-white" : "border-red-600 bg-white"}`}>
              <span className={`w-3 h-3 rounded-full ${item.isVeg !== false ? "bg-green-600" : "bg-red-600"}`} />
            </span>
          </div>

          {/* Details */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            {item.category?.name && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-wide">
                {item.category.name}
              </span>
            )}
            <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>

            {/* Rating summary */}
            <div className="flex items-center gap-2 mt-2">
              {item.rating > 0 ? (
                <>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <Star key={v} size={16} className={`${v <= Math.round(item.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
                  <span className="text-xs text-gray-400">({item.ratingCount} {item.ratingCount === 1 ? "review" : "reviews"})</span>
                </>
              ) : (
                <span className="text-sm text-gray-400">No ratings yet</span>
              )}
            </div>

            <p className="text-gray-500 mt-4 leading-relaxed">{item.description}</p>

            <div className="mt-8 flex items-center gap-6">
              <span className="text-3xl font-bold text-amber-600">&#8377;{item.price}</span>
              <button onClick={() => addToCart(item._id)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-7 py-3 rounded-full font-semibold transition shadow-md shadow-amber-500/25 cursor-pointer">
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* ─── Reviews Section ─── */}
        <div className="mt-10 grid md:grid-cols-5 gap-8">
          {/* Review form */}
          <form onSubmit={handleReview} className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h2>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((v) => <StarBtn key={v} value={v} />)}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} maxLength={300} placeholder="Share your experience (optional)..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition resize-none" />
            <button type="submit" disabled={submitting} className="mt-3 w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold transition cursor-pointer">
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>

          {/* Existing reviews */}
          <div className="md:col-span-3 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
            ) : (
              reviews.map((r) => (
                <div key={r._id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 text-sm">{r.user?.name || "User"}</p>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <Star key={v} size={12} className={`${v <= r.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-gray-500 mt-1.5">{r.comment}</p>}
                  <p className="text-xs text-gray-300 mt-2">
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetails;
