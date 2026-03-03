/**
 * Cart - Shows all items currently in the user's cart.
 * Allows updating quantity (+/-) and removing items.
 */
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Trash2, ShoppingBag, ArrowRight, Loader2, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";

const Cart = () => {
  const { navigate, user, axios, cart, totalPrice, fetchCartData, loading } = useContext(AppContext);
console.log(fetchCartData)
  useEffect(() => { if (user) fetchCartData(); }, [user]);

  /** Update quantity */
  const updateQty = async (menuItemId, newQty) => {
    const token = localStorage.getItems("token")
    try {
      if (newQty < 1) {
        // Remove item if quantity goes to 0
        const { data } = await axios.delete(`/api/cart/remove/${menuItemId}`, {
          headers: { Authorization : `Bearer {token}`,}
        });
        if (data.success) { toast.success("Item removed"); fetchCartData(); }
      } else {
        const { data } = await axios.patch(`/api/cart/update/${menuItemId}`, { quantity: newQty });
        if (data.success) fetchCartData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update cart");
    }
  };

  /** Remove a single item from cart */
  const removeItem = async (menuItemId) => {
    const token = localStorage.getItem("token")
    try {
      const { data } = await axios.delete(`/api/cart/remove/${menuItemId}`,
                                          {
                                            headers: {Authorization : `Bearer {token}`,}
                                          }
                                         );
      if (data.success) { toast.success("Item removed"); fetchCartData(); }
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <ShoppingBag size={48} className="text-gray-300" />
        <p className="text-gray-500 text-lg">Please login to view your cart</p>
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

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <ShoppingBag size={48} className="text-gray-300" />
        <p className="text-gray-500 text-lg">Your cart is empty</p>
        <button onClick={() => navigate("/menu")} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-semibold transition cursor-pointer">Browse Menu</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="space-y-4">
          {cart.map((entry) => {
            const item = entry.menuItem;
            if (!item) return null;
            return (
              <div key={entry._id} className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-4 border border-gray-100 shadow-sm">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer" onClick={() => navigate(`/menu/${item._id}`)} />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-400">&#8377;{item.price} each</p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item._id, entry.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-900">{entry.quantity}</span>
                  <button onClick={() => updateQty(item._id, entry.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer">
                    <Plus size={14} />
                  </button>
                </div>

                <p className="font-bold text-amber-600 text-lg whitespace-nowrap w-24 text-right">
                  &#8377;{(item.price * entry.quantity).toFixed(2)}
                </p>

                <button onClick={() => removeItem(item._id)} className="p-2 rounded-full hover:bg-red-50 text-red-500 transition cursor-pointer" title="Remove item">
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Total</span>
            <span className="text-2xl font-bold text-gray-900">&#8377;{totalPrice.toFixed(2)}</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3.5 rounded-xl font-semibold transition cursor-pointer">
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
