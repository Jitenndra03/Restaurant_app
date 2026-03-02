/**
 * Menu - Full menu page with category filter, veg/non-veg toggle, and search bar.
 */
import { useContext, useState, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import Categories from "../components/Categories";
import MenuCard from "../components/MenuCard";
import { Search } from "lucide-react";

const Menu = () => {
  const { menus } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [dietFilter, setDietFilter] = useState("all"); // "all" | "veg" | "nonveg"

  // Filter by category, diet, and search
  const filtered = useMemo(() => {
    let items = menus;
    if (selectedCategory !== "All") {
      items = items.filter((m) => m.category?.name === selectedCategory);
    }
    if (dietFilter === "veg") items = items.filter((m) => m.isVeg === true);
    if (dietFilter === "nonveg") items = items.filter((m) => m.isVeg === false);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q)
      );
    }
    return items;
  }, [menus, selectedCategory, search, dietFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white">Our Menu</h1>
          <p className="text-amber-100 mt-2">
            Explore our carefully curated selection of dishes
          </p>

          {/* Search */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Category filter */}
      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Veg / Non-Veg toggle strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-500">Diet:</span>
        {[
          { key: "all", label: "All" },
          { key: "veg", label: "Veg", dot: "bg-green-500" },
          { key: "nonveg", label: "Non-Veg", dot: "bg-red-500" },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setDietFilter(opt.key)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer border ${
              dietFilter === opt.key
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"
            }`}
          >
            {opt.dot && <span className={`w-2.5 h-2.5 rounded-full ${opt.dot}`} />}
            {opt.label}
          </button>
        ))}
      </div>

      {/* Menu grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-16 text-lg">
            No dishes found. Try a different search or category.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
