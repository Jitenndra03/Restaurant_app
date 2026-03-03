/**
 * seed.js - Populate the database with Indian food categories & menu items.
 *
 * Usage:  node seed.js
 *
 * - Connects to MongoDB (MONGO_URI from .env)
 * - Uploads placeholder images to Cloudinary
 * - Creates categories & menu items
 * - Everything stays manageable from the Admin panel (add / edit / delete)
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Category from "./models/categoryModel.js";
import Menu from "./models/menuModel.js";

// ── Cloudinary config ──────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Helpers ────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tmpDir = path.join(__dirname, "tmp_seed");

/** Download a URL to a local temp file and return the path */
function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const dest = path.join(tmpDir, filename);
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(dest);
          return downloadFile(res.headers.location, filename).then(resolve).catch(reject);
        }
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(dest); });
      })
      .on("error", (err) => { fs.unlinkSync(dest); reject(err); });
  });
}

/** Upload a local file to Cloudinary and return the secure URL */
async function uploadToCloudinary(localPath, folder) {
  const result = await cloudinary.uploader.upload(localPath, {
    folder,
    resource_type: "image",
  });
  return result.secure_url;
}

/**
 * For each item, try to upload a relevant image from picsum/unsplash.
 * Falls back to a solid-colour placeholder if anything fails.
 */
async function getImageUrl(tag, folder) {
  try {
    // Use picsum.photos (no API key needed) with a unique seed per item
    const seed = encodeURIComponent(tag.replace(/\s/g, "-").toLowerCase());
    const url = `https://picsum.photos/seed/${seed}/600/400`;
    const localPath = await downloadFile(url, `${seed}.jpg`);
    const cloudUrl = await uploadToCloudinary(localPath, folder);
    return cloudUrl;
  } catch {
    // Fallback: upload a text overlay placeholder via Cloudinary URL builder
    return `https://placehold.co/600x400/f59e0b/ffffff?text=${encodeURIComponent(tag)}`;
  }
}

// ── Seed data ──────────────────────────────────────────────────────
const CATEGORIES = [
  "Starters",
  "Main Course",
  "Breads",
  "Rice & Biryani",
  "Desserts",
  "Beverages",
  "Street Food",
  "Thali",
];

