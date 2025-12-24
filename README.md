# social_media
#This is ShopHub, a full-stack e-commerce application.

Tech Stack
Frontend: React (Vite), Tailwind CSS, Framer Motion (for animations), Sonner (for notifications).
Backend: Node.js, Express, MongoDB (Mongoose).
Authentication: JWT-based auth.
Current Features
Product Browsing:
Home page with search and category filtering.
Product details view.
Note: Products are currently hardcoded (mock data) in the frontend App.jsx, not fetched from the DB.
Shopping Cart & Orders:
Add/remove items, update quantity.
Cart total calculation.
Order placement and history view.
Note: Orders are stored in local component state (lost on refresh), not the backend.
Authentication:
Functional Login and Register pages.
Connected to the backend (/api/auth/login & /register).
Uses MongoDB to store users.
The app is in a hybrid state: Authentication is full-stack, but product/order management is currently frontend-only mock data.

