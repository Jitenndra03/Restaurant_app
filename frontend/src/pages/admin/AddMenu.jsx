/**
 * AddMenu - Form to create a new menu item with image upload.
 * Sends POST /api/menu/add as multipart/form-data.
 * Fields: name, description, price, category (ObjectId), image (file).
 */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const AddMenu = () => {
  const { navigate, axios } = useContext(AppContext);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isVeg: true,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /** Fetch categories for the dropdown */
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token")
      try {
        const { data } = await axios.get("/api/category/all", {
          headers: {
        Authorization: `Bearer ${token}`,
      },
        });
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.log(err.message);
      }
    };
    load();
  }, [axios]);

  /** Update form fields */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  /** Handle file selection */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  /** Submit the form */
  const handleSubmit = async (e) => {
    e.preventDefault();
       const token = localStorage.getItem("token")
    if (!form.name || !form.description || !form.price || !form.category || !image) {
      toast.error("All fields including image are required");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("category", form.category);
      fd.append("isVeg", form.isVeg);
      fd.append("image", image);

      const { data } = await axios.post("/api/menu/add", fd, {
        headers: { "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                 },
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/admin/menus");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate("/admin/menus")}
        className="flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6 transition cursor-pointer"
      >
        <ArrowLeft size={18} /> Back to Menu Items
      </button>

      <div className="max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Menu Item</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Name</label>
            <input
              type="text" name="name" value={form.name} onChange={handleChange} required
              placeholder="e.g. Grilled Salmon"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description" value={form.description} onChange={handleChange} required rows={3}
              placeholder="A short description..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition resize-none"
            />
          </div>

          {/* Price + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (&#8377;)</label>
              <input
                type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01"
                placeholder="12.99"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                name="category" value={form.category} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              >
                <option value="">Select</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Veg toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="isVeg" checked={form.isVeg} onChange={handleChange} className="w-5 h-5 accent-green-600 rounded" />
            <span className="text-sm font-medium text-gray-700">Vegetarian</span>
          </label>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image</label>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-amber-400 transition bg-gray-50">
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Upload size={24} className="mb-2" />
                  <span className="text-sm">Click to upload image</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition cursor-pointer"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? "Adding..." : "Add Menu Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenu;