const MENU_ITEMS = {
  Starters: [
    { name: "Paneer Tikka", description: "Marinated cottage cheese cubes grilled in a tandoor with bell peppers and onions, served with mint chutney", price: 249 },
    { name: "Samosa (2 pcs)", description: "Crispy golden pastry stuffed with spiced potatoes and peas, served with tamarind and green chutney", price: 99 },
    { name: "Chicken Seekh Kebab", description: "Juicy minced chicken kebabs seasoned with aromatic spices and fresh herbs, cooked on skewers in a tandoor", price: 299, isVeg: false },
    { name: "Hara Bhara Kebab", description: "Healthy spinach, peas and potato patties lightly spiced and shallow-fried to a perfect golden crisp", price: 179 },
    { name: "Fish Amritsari", description: "Boneless fish fillets coated in spiced gram flour batter and deep-fried Amritsar style until crunchy", price: 329, isVeg: false },
    { name: "Aloo Tikki Chaat", description: "Crispy potato patties topped with tangy chutneys, yoghurt, pomegranate seeds and crunchy sev", price: 149 },
  ],
  "Main Course": [
    { name: "Butter Chicken", description: "Tender chicken pieces simmered in a rich and creamy tomato-butter gravy seasoned with aromatic spices", price: 349, isVeg: false },
    { name: "Paneer Butter Masala", description: "Soft paneer cubes in a luscious buttery tomato gravy, mildly spiced and finished with fresh cream", price: 299 },
    { name: "Dal Makhani", description: "Slow-cooked black lentils and kidney beans in a creamy, buttery gravy, simmered overnight for deep flavour", price: 249 },
    { name: "Chole Masala", description: "North-Indian style chickpea curry cooked with onions, tomatoes and aromatic whole spices", price: 219 },
    { name: "Mutton Rogan Josh", description: "Tender mutton slow-cooked in a rich Kashmiri gravy of yoghurt, saffron and whole spices", price: 449, isVeg: false },
    { name: "Palak Paneer", description: "Cottage cheese cubes in a smooth and flavourful spinach gravy tempered with garlic and cumin", price: 269 },
    { name: "Chicken Tikka Masala", description: "Grilled chicken tikka pieces tossed in a spiced onion-tomato masala gravy, a restaurant favourite", price: 369, isVeg: false },
    { name: "Malai Kofta", description: "Deep-fried paneer and potato dumplings simmered in a rich, creamy cashew and tomato-based gravy", price: 289 },
  ],
  Breads: [
    { name: "Butter Naan", description: "Soft and fluffy leavened bread baked in a tandoor and brushed generously with melted butter", price: 59 },
    { name: "Garlic Naan", description: "Tandoor-baked naan topped with minced garlic, coriander leaves and a drizzle of butter", price: 69 },
    { name: "Tandoori Roti", description: "Whole wheat bread baked fresh in a clay tandoor, light and perfect with any gravy or dal", price: 39 },
    { name: "Lachha Paratha", description: "Multi-layered flaky whole wheat paratha cooked on a tawa with butter, crispy on the outside", price: 59 },
    { name: "Missi Roti", description: "Gram flour and wheat flour roti flavoured with onions, green chillies and fresh coriander", price: 49 },
    { name: "Cheese Naan", description: "Naan bread stuffed with a generous filling of melted cheese, baked in a tandoor until golden", price: 89 },
  ],
  "Rice & Biryani": [
    { name: "Chicken Biryani", description: "Fragrant basmati rice layered with spiced chicken, saffron and caramelised onions, slow-cooked dum style", price: 349, isVeg: false },
    { name: "Mutton Biryani", description: "Royal Hyderabadi style biryani with tender mutton pieces, aromatic spices and long-grain basmati rice", price: 449, isVeg: false },
    { name: "Veg Biryani", description: "Flavourful basmati rice cooked with seasonal vegetables, whole spices, saffron and fried onions", price: 249 },
    { name: "Jeera Rice", description: "Steamed basmati rice tempered with cumin seeds and ghee, a perfect accompaniment to any curry", price: 149 },
    { name: "Paneer Biryani", description: "Aromatic basmati rice layered with marinated paneer cubes, mint, and caramelised onions, dum cooked", price: 299 },
  ],
  Desserts: [
    { name: "Gulab Jamun (2 pcs)", description: "Soft deep-fried milk-solid dumplings soaked in warm rose and cardamom flavoured sugar syrup", price: 99 },
    { name: "Rasmalai (2 pcs)", description: "Spongy cottage cheese patties soaked in chilled saffron and cardamom flavoured thickened milk", price: 129 },
    { name: "Gajar Ka Halwa", description: "Traditional warm carrot pudding slow-cooked with milk, ghee, sugar and garnished with dry fruits", price: 149 },
    { name: "Kulfi Falooda", description: "Creamy traditional Indian ice cream served with vermicelli, rose syrup and basil seeds", price: 169 },
    { name: "Jalebi", description: "Crispy deep-fried spirals of fermented batter soaked in saffron sugar syrup, served warm", price: 99 },
    { name: "Shahi Tukda", description: "Royal Mughlai dessert of fried bread slices soaked in sweetened milk, topped with rabri and nuts", price: 159 },
  ],
  Beverages: [
    { name: "Masala Chai", description: "Authentic Indian spiced tea brewed with ginger, cardamom, cinnamon and fresh milk leaves", price: 49 },
    { name: "Mango Lassi", description: "Refreshing chilled yoghurt drink blended with ripe Alphonso mango pulp and a hint of cardamom", price: 99 },
    { name: "Sweet Lassi", description: "Traditional thick and creamy yoghurt drink sweetened with sugar and topped with fresh malai", price: 79 },
    { name: "Fresh Lime Soda", description: "Freshly squeezed lime juice mixed with soda water, served sweet or salted as per your preference", price: 69 },
    { name: "Rose Sharbat", description: "Chilled rose-flavoured traditional Indian drink with basil seeds, perfect for hot summer days", price: 79 },
    { name: "Filter Coffee", description: "Strong South-Indian style coffee brewed with freshly ground beans, served with frothy hot milk", price: 59 },
  ],
  "Street Food": [
    { name: "Pav Bhaji", description: "Mumbai-style spiced mixed vegetable mash served with buttered and toasted soft bread rolls", price: 169 },
    { name: "Chole Bhature", description: "Spicy chickpea curry served with deep-fried fluffy puffed bread, a classic North-Indian combo", price: 179 },
    { name: "Pani Puri (6 pcs)", description: "Crispy hollow puris filled with spiced potato, chickpeas and tangy mint water, burst of flavours", price: 89 },
    { name: "Vada Pav", description: "Mumbai's famous street burger — spiced potato fritter in a soft bread bun with garlic and tamarind chutney", price: 69 },
    { name: "Dahi Bhalla", description: "Soft lentil dumplings soaked in creamy beaten yoghurt, topped with sweet and tangy chutneys", price: 129 },
    { name: "Kathi Roll", description: "Flaky paratha wrapped around spiced grilled paneer or chicken filling with onions and green chutney", price: 159, isVeg: false },
  ],
  Thali: [
    { name: "North Indian Veg Thali", description: "Complete meal with dal, paneer curry, seasonal sabzi, raita, rice, roti, papad, pickle and dessert", price: 349 },
    { name: "North Indian Non-Veg Thali", description: "Grand meal with butter chicken, dal, rice, naan, raita, salad, papad, pickle and gulab jamun", price: 449, isVeg: false },
    { name: "South Indian Thali", description: "Traditional meal with sambar, rasam, kootu, poriyal, curd rice, papad, payasam and steamed rice", price: 329 },
    { name: "Rajasthani Thali", description: "Royal Rajasthani spread with dal baati churma, gatte ki sabzi, ker sangri, bajra roti and more", price: 399 },
  ],
};

