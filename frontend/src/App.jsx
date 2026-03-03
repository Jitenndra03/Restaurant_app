/**
 * App.jsx - Root application component
 * Defines client-facing routes (Navbar + Footer) and admin routes (AdminLayout).
 */
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Customer Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import MenuDetails from "./pages/MenuDetails";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import BookingTable from "./pages/BookingTable";
import MyBookings from "./pages/MyBookings";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import AddCategory from "./pages/admin/AddCategory";
import Menus from "./pages/admin/Menus";
import AddMenu from "./pages/admin/AddMenu";
import Orders from "./pages/admin/Orders";
import Bookings from "./pages/admin/Bookings";
import EditMenu from "./pages/admin/EditMenu";
import EditCategory from "./pages/admin/EditCategory";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Toast notification container */}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <Routes>
        {/* ─── Admin routes (no Navbar / Footer) ─── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="edit-category/:id" element={<EditCategory />} />
          <Route path="menus" element={<Menus />} />
          <Route path="add-menu" element={<AddMenu />} />
          <Route path="edit-menu/:id" element={<EditMenu />} />
          <Route path="orders" element={<Orders />} />
          <Route path="bookings" element={<Bookings />} />
        </Route>

        {/* ─── Customer routes ─── */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/menu/:id" element={<MenuDetails />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/book-table" element={<BookingTable />} />
                  <Route path="/my-bookings" element={<MyBookings />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
