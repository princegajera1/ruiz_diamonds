# Rulz Diamonds | Professional Project Documentation

## 💎 Project Overview
**Rulz Diamonds** is a premium, full-stack e-commerce platform designed for high-end jewelry retail. The application combines a sophisticated, minimalist aesthetic with robust administrative controls, providing a seamless luxury shopping experience for customers and a powerful management tool for business owners.

---

## 🚀 Key Features

### 🛍️ Customer Experience
- **Dynamic Shop Engine**: Real-time filtering by categories (Gold, Diamonds, Rings, Earrings) with clean URL routing.
- **Luxury Product Pages**: High-resolution image galleries, detailed specifications (Metal type, KT), and dynamic pricing.
- **Smart Cart & Wishlist**: Persistent state management allowing users to save favorites and manage purchases seamlessly.
- **User Accounts**: Personalized profiles for order tracking and security.
- **Instant Support**: Floating WhatsApp integration for direct customer-to-business communication.

### 🛠️ Administrative Control (Admin Dashboard)
- **Inventory Management**: Full CRUD (Create, Read, Update, Delete) capabilities for the product catalog.
- **Order Tracking**: Real-time monitoring of customer orders with status updates (Pending, Shipped, Delivered).
- **Live Analytics**: Visual statistics for total sales, visitor counts, and conversion rates.
- **System Maintenance**: One-click database reseeding for automated inventory updates.

---

## 💻 Tech Stack & Architecture

### **Frontend (The Gallery)**
- **Framework**: React 18 (Vite-powered for lightning-fast performance).
- **Styling**: Premium Vanilla CSS with a focus on glassmorphism and mobile-first responsiveness.
- **Icons**: Lucide React for modern, crisp UI elements.
- **State Management**: Context API (Auth, Cart, Wishlist, Orders, Products).

### **Backend (The Vault)**
- **Environment**: Node.js & Express.
- **Database**: SQLite3 (Efficient, serverless, and highly portable).
- **Security**: Role-based access control (Admin vs. User).
- **API**: RESTful architecture for all data operations.

---

## 🌐 Deployment & Live Status

The project is architected for high availability and performance:

| Component | Platform | Status |
| :--- | :--- | :--- |
| **Frontend** | Vercel | 🟢 Live / Optimized |
| **Backend API** | Render | 🟢 Live / Connected |
| **Database** | SQLite (on Render) | 🟢 Active |

---

## 📂 Project Structure

```text
rulz-diamonds/
├── src/
│   ├── assets/          # High-quality jewelry imagery
│   ├── components/      # Reusable UI (Navbar, Footer, Modal)
│   ├── context/         # Global state logic
│   ├── pages/           # Individual views (Home, Shop, Admin)
│   └── index.css        # Core design system & variables
├── server.js            # Express API & SQLite initialization
├── package.json         # Dependency manifest
├── vercel.json          # Deployment configuration
└── data/                # Local database storage
```

---

## 🛠️ Maintenance & Development

### **Local Setup**
1. Install dependencies: `npm install`
2. Run full-stack: `npm run dev:fullstack`
3. Access Frontend: `http://localhost:5173`
4. Access Backend: `http://localhost:5000`

### **Admin Credentials**
- **Email**: `princegajera944@gmail.com`
- **Password**: `admin`

---

## 📈 SEO & Branding
The application implements modern SEO best practices:
- Semantic HTML5 structure.
- Optimized meta descriptions and titles.
- Branded favicon and professional typography (Inter/Outfit).
- High-performance image loading.

---
**Developed with precision for Rulz Diamonds.**
*Version 1.0.0 | © 2026*