// ── Main seed function ─────────────────────────────────────────────
async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✔ Connected to MongoDB");

    // Optional: clear existing data (comment out if you want to append)
    await Category.deleteMany({});
    await Menu.deleteMany({});
    console.log("✔ Cleared existing categories & menu items");

    // 1) Create categories with images
    const categoryMap = {}; // name → _id
    for (const catName of CATEGORIES) {
      console.log(`  ↳ Uploading image for category: ${catName}…`);
      const imageUrl = await getImageUrl(`Indian-${catName}`, "restaurant/categories");
      const cat = await Category.create({ name: catName, image: imageUrl });
      categoryMap[catName] = cat._id;
      console.log(`  ✔ Category "${catName}" created`);
    }

    // 2) Create menu items
    let totalItems = 0;
    for (const [catName, items] of Object.entries(MENU_ITEMS)) {
      const categoryId = categoryMap[catName];
      for (const item of items) {
        console.log(`  ↳ Uploading image for: ${item.name}…`);
        const imageUrl = await getImageUrl(item.name, "restaurant/menu");
        await Menu.create({
          name: item.name,
          description: item.description,
          price: item.price,
          image: imageUrl,
          category: categoryId,
          isAvailable: true,
          isVeg: item.isVeg !== undefined ? item.isVeg : true,
        });
        totalItems++;
        console.log(`  ✔ Menu item "${item.name}" created (${totalItems})`);
      }
    }

    console.log(`\n🎉 Seeding complete! ${CATEGORIES.length} categories & ${totalItems} menu items added.`);
    console.log("   Manage everything from the Admin panel → /admin/login");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    // Cleanup temp files
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
