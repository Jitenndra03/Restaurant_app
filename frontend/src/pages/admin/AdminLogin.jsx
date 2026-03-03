/**
 * AdminLogin - Standalone admin login page.
 * Authenticates against POST /api/auth/admin/login using
 * env-based credentials (ADMIN_EMAIL / ADMIN_PASSWORD on the server).
 * On success stores admin in context + localStorage and redirects to dashboard.
 */
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { ShieldCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const { navigate, axios, admin, setAdmin } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in as admin, redirect
  if (admin) {
    navigate("/admin/dashboard");
    return null;
  }

  /** Submit admin login */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/admin/login", { email, password });
      if (data.success) {
        setAdmin(data.admin);
        console.log(data);
        localStorage.setItem("admin", JSON.stringify(data.admin));
        localStorage.setItem("token", data.admin.token);
        console.log(data.admin.token);
        toast.success(data.message);
        navigate("/admin/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 sm:p-10 border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck size={28} className="text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in with admin credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition cursor-pointer"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Back link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          <button onClick={() => navigate("/")} className="text-amber-400 hover:underline cursor-pointer">
            &larr; Back to website
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
