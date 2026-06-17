# ShopEZ 🛍️ — Modern MERN Stack E-Commerce Platform

ShopEZ is a feature-rich, high-performance e-commerce platform built using the MERN stack (MongoDB, Express, React, Node.js). It features a polished customer storefront and a comprehensive, dynamic administrative portal for managing catalogs, orders, and customer accounts.

---

## 🌟 Key Features

### 🛒 Customer Storefront
- **Responsive Catalog**: Browse products across multiple categories (e.g., Electronics, Fashion, Home Decor) with optimized grid sizes.
- **Persistent Cart & Wishlist**: Scoped per-user wishlist items and shopping cart state stored locally.
- **Protected Wishlist**: Seamlessly redirects logged-out users to log in if they try to access wishlist features.
- **Dynamic Product Details**: Clean product pages featuring size selectors (hidden dynamically for Electronics and Home Decor), high-quality image previews, and automated similar products recommendations.
- **Checkout Process**: Streamlined checkout system with local currency conversion (Indian Rupees - ₹).

### 💼 Admin Portal
- **Dashboard Metrics**: Real-time visualization of Total Revenue, New Orders, Active Products, and Total Customers.
- **Interactive Orders Table**: Track recent orders, review detailed customer actions, and execute quick updates (e.g., Mark as Shipped, Mark as Delivered, or Cancel Order) with real-time database synchronizations.
- **Catalog Management**: Admin forms to add/edit products with smart input forms (swaps complex size grids for a single "Stock Quantity" field automatically for Electronics & Home Decor).
- **Data Export**: Export entire sales and customer order lists into a structured CSV format at the click of a button.
- **Printable Invoices**: Clean, isolated `@media print` style sheets that strip headers, footers, and dashboard layout elements to print clean physical or PDF receipts.
- **Automatic Role Redirection**: Protects routes and automatically redirects administrators directly to the Dashboard on login or root access.

---

## 💻 Tech Stack

- **Frontend**: React (Vite, Context API for Auth, Cart, and Wishlist state management)
- **Styling**: Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Icons**: Google Material Symbols

---

## 📂 Project Structure

```text
ShopEZ/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable layout & common UI components
│   │   ├── context/        # React Context providers (Auth, Cart, Wishlist)
│   │   ├── pages/          # Page views (Admin Dashboard, Checkout, Cart, Products, etc.)
│   │   ├── routes/         # Protected and public routing definitions
│   │   ├── services/       # Axios API integrations
│   │   ├── index.css       # Core Tailwind theme configuration
│   │   └── main.jsx        # App entry point
│   ├── vite.config.js
│   └── package.json
│
├── server/                 # Backend REST API Application
│   ├── config/             # DB connection config
│   ├── controllers/        # Express request controllers (Auth, Products, Orders, Admin)
│   ├── models/             # Mongoose schemas (User, Product, Order, Cart)
│   ├── routes/             # Express route mappings
│   ├── seed.js             # Initial database seeding script
│   ├── index.js            # Server entry point
│   └── package.json
│
└── MERN Phase Wise/        # Phase-wise Project Documentation & Templates
    ├── Phase Wise Templets/ # SDLC templates for each phase (Brainstorming, Design, Dev, etc.)
    └── Project Documentation/# MERN stack project reference materials & guidebooks
```

---

## 📁 MERN Phase-Wise Documentation

The project includes structured SDLC planning and template files located in the `MERN Phase Wise/` directory, mapping out the entire lifecycle of the ShopEZ platform:

1. **Brainstorming & Ideation Phase**: Empathy maps, problem statements, and brainstorming templates.
2. **Requirement Analysis**: Data Flow Diagrams (DFDs), User Stories, and technology stack templates.
3. **Project Planning Phase**: Comprehensive project planning schedules and timelines.
4. **Project Design Phase**: Architecture layouts, proposed solution templates, and problem-solution fit sheets.
5. **Project Development & Testing**: User Acceptance Testing (UAT) templates and specifications.
6. **Comprehensive Documentation**: Complete guide on Full Stack Development with the MERN stack (`Full Stack Development with MERN.pdf`).

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas connection string

### 1. Clone & Initialize Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and fill in your connection details:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/shopez
   JWT_SECRET=your_jwt_secret_key
   ```
4. Seed the database with sample products, categories, and default users (Admin + Customer):
   ```bash
   npm run seed
   ```
   *Note: This creates an Admin account (`admin@shopez.com` / `admin123`) and a Customer account (`customer@shopez.com` / `customer123`).*

5. Start the backend server:
   ```bash
   npm run start
   ```

### 2. Initialize Client
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3001` to interact with the web app.

---

## 🛠️ Main NPM Scripts

### Backend (`/server`)
- `npm run start` or `node index.js`: Runs the API server.
- `npm run seed`: Clears existing records and seeds fresh demo catalogs and credentials.

### Frontend (`/client`)
- `npm run dev`: Starts the local development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles and bundles production-ready assets into the `dist/` directory.
