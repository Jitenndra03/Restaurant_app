/**
 * Menus - Grid section showing a limited set of MenuCards (homepage preview).
 * Filters by selected category and limits to 8 items.
 */
import { useContext, useState, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import Categories from "./Categories";
import MenuCard from "./MenuCard";

const Menus = () => {
  const { menus, navigate } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter menus by selected category
  const filtered = useMemo(() => {
    if (selectedCategory === "All") return menus;
    return menus.filter((item) => item.category?.name === selectedCategory);
  }, [menus, selectedCategory]);

  // Limit items shown on homepage
  const displayed = filtered.slice(0, 8);

  return (
    <section className="py-16 bg-gray-50">
      {/* Category filter chips */}
      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {displayed.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No items found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayed.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* View All CTA */}
        {filtered.length > 8 && (
          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/menu")}
              className="bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white px-8 py-3 rounded-full font-semibold transition cursor-pointer"
            >
              View Full Menu
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Menus;
