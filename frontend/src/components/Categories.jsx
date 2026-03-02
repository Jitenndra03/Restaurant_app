/**
 * Categories - Horizontal scrollable category filter chips.
 * Displays all meal categories fetched from the API.
 * Selected category is highlighted with amber fill.
 */
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Categories = ({ selectedCategory, setSelectedCategory }) => {
  const { categories } = useContext(AppContext);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Browse by <span className="text-amber-600">Category</span>
        </h2>

        {/* Scrollable chips */}
        <div className="flex flex-wrap justify-center gap-3">
          {/* "All" chip always shown first */}
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition cursor-pointer ${
              selectedCategory === "All"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition cursor-pointer ${
                selectedCategory === cat.name
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
