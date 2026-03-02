/**
 * Hero - Full-screen landing section with headline, CTA and decorative image.
 * Gradient overlay on a food background for visual depth.
 */
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const { navigate } = useContext(AppContext);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-linear-to-br from-amber-50 via-white to-orange-50">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="max-w-xl">
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
              Welcome to SavoryBites
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Experience the Art of <span className="text-amber-600">Fine Dining</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              From farm-fresh ingredients to exquisite plating, every dish tells a story. Discover a menu crafted with love by our award-winning chefs.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/menu")}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-7 py-3.5 rounded-full font-semibold transition shadow-lg shadow-amber-500/25 cursor-pointer"
              >
                Explore Menu <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/book-table")}
                className="flex items-center gap-2 border-2 border-gray-300 hover:border-amber-500 text-gray-700 hover:text-amber-600 px-7 py-3.5 rounded-full font-semibold transition cursor-pointer"
              >
                Book a Table
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="w-105 h-105 rounded-full bg-linear-to-br from-amber-400 to-orange-500 p-2 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop"
                  alt="Delicious food plate"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-lg font-bold">
                  ★
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Top Rated</p>
                  <p className="text-xs text-gray-500">4.9 / 5 rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
