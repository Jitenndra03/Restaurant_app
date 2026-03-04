# 🍽️ Restaurant App

A full-stack restaurant management and food ordering web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Customers can browse menus, place orders, book tables, and leave reviews. Administrators have a dedicated dashboard to manage categories, menus, orders, and reservations.

---

## 📑 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [Frontend Pages & Components](#frontend-pages--components)
- [Backend Architecture](#backend-architecture)
- [Database Models](#database-models)
- [Authentication & Authorization](#authentication--authorization)
- [File Uploads](#file-uploads)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Customer Features
- **User Authentication** — Signup, login, and profile management with JWT
- **Browse Menu** — View menu items organized by categories
- **Menu Details** — View individual dish details, pricing, and reviews
- **Shopping Cart** — Add, update quantity, and remove items from cart
- **Checkout & Payment** — Place orders with integrated payment processing
- **Order History** — View past orders and their statuses on the "My Orders" page
- **Table Reservation** — Book a table for a specific date, time, and party size
- **My Bookings** — View and manage personal reservations
- **Reviews** — Leave ratings and reviews for menu items
- **Contact Page** — Reach out to the restaurant
- **Newsletter Subscription** — Subscribe to restaurant updates

### Admin Features
- **Admin Login** — Separate admin authentication flow
- **Dashboard** — Overview of key metrics (orders, bookings, revenue, etc.)
- **Category Management** — Create, edit, and delete food categories
- **Menu Management** — Add, edit, and delete menu items with image uploads
- **Order Management** — View all orders and update order statuses
- **Booking Management** — View all reservations and update booking statuses

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18+** | UI library |
| **Vite** | Build tool & dev server |
| **React Router DOM** | Client-side routing |
| **Context API** | Global state management |
| **Tailwind CSS / CSS** | Styling |
| **Axios / Fetch** | HTTP client for API calls |
| **ESLint** | Code linting |
| **Vercel** | Deployment platform |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT (jsonwebtoken)** | Token-based authentication |
| **bcrypt / bcryptjs** | Password hashing |
| **Multer** | Multipart file upload handling |
| **Cloudinary** | Cloud image storage & delivery |
| **dotenv** | Environment variable management |
| **CORS** | Cross-origin resource sharing |
| **Vercel** | Deployment platform |

---

## 📁 Project Structure

```
Restaurant_app/
├── frontend/                    # React client application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── assets/              # Images, icons, static resources
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Categories.jsx   # Category listing section
│   │   │   ├── Footer.jsx       # Site footer
│   │   │   ├── Hero.jsx         # Landing hero/banner section
│   │   │   ├── MenuCard.jsx     # Individual menu item card
│   │   │   ├── Menus.jsx        # Menu items grid/list section
│   │   │   ├── Navbar.jsx       # Navigation bar with auth state
│   │   │   ├── NewsLetter.jsx   # Newsletter signup component
│   │   │   └── Testimonial.jsx  # Customer testimonials section
│   │   ├── context/
│   │   │   └── AppContext.jsx   # Global state (auth, cart, data)
│   │   ├── pages/
│   │   │   ├── BookingTable.jsx # Table reservation form
│   │   │   ├── Cart.jsx         # Shopping cart page
│   │   │   ├── Checkout.jsx     # Order checkout & payment
│   │   │   ├── Contact.jsx      # Contact form/info page
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # User login
│   │   │   ├── Menu.jsx         # Full menu browsing page
│   │   │   ├── MenuDetails.jsx  # Single menu item detail view
│   │   │   ├── MyBookings.jsx   # User's reservations list
│   │   │   ├── MyOrders.jsx     # User's order history
│   │   │   ├── Signup.jsx       # User registration
│   │   │   └── admin/           # Admin panel pages
│   │   │       ├── AddCategory.jsx   # Create new category
│   │   │       ├── AddMenu.jsx       # Create new menu item
│   │   │       ├── AdminLayout.jsx   # Admin shell/sidebar layout
│   │   │       ├── AdminLogin.jsx    # Admin authentication
│   │   │       ├── Bookings.jsx      # Manage all reservations
│   │   │       ├── Categories.jsx    # Manage all categories
│   │   │       ├── Dashboard.jsx     # Admin overview dashboard
│   │   │       ├── EditCategory.jsx  # Edit existing category
│   │   │       ├── EditMenu.jsx      # Edit existing menu item
│   │   │       ├── Menus.jsx         # Manage all menu items
│   │   │       └── Orders.jsx        # Manage all orders
│   │   ├── App.jsx              # Root component & route definitions
│   │   ├── main.jsx             # React DOM entry point
│   │   └── index.css            # Global styles
│   ├── .env                     # Frontend environment variables
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   ├── eslint.config.js         # ESLint rules
│   ├── vercel.json              # Vercel deployment config
│   └── package.json
│
├── backend/                     # Express API server
│   ├── config/
│   │   ├── db.js                # MongoDB connection setup
│   │   └── cloudniary.js       # Cloudinary SDK configuration
│   ├── controllers/
│   │   ├── authControllers.js   # Register, login, profile logic
│   │   ├── cartController.js    # Cart CRUD operations
│   │   ├── categoryController.js# Category CRUD operations
│   │   ├── menuController.js    # Menu CRUD operations
│   │   ├── orderController.js   # Order placement & management
│   │   ├── paymentController.js # Payment creation & verification
│   │   ├── reservationController.js # Table booking management
│   │   └── reviewController.js  # Review CRUD operations
│   ├── middlewares/
│   │   ├── authMiddleware.js    # JWT verification & role-based access
│   │   └── multer.js            # File upload middleware config
│   ├── models/
│   │   ├── userModel.js         # User schema (name, email, password, role)
│   │   ├── categoryModel.js     # Category schema (name, image, etc.)
│   │   ├── menuModel.js         # Menu item schema (name, price, category, image, etc.)
│   │   ├── cartModel.js         # Cart schema (user ref, items, quantities)
│   │   ├── orderModel.js        # Order schema (user, items, total, status, payment)
│   │   ├── reservationModel.js  # Reservation schema (user, date, time, guests, status)
│   │   └── reviewModel.js       # Review schema (user, menu ref, rating, comment)
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/*
│   │   ├── cartRoutes.js        # /api/cart/*
│   │   ├── categoryRoutes.js    # /api/categories/*
│   │   ├── menuRoutes.js        # /api/menus/*
│   │   ├── orderRoutes.js       # /api/orders/*
│   │   ├── paymentRoutes.js     # /api/payments/*
│   │   ├── reservationRoutes.js # /api/reservations/*
│   │   └── reviewRoutes.js      # /api/reviews/*
│   ├── index.js                 # Express app entry point
│   ├── .env                     # Backend environment variables
│   ├── .env.example             # Env template for contributors
│   ├── vercel.json              # Vercel deployment config
│   └── package.json
│
└── README.md                    # This file
```

---

## 📋 Prerequisites

Make sure the following are installed on your machine:

- **Node.js** ≥ 16.x — [Download](https://nodejs.org/)
- **npm** ≥ 8.x (bundled with Node.js) or **yarn**
- **MongoDB** — Local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud instance
- **Cloudinary Account** — [Sign up free](https://cloudinary.com/) for image hosting
- **Git** — [Download](https://git-scm.com/)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/Restaurant_app.git
cd Restaurant_app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Edit `.env` with your actual values (see [Environment Variables](#environment-variables)).

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create or edit the `.env` file in `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/restaurant` |
| `JWT_SECRET` | Secret key for JWT signing | `your_jwt_secret_key_here` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `dxxxxxxxxx` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdefghijklmnopqrstuvwx` |
| `STRIPE_SECRET_KEY` *(if used)* | Stripe/payment provider key | `sk_test_...` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_BACKEND_URL` | Backend API base URL | `http://localhost:5000` |
| `VITE_STRIPE_PUBLIC_KEY` *(if used)* | Stripe publishable key | `pk_test_...` |

> ⚠️ **Never commit `.env` files.** They are listed in `.gitignore`.

---

## ▶️ Running the App

### Start the Backend

```bash
cd backend
npm run dev
# or
npm start
```

The API server starts at `http://localhost:5000` (or your configured PORT).

### Start the Frontend

```bash
cd frontend
npm run dev
```

Vite dev server starts at `http://localhost:5173`.

### Access the App

| URL | Description |
|---|---|
| `http://localhost:5173` | Customer-facing website |
| `http://localhost:5173/admin/login` | Admin login page |
| `http://localhost:5173/admin/dashboard` | Admin dashboard |
| `http://localhost:5000/api/...` | Backend REST API |

---

## 📡 API Reference

> Base URL: `http://localhost:5000/api`

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login and receive JWT token | ❌ |
| `GET` | `/profile` | Get logged-in user profile | ✅ User |

### Categories (`/api/categories`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/` | Get all categories | ❌ |
| `GET` | `/:id` | Get single category by ID | ❌ |
| `POST` | `/` | Create a new category | ✅ Admin |
| `PUT` | `/:id` | Update a category | ✅ Admin |
| `DELETE` | `/:id` | Delete a category | ✅ Admin |

### Menus (`/api/menus`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/` | Get all menu items (supports filtering) | ❌ |
| `GET` | `/:id` | Get single menu item details | ❌ |
| `POST` | `/` | Create menu item (with image) | ✅ Admin |
| `PUT` | `/:id` | Update menu item | ✅ Admin |
| `DELETE` | `/:id` | Delete menu item | ✅ Admin |

### Cart (`/api/cart`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/` | Get user's cart | ✅ User |
| `POST` | `/add` | Add item to cart | ✅ User |
| `PUT` | `/update` | Update item quantity | ✅ User |
| `DELETE` | `/remove/:itemId` | Remove item from cart | ✅ User |
| `DELETE` | `/clear` | Clear entire cart | ✅ User |

### Orders (`/api/orders`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/` | Place a new order | ✅ User |
| `GET` | `/my` | Get logged-in user's orders | ✅ User |
| `GET` | `/` | Get all orders | ✅ Admin |
| `PUT` | `/:id/status` | Update order status | ✅ Admin |

### Payments (`/api/payments`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/create` | Create payment intent/order | ✅ User |
| `POST` | `/verify` | Verify payment completion | ✅ User |

### Reservations (`/api/reservations`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/` | Book a table | ✅ User |
| `GET` | `/my` | Get user's bookings | ✅ User |
| `GET` | `/` | Get all bookings | ✅ Admin |
| `PUT` | `/:id/status` | Update booking status | ✅ Admin |

### Reviews (`/api/reviews`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/menu/:menuId` | Get reviews for a menu item | ❌ |
| `POST` | `/` | Create a review | ✅ User |
| `PUT` | `/:id` | Update own review | ✅ User |
| `DELETE` | `/:id` | Delete a review | ✅ User/Admin |

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | OK – Request succeeded |
| `201` | Created – Resource created |
| `400` | Bad Request – Validation error |
| `401` | Unauthorized – Missing/invalid token |
| `403` | Forbidden – Insufficient permissions |
| `404` | Not Found – Resource doesn't exist |
| `500` | Internal Server Error |

---

## 🖥️ Frontend Pages & Components

### Pages (Routes)

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page with hero, categories, popular menus, testimonials |
| Menu | `/menu` | Full menu listing with category filtering |
| Menu Details | `/menu/:id` | Individual dish details, reviews, add to cart |
| Cart | `/cart` | View and manage shopping cart |
| Checkout | `/checkout` | Finalize order and payment |
| My Orders | `/my-orders` | User's order history and tracking |
| Book a Table | `/book-table` | Table reservation form |
| My Bookings | `/my-bookings` | View personal reservations |
| Contact | `/contact` | Contact information/form |
| Login | `/login` | User login form |
| Signup | `/signup` | User registration form |
| Admin Login | `/admin/login` | Admin authentication |
| Admin Dashboard | `/admin/dashboard` | Overview stats and metrics |
| Admin Categories | `/admin/categories` | List/manage categories |
| Add Category | `/admin/categories/add` | Create category form |
| Edit Category | `/admin/categories/edit/:id` | Edit category form |
| Admin Menus | `/admin/menus` | List/manage menu items |
| Add Menu | `/admin/menus/add` | Create menu item form |
| Edit Menu | `/admin/menus/edit/:id` | Edit menu item form |
| Admin Orders | `/admin/orders` | View/manage all orders |
| Admin Bookings | `/admin/bookings` | View/manage all reservations |

### Reusable Components

| Component | Description |
|---|---|
| `Navbar.jsx` | Top navigation bar with links, auth state, cart icon |
| `Footer.jsx` | Site-wide footer with links and info |
| `Hero.jsx` | Landing page hero/banner section |
| `Categories.jsx` | Category cards grid on the home page |
| `Menus.jsx` | Menu items section (homepage or listing) |
| `MenuCard.jsx` | Single menu item card (image, name, price, add to cart) |
| `Testimonial.jsx` | Customer reviews/testimonials carousel |
| `NewsLetter.jsx` | Newsletter email subscription form |

### Context (`AppContext.jsx`)

Global state management providing:
- **Authentication state** — user, token, login/logout handlers
- **Cart state** — cart items, add/remove/update/clear
- **Data fetching** — categories, menus, orders, bookings
- **Shared utilities** — API base URL, toast notifications

---

## ⚙️ Backend Architecture

### Entry Point (`index.js`)

- Initializes Express app
- Connects to MongoDB via `config/db.js`
- Configures middleware (CORS, JSON parsing, etc.)
- Registers all route modules
- Starts the HTTP server

### Config

| File | Purpose |
|---|---|
| `db.js` | Mongoose connection to MongoDB using `MONGO_URI` |
| `cloudniary.js` | Cloudinary SDK initialization with credentials |

### Middlewares

| File | Purpose |
|---|---|
| `authMiddleware.js` | Verifies JWT from `Authorization` header; attaches user to `req`. May include role-based checks (e.g., `isAdmin`). |
| `multer.js` | Configures Multer for handling `multipart/form-data` image uploads (memory or disk storage). |

### Controllers (Business Logic)

| Controller | Responsibilities |
|---|---|
| `authControllers.js` | User registration (hash password, save to DB), login (validate credentials, sign JWT), get profile |
| `categoryController.js` | CRUD operations for food categories with optional image upload to Cloudinary |
| `menuController.js` | CRUD operations for menu items including image management via Cloudinary |
| `cartController.js` | User-specific cart: get cart, add item, update quantity, remove item, clear cart |
| `orderController.js` | Create order from cart, fetch user orders, fetch all orders (admin), update order status |
| `paymentController.js` | Create payment session/intent, verify payment, link payment to order |
| `reservationController.js` | Create booking, get user bookings, get all bookings (admin), update booking status |
| `reviewController.js` | Create, read, update, delete reviews linked to menu items and users |

### Routes

Each route file maps HTTP methods and paths to controller functions and applies appropriate middlewares.

| Route File | Prefix | Middleware |
|---|---|---|
| `authRoutes.js` | `/api/auth` | None (public) / Auth (profile) |
| `categoryRoutes.js` | `/api/categories` | None (read) / Auth + Admin (write) |
| `menuRoutes.js` | `/api/menus` | None (read) / Auth + Admin + Multer (write) |
| `cartRoutes.js` | `/api/cart` | Auth (all) |
| `orderRoutes.js` | `/api/orders` | Auth (user) / Auth + Admin (manage) |
| `paymentRoutes.js` | `/api/payments` | Auth (all) |
| `reservationRoutes.js` | `/api/reservations` | Auth (user) / Auth + Admin (manage) |
| `reviewRoutes.js` | `/api/reviews` | None (read) / Auth (write) |

---

## 🗄️ Database Models

### User (`userModel.js`)
| Field | Type | Description |
|---|---|---|
| `name` | String | User's full name |
| `email` | String | Unique email address |
| `password` | String | Hashed password (bcrypt) |
| `role` | String | `"user"` or `"admin"` |
| `createdAt` | Date | Account creation timestamp |

### Category (`categoryModel.js`)
| Field | Type | Description |
|---|---|---|
| `name` | String | Category name (e.g., "Appetizers") |
| `image` | String | Cloudinary image URL |

### Menu (`menuModel.js`)
| Field | Type | Description |
|---|---|---|
| `name` | String | Dish name |
| `description` | String | Dish description |
| `price` | Number | Price in currency |
| `category` | ObjectId | Reference to Category |
| `image` | String | Cloudinary image URL |
| `isAvailable` | Boolean | Availability flag |

### Cart (`cartModel.js`)
| Field | Type | Description |
|---|---|---|
| `user` | ObjectId | Reference to User |
| `items` | Array | `[{ menuItem: ObjectId, quantity: Number }]` |

### Order (`orderModel.js`)
| Field | Type | Description |
|---|---|---|
| `user` | ObjectId | Reference to User |
| `items` | Array | `[{ menuItem: ObjectId, quantity, price }]` |
| `totalAmount` | Number | Order total |
| `status` | String | `"pending"`, `"confirmed"`, `"preparing"`, `"delivered"`, `"cancelled"` |
| `paymentStatus` | String | `"pending"`, `"paid"`, `"failed"` |
| `address` | Object | Delivery/billing address |
| `createdAt` | Date | Order timestamp |

### Reservation (`reservationModel.js`)
| Field | Type | Description |
|---|---|---|
| `user` | ObjectId | Reference to User |
| `date` | Date | Reservation date |
| `time` | String | Reservation time slot |
| `guests` | Number | Number of guests |
| `status` | String | `"pending"`, `"confirmed"`, `"cancelled"` |
| `specialRequests` | String | Optional notes |

### Review (`reviewModel.js`)
| Field | Type | Description |
|---|---|---|
| `user` | ObjectId | Reference to User |
| `menu` | ObjectId | Reference to Menu |
| `rating` | Number | 1–5 star rating |
| `comment` | String | Review text |
| `createdAt` | Date | Review timestamp |

---

## 🔒 Authentication & Authorization

1. **Registration** — Password is hashed with `bcrypt` before storage.
2. **Login** — Credentials are verified; a **JWT** token is returned.
3. **Protected Routes** — `authMiddleware` extracts the token from the `Authorization: Bearer <token>` header, verifies it, and attaches the user to `req.user`.
4. **Admin Routes** — An additional role check ensures `req.user.role === "admin"`.
5. **Frontend** — Token is stored (localStorage/context) and sent with every authenticated API request.

### Auth Flow Diagram

```
┌──────────┐        POST /api/auth/login         ┌──────────┐
│  Client   │ ──────────────────────────────────► │  Server  │
│ (React)   │                                     │ (Express)│
│           │ ◄────────────────────────────────── │          │
│           │        { token: "jwt..." }          │          │
│           │                                     │          │
│           │  GET /api/orders/my                  │          │
│           │  Authorization: Bearer jwt...        │          │
│           │ ──────────────────────────────────► │          │
│           │                                     │          │
│           │ ◄────────────────────────────────── │          │
│           │        { orders: [...] }            │          │
└──────────┘                                     └──────────┘
```

---

## 📸 File Uploads

1. **Client** sends a `multipart/form-data` request with an image file.
2. **Multer middleware** intercepts and processes the file upload.
3. **Controller** uploads the file buffer/path to **Cloudinary**.
4. **Cloudinary** returns a secure URL that is stored in the database.

```
Client ─► Multer (parse file) ─► Cloudinary (upload) ─► MongoDB (store URL)
```

---

## 🚢 Deployment

Both frontend and backend include `vercel.json` for **Vercel** deployment.

### Deploy Backend to Vercel

```bash
cd backend
vercel --prod
```

### Deploy Frontend to Vercel

```bash
cd frontend
vercel --prod
```

### Deployment Checklist

- [ ] Set all environment variables in Vercel dashboard
- [ ] Update `VITE_BACKEND_URL` to production backend URL
- [ ] Update `CLIENT_URL` in backend to production frontend URL
- [ ] Ensure MongoDB Atlas allows connections from Vercel IPs (or use `0.0.0.0/0`)
- [ ] Verify Cloudinary credentials are set
- [ ] Test all API endpoints after deployment

### Alternative Deployment Options

| Platform | Frontend | Backend |
|---|---|---|
| **Vercel** | ✅ | ✅ |
| **Netlify** | ✅ | ❌ (use serverless functions) |
| **Render** | ✅ | ✅ |
| **Railway** | ✅ | ✅ |
| **AWS EC2** | ✅ | ✅ |
| **DigitalOcean** | ✅ | ✅ |

---

## 📸 Screenshots

> Add screenshots of the application here.

| Page | Screenshot |
|---|---|
| Home Page | *Add screenshot* |
| Menu Page | *Add screenshot* |
| Cart | *Add screenshot* |
| Admin Dashboard | *Add screenshot* |
| Admin Menu Management | *Add screenshot* |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and folder structure
- Write descriptive commit messages
- Test API endpoints before submitting PRs
- Do not commit `.env` files

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Jitendra**

- GitHub: [@your-github-username](https://github.com/your-github-username)

---

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)