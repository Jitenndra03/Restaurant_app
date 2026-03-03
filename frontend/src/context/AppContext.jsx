/**
 * AppContext - Global application state management
 * Provides authentication, cart, menu, category data and helper functions
 * to all components via React Context API.
 */
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

// Configure axios defaults for API communication
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
axios.defaults.withCredentials = true; // Send cookies with every request (JWT auth)

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // ── Derived values ─────────────────────────────────────
  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // Recalculate total price whenever cart changes
  useEffect(() => {
    if (cart?.items) {
      const total = cart.items.reduce(
        (sum, item) => sum + item.menuItem.price * item.quantity,
        0
      );
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [cart]);

  // ── API helpers ────────────────────────────────────────

  /** Check if user is authenticated (restores session on page load) */
 
const isAuth = async () => {
  try {
    const token = localStorage.getItem("token"); 

    if (!token) return; // optional safety check

    const { data } = await axios.get("/api/auth/is-auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (data.success) {
      setUser(data.user);
    }
  } catch (error) {
    console.log("Auth check:", error.message);
  }
};

  /** Fetch all food categories */
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/all");
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log("Error fetching categories:", error.message);
    }
  };

  /** Fetch all menu items */
  const fetchMenus = async () => {
    try {
      const { data } = await axios.get("/api/menu/all");
      if (data.success) {
        setMenus(data.menuItems);
      }
    } catch (error) {
      console.log("Error fetching menus:", error.message);
    }
  };

  /** Fetch the current user's cart */
  const fetchCartData = async () => {
    try {
      const { data } = await axios.get("/api/cart/");
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.log("Cart fetch:", error.message);
    }
  };

  /** Add a menu item to the cart */
  const addToCart = async (menuItemId) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    try {
      const { data } = await axios.post("/api/cart/add", {
        menuItem: menuItemId,
        quantity: 1,
      }, { withCredentials: true });
      if (data.success) {
        toast.success(data.message);
        fetchCartData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  // ── Initial data fetch on mount ────────────────────────
  useEffect(() => {
    isAuth();
    fetchCategories();
    fetchMenus();
    fetchCartData();
  }, []);

  // ── Context value ──────────────────────────────────────
  const value = {
    navigate,
    loading,
    setLoading,
    user,
    setUser,
    axios,
    admin,
    setAdmin,
    categories,
    fetchCategories,
    menus,
    fetchMenus,
    addToCart,
    cartCount,
    cart,
    setCart,
    totalPrice,
    fetchCartData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
