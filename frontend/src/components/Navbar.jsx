/**
 * Navbar - Sticky top navigation bar
 * Shows logo, nav links, cart badge, and user profile dropdown.
 * Responsive with hamburger menu on mobile.
 */
import { useContext, useState ,useRef} from "react";
import { AppContext } from "../context/AppContext";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, UserCircle, LogOut, Package, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { navigate, user, setUser, axios, cartCount } = useContext(AppContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const closeTimeout = useRef(null);
const handleMouseEnter = () => {
  if (closeTimeout.current) {
    clearTimeout(closeTimeout.current);
  }
  setProfileOpen(true);
};

const handleMouseLeave = () => {
  closeTimeout.current = setTimeout(() => {
    setProfileOpen(false);
  }, 200); // delay in ms
};
  // Logout handler - clears cookie and user state
  const logout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout");
      if (data.success) {
        setUser(null);
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Active link styling helper
  const linkClass = (path) =>
    `transition-colors font-medium ${
      location.pathname === path ? "text-amber-600" : "text-gray-700 hover:text-amber-600"
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tight">
            <span className="text-amber-600">Savory</span>
            <span className="text-gray-800">Bites</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={linkClass("/")}>Home</Link>
            <Link to="/menu" className={linkClass("/menu")}>Menu</Link>
            <Link to="/book-table" className={linkClass("/book-table")}>Book Table</Link>
            <Link to="/contact" className={linkClass("/contact")}>Contact</Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button onClick={() => navigate("/cart")} className="relative p-2 rounded-full hover:bg-gray-100 transition">
              <ShoppingCart size={22} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop profile / login */}
            <div className="hidden md:block relative">
              {user ? (
                <>
                 <button
  className="p-2 rounded-full hover:bg-gray-100 transition"
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
                    <UserCircle size={26} className="text-gray-700" />
                  </button>
                  {profileOpen && (
                    <div
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg ring-1 ring-gray-100 py-2 z-50"
>
                      <Link to="/my-bookings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                        <CalendarDays size={16} /> My Bookings
                      </Link>
                      <Link to="/my-orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                        <Package size={16} /> My Orders
                      </Link>
                      <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button onClick={() => navigate("/login")} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer">
                  Login
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-3 flex flex-col gap-3">
            <Link to="/" className={linkClass("/")} onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/menu" className={linkClass("/menu")} onClick={() => setMobileOpen(false)}>Menu</Link>
            <Link to="/book-table" className={linkClass("/book-table")} onClick={() => setMobileOpen(false)}>Book Table</Link>
            <Link to="/contact" className={linkClass("/contact")} onClick={() => setMobileOpen(false)}>Contact</Link>
            {user ? (
              <>
                <Link to="/my-bookings" className="text-gray-700 hover:text-amber-600 font-medium" onClick={() => setMobileOpen(false)}>My Bookings</Link>
                <Link to="/my-orders" className="text-gray-700 hover:text-amber-600 font-medium" onClick={() => setMobileOpen(false)}>My Orders</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left text-red-600 font-medium">Logout</button>
              </>
            ) : (
              <button onClick={() => { navigate("/login"); setMobileOpen(false); }} className="bg-amber-500 text-white px-5 py-2 rounded-full text-sm font-semibold w-fit">
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
