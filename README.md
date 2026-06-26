# JeshuVerse E-Commerce Platform

**JeshuVerse** is a premium, fullstack e-commerce website designed for Men's Wear, Women's Wear, Kids' Wear, and fine Jewellery. Featuring a responsive, mobile-first design styled around a clean white background, black text, and elegant gold accents.

## Tech Stack

*   **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Lucide Icons.
*   **Backend:** Node.js, Express.js, PostgreSQL via Sequelize ORM.
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs encryption.
*   **Payments:** Razorpay Gateway API (with automatic fallback testing/mock mode).
*   **Ordering options:** Integrated prefilled WhatsApp order generation and click-to-call phone linkages.

---

## Folder Structure

```text
jeshuverse/
├── backend/                  # Node.js + Express API server
│   ├── config/               # Database connection configurations (Sequelize SSL)
│   ├── middleware/           # JWT and Admin authorization gates
│   ├── models/               # Sequelize model schemas (User, Product, Category, Review, Order, OrderItem, index.js)
│   ├── routes/               # API endpoints (Auth, Products, Orders, Payments, Categories)
│   ├── .env.example          # Environment variables template
│   ├── package.json          # Node dependencies list (Sequelize, pg, pg-hstore)
│   └── server.js             # Main server setup and database seeding
└── frontend/                 # React SPA
    ├── public/               # Static assets
    ├── src/
    │   ├── assets/           # Style illustrations and fonts
    │   ├── components/       # Common UI elements (Navbar, Footer, ProductCard, RatingStars, ProtectedRoute)
    │   ├── context/          # Context states (AuthContext, CartContext, WishlistContext)
    │   ├── pages/            # View pages (Home, ProductDetail, Catalog, Cart, Checkout, Success, Admin, Profile)
    │   ├── utils/            # Axios API config client
    │   ├── App.jsx           # Routing switch and provider bindings
    │   ├── index.css         # Custom animations and scrollbars
    │   └── main.jsx          # React bootstrap bootstrapper
    ├── tailwind.config.js    # Gold theme color overrides
    ├── postcss.config.js
    ├── vite.config.js        # Vite configs and proxy settings
    ├── .env.example          # Frontend configuration variables
    └── package.json          # UI package manager configs
```

---

## Local Setup Instructions

### Prerequisites
*   Node.js installed locally.
*   PostgreSQL running locally or a cloud database instance (e.g., Neon serverless PostgreSQL connection string).

### Step 1: Configure & Start Backend
1.  Navigate to the `backend/` directory.
2.  Duplicate `.env.example` and rename it to `.env`:
    ```bash
    cp .env.example .env
    ```
3.  Adjust variables inside `.env`:
    *   `DATABASE_URL`: Your PostgreSQL connection string. (e.g., `postgresql://user:password@localhost:5400/jeshuverse` or your Neon AWS string).
    *   `JWT_SECRET`: A secure random secret key string.
    *   `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Your Razorpay developer dashboard credentials.
    *   `WHATSAPP_NUMBER`: The WhatsApp number orders will open (e.g., `+919999999999`).
    *   `CONTACT_PHONE`: The phone number customer call buttons will trigger (e.g., `+919999999999`).
4.  Install dependencies and start the server:
    ```bash
    npm install
    npm run dev
    ```
    > [!NOTE]
    > **Automatic Seeding & Sync:** When the backend starts, it automatically synchronizes model definitions using `sequelize.sync({ alter: true })`. If the tables are blank, the server seeds Categories (Women, Men, Kids, Jewellery), Products, and initial product Reviews.
    > The first registered account automatically receives Admin privileges for easy dashboard testing.

### Step 2: Configure & Start Frontend
1.  Navigate to the `frontend/` directory.
2.  Duplicate `.env.example` and rename it to `.env`:
    ```bash
    cp .env.example .env
    ```
3.  Configure variables inside `.env`:
    *   `VITE_API_URL`: Set to `http://localhost:5000/api` for local environments (or `/api` if deploying on a unified root proxy).
    *   `VITE_WHATSAPP_NUMBER`: Customer service number.
    *   `VITE_CONTACT_PHONE`: Customer call line.
    *   `VITE_RAZORPAY_KEY_ID`: Client-side Razorpay key.
4.  Install dependencies and start the client:
    ```bash
    npm install
    npm run dev
    ```
5.  Open `http://localhost:5173` in your browser.

---

## Testing Payments & Dashboard

### 1. Mock Payment Mode
If you do not have Razorpay developer keys, leave the default placeholder credentials in `backend/.env`. 
When clicking **"Pay Online Now"** during checkout, the website detects the placeholder status and **automatically simulates a successful payment transaction**, creating the database order, decrementing stock, clearing your cart, and directing you to the Order Success receipt page. This allows full checkout flow verification immediately.

### 2. Admin Permissions
1.  Click **Login / Register** in the header.
2.  Create a brand new account.
3.  Since this is the first account registered in the database, the server seeds this account with `isAdmin: true` credentials.
4.  You will see an **Admin Dashboard** option appear in your user header dropdown menu.
5.  Open it to add/edit products, manage catalog counts, and update order statuses.

---

## Cloud Deployment Guide

### Database: Neon PostgreSQL (Serverless)
1.  Sign up at [Neon](https://neon.tech/).
2.  Create a project and grab your connection string: `postgresql://...`
3.  Add it to your backend env variables as `DATABASE_URL`.

### Backend: Render
1.  Sign up at [Render](https://render.com/).
2.  Click **New +** > **Web Service**.
3.  Connect your JeshuVerse git repository.
4.  Set:
    *   **Root Directory:** `backend`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
5.  In the environment tab, add the variable keys from `backend/.env` (PORT, DATABASE_URL, JWT_SECRET, RAZORPAY_KEY_ID, etc.).

### Frontend: Vercel
1.  Sign up at [Vercel](https://vercel.com/).
2.  Click **Add New** > **Project** and import your repository.
3.  Configure:
    *   **Framework Preset:** Vite
    *   **Root Directory:** `frontend`
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
4.  Add environment variables:
    *   `VITE_API_URL`: Your backend Web Service URL deployed on Render (e.g. `https://jeshuverse-backend.onrender.com/api`).
    *   `VITE_WHATSAPP_NUMBER`: Your business number.
    *   `VITE_CONTACT_PHONE`: Your call support line.
    *   `VITE_RAZORPAY_KEY_ID`: Your live/test Razorpay API key.
5.  Click **Deploy**.
