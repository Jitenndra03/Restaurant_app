/**
 * MenuCard - Individual menu item card with veg badge, rating stars, price and add-to-cart.
 */
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Plus, Star } from "lucide-react";

const MenuCard = ({ item }) => {
  const { navigate, addToCart } = useContext(AppContext);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Image */}
      <div
        onClick={() => navigate(`/menu/${item._id}`)}
        className="relative h-52 overflow-hidden cursor-pointer"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category badge */}
        {item.category?.name && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-2.5 py-1 rounded-full">
            {item.category.name}
          </span>
        )}
        {/* Veg / Non-veg indicator */}
        <span className={`absolute top-3 right-3 w-5 h-5 rounded-sm border-2 flex items-center justify-center ${item.isVeg !== false ? "border-green-600" : "border-red-600"}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg !== false ? "bg-green-600" : "bg-red-600"}`} />
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3
          onClick={() => navigate(`/menu/${item._id}`)}
          className="font-semibold text-gray-900 text-lg cursor-pointer hover:text-amber-600 transition line-clamp-1"
        >
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Rating */}
        {item.rating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-gray-700">{item.rating}</span>
            <span className="text-xs text-gray-400">({item.ratingCount})</span>
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-amber-600">
            &#8377;{item.price}
          </span>
          <button
            onClick={() => addToCart(item._id)}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-full transition shadow-sm cursor-pointer"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
