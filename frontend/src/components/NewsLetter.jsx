/**
 * NewsLetter - Email subscription call-to-action section.
 * Amber background with a simple email input form.
 */
import { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  /** Handle form submission (client-only for now) */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed successfully!");
    setEmail("");
  };

  return (
    <section className="bg-linear-to-r from-amber-500 to-orange-500 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Stay Updated
        </h2>
        <p className="text-amber-100 mb-8 text-lg">
          Subscribe to our newsletter for exclusive deals, new menu drops and culinary stories.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-5 py-3.5 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-7 py-3.5 rounded-full font-semibold transition cursor-pointer"
          >
            <Send size={16} /> Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsLetter;
