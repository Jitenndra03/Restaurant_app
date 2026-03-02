/**
 * Footer - Site-wide footer with links, newsletter subscription and social icons.
 * Uses a dark charcoal background with amber accents.
 */
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-bold tracking-tight">
              <span className="text-amber-500">Savory</span>
              <span className="text-white">Bites</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Crafting unforgettable dining experiences with the finest ingredients and passion-driven recipes since 2020.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-amber-400 transition">Home</Link></li>
              <li><Link to="/menu" className="hover:text-amber-400 transition">Menu</Link></li>
              <li><Link to="/book-table" className="hover:text-amber-400 transition">Book a Table</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Opening Hours</h4>
            <ul className="space-y-2.5 text-sm">
              <li>Mon – Fri: 10 AM – 10 PM</li>
              <li>Saturday: 11 AM – 11 PM</li>
              <li>Sunday: 12 PM – 9 PM</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Get in Touch</h4>
            <ul className="space-y-2.5 text-sm">
              <li>123 Foodie Street, NY 10001</li>
              <li>+1 (555) 234-5678</li>
              <li>hello@savorybites.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} SavoryBites. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
