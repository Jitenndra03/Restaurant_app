/**
 * EditMenu - Pre-filled form to update an existing menu item.
 * PUT /api/menu/update/:id as multipart/form-data.
 */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const EditMenu = () => {
  const { id } = useParams();
  const { navigate, axios } = useContext(AppContext);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", isVeg: true });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /** Fetch the existing item + categories */
  useEffect(() => {
    const load = async () => {
      try {
        const [itemRes, catRes] = await Promise.all([
          axios.get(`/api/menu/${id}`),
          axios.get("/api/category/all"),
        ]);
        if (catRes.data.success) setCategories(catRes.data.categories);
        if (itemRes.data.success) {
          const m = itemRes.data.menuItem;
          setForm({
            name: m.name,
            description: m.description,
            price: m.price,
            category: m.category?._id || "",
            isVeg: m.isVeg !== false,
          });
          setPreview(m.image);
        }
      } catch (err) {
        toast.error("Failed to load menu item");
        console.log(err.message);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, axios]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.category) {
      toast.error("All fields are required");
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
      if (image) fd.append("image", image);
const token = localStorage.getItem("token")
      const { data } = await axios.put(`/api/menu/update/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data", headers : `Bearer ${token}`, },
      });

      if (data.success) {
        toast.success("Menu item updated");
        navigate("/admin/menus");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate("/admin/menus")} className="flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6 transition cursor-pointer">
        <ArrowLeft size={18} /> Back to Menu Items
      </button>

      <div className="max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Menu Item</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition resize-none" />
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (&#8377;)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select name="category" value={form.category} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition">
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image (leave blank to keep current)</label>
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

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition cursor-pointer">
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? "Updating..." : "Update Menu Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMenu;
