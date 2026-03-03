/**
 * Admin EditCategory - Pre-filled form for editing an existing category.
 * Sends PUT /api/category/update/:id with FormData (name + optional image).
 */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { Loader2, Upload, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const EditCategory = () => {
  const { id } = useParams();
  const { navigate, axios } = useContext(AppContext);

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /** Fetch existing category data */
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get("/api/category/all");
        const cat = data.categories?.find((c) => c._id === id);
        if (cat) {
          setName(cat.name);
          setPreview(cat.image);
        } else {
          toast.error("Category not found");
          navigate("/admin/categories");
        }
      } catch {
        toast.error("Failed to load category");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, axios]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      if (image) fd.append("image", image);

      const { data } = await axios.put(`/api/category/update/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Category updated!");
        navigate("/admin/categories");
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
    <div className="max-w-lg mx-auto">
      <button onClick={() => navigate("/admin/categories")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 cursor-pointer">
        <ArrowLeft size={16} /> Back to Categories
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Category</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Image</label>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-xl hover:border-amber-400 transition cursor-pointer overflow-hidden">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Upload size={28} />
                  <span className="mt-2 text-sm">Click to upload new image</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <p className="text-xs text-gray-400 mt-1">Leave unchanged to keep current image</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Updating…" : "Update Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
