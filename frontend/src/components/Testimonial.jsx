/**
 * Testimonial - Customer reviews section with horizontal card layout.
 * Hardcoded reviews for now (no backend endpoint).
 */
import { Star } from "lucide-react";

/** Static review data */
const reviews = [
  {
    id: 1,
    name: "Sarah M.",
    text: "Absolutely incredible dining experience! The flavours were bold yet refined. Will definitely be coming back.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "James T.",
    text: "Best steak I have ever had — cooked to perfection. The ambiance was warm and the service impeccable.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Priya K.",
    text: "Loved the vegetarian options! Creative dishes that don't compromise on taste. Highly recommended.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Testimonial = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          What Our <span className="text-amber-600">Guests</span> Say
        </h2>
        <p className="text-gray-500 text-center mt-3 max-w-lg mx-auto">
          Real feedback from real food lovers. We take pride in every meal we serve.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">"{r.text}"</p>
              <div className="flex items-center gap-3 mt-5">
                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                <span className="font-semibold text-gray-800 text-sm">{r.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
