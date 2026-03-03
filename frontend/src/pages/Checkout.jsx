/**
 * Checkout - Order placement with Razorpay online payment support.
 * COD → creates order and navigates to my-orders.
 * Online → creates order, then opens Razorpay checkout; on success verifies payment.
 */
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Loader2, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

const Checkout = () => {
  const { navigate, user, axios, cart, totalPrice, fetchCartData } = useContext(AppContext);
console.log(cart)
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    notes: "",
    paymentMethod: "cash",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /** Load Razorpay script dynamically */
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true);
      const s = document.createElement("script");
      s.id = "razorpay-script";
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  /** Create the app order on the backend */
  const createAppOrder = async () => {
    const items = cart.items.map((entry) => ({
      menuItem: entry.menuItem._id,
      quantity: entry.quantity,
    }));
    const { data } = await axios.post("/api/order/create", {
      items,
      deliveryAddress: {
        street: form.street,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        phone: form.phone,
      },
      paymentMethod: form.paymentMethod === "cash" ? "cash" : "online",
      notes: form.notes,
    });
    return data;
  };

  /** Handle Razorpay payment */
  const handleOnlinePayment = async (orderId) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load payment gateway. Please try again.");
      return;
    }

    // Create Razorpay order
    const { data: payData } = await axios.post("/api/payment/create-order", { orderId });
    if (!payData.success) {
      toast.error("Payment initiation failed");
      return;
    }

    const options = {
      key: payData.key,
      amount: payData.razorpayOrder.amount,
      currency: payData.razorpayOrder.currency,
      name: "Restaurant App",
      description: "Order Payment",
      order_id: payData.razorpayOrder.id,
      handler: async (response) => {
        try {
          const { data: verifyData } = await axios.post("/api/payment/verify", {
            orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (verifyData.success) {
            toast.success("Payment successful! Order placed.");
            fetchCartData();
            navigate("/my-orders");
          } else {
            toast.error("Payment verification failed");
          }
        } catch {
          toast.error("Payment verification error");
        }
      },
      prefill: { name: user?.name || "", email: user?.email || "", contact: form.phone },
      theme: { color: "#f59e0b" },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => toast.error("Payment failed. Please try again."));
    rzp.open();
  };

  /** Place order */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) { toast.error("Cart is empty"); return; }
    setLoading(true);
    try {
      const data = await createAppOrder();
      if (!data.success) { toast.error(data.message); return; }

      if (form.paymentMethod === "online") {
        await handleOnlinePayment(data.order._id);
      } else {
        toast.success("Order placed successfully!");
        fetchCartData();
        navigate("/my-orders");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) { navigate("/login"); return null; }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
          {/* Delivery Address */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delivery Address</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <input type="text" name="street" value={form.street} onChange={handleChange} required placeholder="123 Main Street" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} required placeholder="Mumbai" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input type="text" name="state" value={form.state} onChange={handleChange} required placeholder="Maharashtra" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                <input type="text" name="zipCode" value={form.zipCode} onChange={handleChange} required placeholder="400001" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition" />
              </div>
            </div>
          </div>

          {/* Order Summary + Payment */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.items?.map((entry) => (
                  <div key={entry._id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">{entry.menuItem?.name} x{entry.quantity}</span>
                    <span className="font-medium text-gray-900">&#8377;{(entry.menuItem?.price * entry.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-xl text-amber-600">&#8377;{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h2>
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition">
                <option value="cash">Cash on Delivery</option>
                <option value="online">Pay Online (Razorpay)</option>
              </select>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Special Notes</h2>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any special requests..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition resize-none" />
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition cursor-pointer">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
              {loading ? "Processing..." : form.paymentMethod === "online" ? "Pay & Place Order" : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
