/**
 * AddCategory - Form to create a new food category with image upload.
 * Sends POST /api/category/add as multipart/form-data.
 */
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const AddCategory = () => {
  const { navigate, axios } = useContext(AppContext);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /** Handle file selection and preview */
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
    if (!name || !image) {
      toast.error("Please provide category name and image");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      const { data } = await axios.post("/api/category/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/admin/categories");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate("/admin/categories")}
        className="flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6 transition cursor-pointer"
      >
        <ArrowLeft size={18} /> Back to Categories
      </button>

      <div className="max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Category</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Appetizers"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
            />
          </div>

          {/* Image upload */}
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
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
