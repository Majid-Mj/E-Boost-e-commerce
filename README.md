<div align="center">

<br />

```
███████╗██████╗  ██████╗  ██████╗ ███████╗████████╗
██╔════╝██╔══██╗██╔═══██╗██╔═══██╗██╔════╝╚══██╔══╝
█████╗  ██████╔╝██║   ██║██║   ██║███████╗   ██║
██╔══╝  ██╔══██╗██║   ██║██║   ██║╚════██║   ██║
███████╗██████╔╝╚██████╔╝╚██████╔╝███████║   ██║
╚══════╝╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝
```

**A modern, full-stack e-commerce platform built for performance and scale.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-latest-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](./LICENSE)

[Live Demo](#) · [Report a Bug](../../issues) · [Request a Feature](../../issues)

<br />

</div>

---

## What is EBoost?

EBoost is a production-ready e-commerce frontend that goes beyond the typical CRUD shop. It features **3D product visualizations**, a **full admin control panel**, real-time analytics, and a smooth, animated shopping experience — all backed by a secure JWT-authenticated API.

<br />

## Features

### Storefront
| Feature | Description |
|---|---|
| 🛍️ **Product Browsing** | Rich product pages with descriptions, images, and interactive 3D views |
| 🔐 **Auth Flow** | Login, signup, forgot password, and JWT-secured sessions |
| 📦 **Order Tracking** | Full order history and real-time status from the user dashboard |
| 💳 **Checkout** | Integrated payment processing for seamless transactions |
| 🕶️ **3D Product Views** | Interactive models powered by Three.js & React Three Fiber |
| 🌓 **Dark Mode** | Polished UI with first-class light and dark theme support |

### Admin Panel
| Feature | Description |
|---|---|
| 📊 **Analytics Dashboard** | Sales charts, revenue trends, and category breakdowns via Chart.js |
| 📝 **Inventory Management** | Add, edit, delete products with multi-image upload via Cloudinary |
| 👥 **User Management** | View and manage all customer accounts |
| 🛒 **Order Fulfillment** | Centralized order tracking and status management |

<br />

## Tech Stack

```
Frontend        React 19 · Vite · Tailwind CSS 4 · React Router v7
State           React Context API
Data Fetching   Axios
3D / Visual     Three.js · @react-three/fiber · Chart.js · react-chartjs-2
Animation       Framer Motion
UI              Lucide React · React Icons · React Hot Toast
```

<br />

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/eboost.git
cd eboost

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

Open `.env` and fill in your values:

```env
VITE_API_BASE_URL=https://your-backend-api-url.com
```

```bash
# 4. Start the development server
npm run dev
```

Visit `http://localhost:5173` — you're live. 🎉

<br />

## Project Structure

```
src/
├── animations/       # Framer Motion variants
├── api/              # Axios utilities and endpoint definitions
├── Components/       # Reusable UI (Navbar, Footer, ProductCards…)
├── config/           # Global configs (Axios base setup)
├── contexts/         # Context providers — Auth, Cart, Theme
├── pages/
│   ├── Admin/        # Dashboard, product/order/user management
│   ├── Auth/         # Login, Signup, Password Recovery
│   └── User/         # Home, Products, Cart, Checkout, Profile
├── routes/           # Route guards and app routing logic
├── utils/            # Helpers (Cloudinary URL parsing, etc.)
├── App.jsx
└── main.jsx
```

<br />

## Deployment

EBoost is optimized for **Vercel** but works on any static hosting provider.

```bash
# Build for production
npm run build

# Output → /dist (ready to deploy)
```

> **Azure users:** The project is also configured to deploy via GitHub Actions to Azure Static Web Apps. See `.github/workflows/` for the CI/CD pipeline.

<br />

## Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

<br />

## License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

<br />

---

<div align="center">
  <sub>Built with ☕ and a lot of late nights · <a href="https://github.com/your-username">@your-username</a></sub>
</div>
