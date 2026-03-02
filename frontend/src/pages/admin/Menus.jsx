/**
 * Admin Menus - Table listing all menu items.
 * Supports toggling availability (PATCH /api/menu/toggle/:id)
 * and deleting items (DELETE /api/menu/delete/:id).
 */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { Plus, Trash2, ToggleLeft, ToggleRight, Loader2, Pencil } from "lucide-react";
import toast from "react-hot-toast";

const Menus = () => {
  const { axios } = useContext(AppContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Fetch all menu items */
  const fetchMenus = async () => {
    try {
      const { data } = await axios.get("/api/menu/all");
      if (data.success) setItems(data.menuItems);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  /** Toggle availability */
  const handleToggle = async (id) => {
    try {
      const { data } = await axios.patch(`/api/menu/toggle/${id}`);
      if (data.success) {
        toast.success(data.message);
        // Update local state optimistically
        setItems((prev) =>
          prev.map((m) => (m._id === id ? { ...m, isAvailable: !m.isAvailable } : m))
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Toggle failed");
    }
  };

  /** Delete a menu item */
  const handleDelete = async (id) => {
    if (!confirm("Delete this menu item?")) return;
    try {
      const { data } = await axios.delete(`/api/menu/delete/${id}`);
      if (data.success) {
        toast.success("Deleted");
        setItems((prev) => prev.filter((m) => m._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
        <Link
          to="/admin/add-menu"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          <Plus size={16} /> Add Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
          <p className="text-gray-400">No menu items yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Image</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-center">Available</th>
                  <th className="px-6 py-3 text-center">Veg</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <img src={m.image} alt={m.name} className="w-12 h-12 rounded-lg object-cover" />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-[180px] truncate">{m.name}</td>
                    <td className="px-6 py-4 text-gray-500">{m.category?.name || "—"}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">${m.price}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggle(m._id)}
                        className="cursor-pointer"
                        title={m.isAvailable !== false ? "Disable" : "Enable"}
                      >
                        {m.isAvailable !== false ? (
                          <ToggleRight size={24} className="text-green-500" />
                        ) : (
                          <ToggleLeft size={24} className="text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`w-4 h-4 rounded-full inline-block ${m.isVeg !== false ? "bg-green-500" : "bg-red-500"}`} />
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                      <Link to={`/admin/edit-menu/${m._id}`} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition" title="Edit">
                        <Pencil size={16} />
                      </Link>
                      <button onClick={() => handleDelete(m._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition cursor-pointer" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menus;
