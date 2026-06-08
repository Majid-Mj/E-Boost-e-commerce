EBoost E-Commerce 🚀

A modern, full-stack e-commerce frontend built with **React**, **Vite**, and **Tailwind CSS**. Designed for high performance and an exceptional user experience, featuring 3D product visualizations, comprehensive admin dashboards, and seamless payment integrations.

## 🌟 Features

### For Users
- **🛍️ Complete Shopping Experience**: Browse products, view detailed descriptions, and add items to your cart or wishlist.
- **🔐 Secure Authentication**: Full authentication flow including Login, Signup, and Forgot/Reset Password, handled via JWT.
- **📦 Order Tracking**: View order history and status directly from the user dashboard.
- **💳 Smooth Checkout**: Integrated payment processing for seamless transactions.
- **🕶️ 3D Product Views**: Interactive 3D models of select products using Three.js and React Three Fiber.
- **🌓 Dark Mode Support**: Beautifully designed UI with built-in light and dark modes.

### For Administrators
- **📊 Interactive Dashboard**: Real-time business analytics, sales charts, and category distribution using Chart.js.
- **📝 Inventory Management**: Add, edit, delete, and toggle the visibility of products. Supports multi-image uploads via Cloudinary.
- **👥 User Management**: View and manage customer accounts.
- **🛒 Order Fulfillment**: Track and manage all customer orders from a centralized panel.

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **State Management**: React Context API
- **HTTP Client**: [Axios](https://axios-http.com/)
- **3D Rendering**: [Three.js](https://threejs.org/) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/)
- **Charts**: [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd e-commerce-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   VITE_API_BASE_URL=your_backend_api_url
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📁 Project Structure

```text
src/
├── animations/       # Framer motion animation variants
├── api/              # Axios API utility functions and endpoint definitions
├── Components/       # Reusable UI components (Navbar, Footer, ProductCards, etc.)
├── config/           # Global configurations (e.g., Axios setup)
├── contexts/         # React Context providers (Auth, Cart, Theme)
├── pages/            # Page-level components
│   ├── Admin/        # Admin dashboard, product/order/user management
│   ├── Auth/         # Login, Signup, Password Recovery
│   └── User/         # Home, Products, Cart, Checkout, Profile
├── routes/           # Application routing logic (Admin & Public routes)
├── utils/            # Helper functions (e.g., Cloudinary image URL parsing)
├── App.jsx           # Main application entry component
├── index.css         # Global Tailwind CSS imports
└── main.jsx          # React DOM render entry point
```

## 🌐 Deployment

The project is configured for easy deployment on platforms like **Vercel**

To build the project for production:
```bash
npm run build
```
This will generate optimized static assets in the `dist/` directory, which can be deployed to any static hosting provider.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📄 License

This project is licensed under the MIT License.
