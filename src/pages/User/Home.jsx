import React, { useRef, useState, useEffect, lazy, Suspense } from "react";
import Navbar from "../../Components/Navbar";
import ProductsView from "../../Components/Productsview";
import Footer from "../../Components/Footer";
import HeroSlider from "../../Components/HeroSlider";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Target, Headphones, Keyboard, ShieldCheck, RefreshCw, BadgePercent, MessageSquare, Heart, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { getCloudinaryUrl } from "../../utils/cloudinary";
import api from "../../config/api";

const Controller3D = lazy(() => import("../../Components/Controller3D"));

export default function Home() {
  const categoryScrollRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then(res => {
        setProducts(res.data?.data || res.data || []);
      })
      .catch(err => {
        console.error("Error fetching products in Home page:", err);
      });
  }, []);

  const getDynamicImage = (keyword, defaultLocalPath) => {
    if (!products || products.length === 0) {
      return getCloudinaryUrl(defaultLocalPath);
    }

    const matchingProducts = products.filter(p => {
      const prodName = (p.name || "").toLowerCase();
      const catName = (p.categoryName || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const kw = keyword.toLowerCase();
      return prodName.includes(kw) || catName.includes(kw) || desc.includes(kw);
    });

    if (matchingProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * matchingProducts.length);
      const chosenProduct = matchingProducts[randomIndex];
      const imgUrl = chosenProduct.images?.[0]?.imageUrl || chosenProduct.image;
      return getCloudinaryUrl(imgUrl);
    }

    return getCloudinaryUrl(defaultLocalPath);
  };

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 320;
      categoryScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const categories = [
    {
      name: "Keyboards Gaming",
      itemCount: "12 Items",
      image: "/assets/products/keyboard1.png",
      path: "/products?category=keyboards",
      borderColor: "group-hover:border-[#ff512f]/40",
      accentBg: "bg-[#ff512f]/5"
    },

    {
      name: "Tactical Headsets",
      itemCount: "15 Items",
      image: "/assets/products/sony_INZONEH9_Headphone.png",
      path: "/products?category=Headphone",
      borderColor: "group-hover:border-[#ff512f]/40",
      accentBg: "bg-[#ff512f]/5"
    },
    {
      name: "Pro Controllers",
      itemCount: "6 Items",
      image: "/assets/products/controller2.1.png",
      path: "/products?category=controllers",
      borderColor: "group-hover:border-[#dd2476]/40",
      accentBg: "bg-[#dd2476]/5"
    },
    {
      name: "Gaming Monitors",
      itemCount: "4 Items",
      image: "/assets/products/ASUS_ROG_Swift_360Hz_Monitor-removebg-preview.png",
      path: "/products?category=monitors",
      borderColor: "group-hover:border-[#ff512f]/40",
      accentBg: "bg-[#ff512f]/5"
    },
    {
      name: "Esports Chairs",
      itemCount: "5 Items",
      image: "/assets/products/GTplayer_chair.png",
      path: "/products?category=chair",
      borderColor: "group-hover:border-[#dd2476]/40",
      accentBg: "bg-[#dd2476]/5"
    },

    {
      name: "RGB Mousepads",
      itemCount: "7 Items",
      image: "/assets/products/Logitech_G_PowerPlay_Mouse_Pad.png",
      path: "/products?category=mousepad",
      borderColor: "group-hover:border-[#dd2476]/40",
      accentBg: "bg-[#dd2476]/5"
    }
  ];

  const dynamicCategories = categories.map(cat => {
    let keyword = "";
    const nameLower = cat.name.toLowerCase();
    if (nameLower.includes("keyboard")) keyword = "keyboard";
    else if (nameLower.includes("mouse")) keyword = "mouse";
    else if (nameLower.includes("headset") || nameLower.includes("headphone")) keyword = "headphone";
    else if (nameLower.includes("controller")) keyword = "controller";
    else if (nameLower.includes("monitor")) keyword = "monitor";
    else if (nameLower.includes("chair")) keyword = "chair";
    else if (nameLower.includes("deck")) keyword = "deck";
    else if (nameLower.includes("mousepad")) keyword = "mousepad";
    else keyword = cat.name;

    return {
      ...cat,
      image: getDynamicImage(keyword, cat.image)
    };
  });

  const highlights = [
    {
      tag: "PRECISION AIM",
      title: "NIGHTHAWK SPEED",
      desc: "32,000 DPI optical sensor with wireless speed-of-light response.",
      image: "/assets/products/mouse1.png",
      accentColor: "#ff512f"
    },
    {
      tag: "TACTILE COMFORT",
      title: "HYDRA CHRONO",
      desc: "Custom low-profile gasket mounted linear mechanical switch layout.",
      image: "/assets/products/ASUS ROG Strix Scope TKL Wired Gaming Keyboard with Mechanical RGB Keys.png",
      accentColor: "#dd2476"
    },
    {
      tag: "IMMERSIVE AUDIO",
      title: "SONIC VORTEX PRO",
      desc: "High-fidelity spatial audio headset with active noise cancellation.",
      image: "/assets/products/sony_INZONEH9_Headphone.png",
      accentColor: "#8b5cf6"
    }
  ];

  const dynamicHighlights = highlights.map(item => {
    let keyword = "";
    if (item.title.toLowerCase().includes("speed") || item.desc.toLowerCase().includes("mouse")) keyword = "mouse";
    else if (item.title.toLowerCase().includes("chrono") || item.desc.toLowerCase().includes("keyboard")) keyword = "keyboard";
    else if (item.title.toLowerCase().includes("sonic") || item.desc.toLowerCase().includes("audio") || item.desc.toLowerCase().includes("headset") || item.desc.toLowerCase().includes("headphone")) keyword = "headphone";
    else keyword = item.title;

    return {
      ...item,
      image: getDynamicImage(keyword, item.image)
    };
  });

  const testimonials = [
    {
      quote: "The low latency is outstanding. The design matches my setup perfectly, and the tactile key feedback is a game changer for competitive matches.",
      author: "Viper_Gaming",
      role: "Apex Esports Pro",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=60"
    },
    {
      quote: "Absolute comfort during 12-hour streaming marathons. The battery life is unbelievable, and customer support was lightning-fast when I had questions.",
      author: "Liquid_Spectre",
      role: "Twitch Partner / FPS Player",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60"
    }
  ];

  // Find Razer BlackShark V2 Pro and Redragon K552 Kumara from dynamic products
  const razerProduct = products.find(p => p.name?.toLowerCase().includes("razer blackshark v2 pro"));
  const redragonProduct = products.find(p => p.name?.toLowerCase().includes("redragon k552"));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-x-hidden transition-colors duration-300">
      <Navbar />

      {/* Main Container - Offsets Top Navbar spacing */}
      <div>

        {/* 1. Hero Slider Carousel */}
        <HeroSlider products={products} />

        {/* 2. Shop By Categories Carousel */}
        <section className="py-20 max-w-7xl mx-auto px-6 md:px-12 text-center relative group/cat">
          <span className="text-[#ff512f] font-bold text-xs uppercase tracking-[0.2em] mb-3 block">
            SHOP BY COLLECTION
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-12 font-title text-slate-800 dark:text-white">
            EXPLORE THE BATTLESTATION
          </h2>

          <div className="relative flex items-center px-4 md:px-0">
            {/* Left Scroll Button */}
            <button
              onClick={() => scrollCategories("left")}
              className="absolute -left-2 md:-left-6 z-20 p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 text-slate-700 dark:text-slate-300 hover:bg-[#ff512f] hover:text-white dark:hover:bg-[#ff512f] dark:hover:text-white transition duration-300 shadow-md cursor-pointer opacity-0 group-hover/cat:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Scrollable Container */}
            <div
              ref={categoryScrollRef}
              className="w-full overflow-x-auto no-scrollbar flex flex-row gap-6 scroll-smooth snap-x snap-mandatory py-4 px-2 select-none"
            >
              {dynamicCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={cat.path}
                  className="group w-[240px] shrink-0 snap-start relative bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between hover:scale-105 transition-all duration-300 overflow-hidden shadow-sm"
                >
                  <div className={`absolute inset-0 ${cat.accentBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Category Thumbnail */}
                  <div className="w-40 h-40 flex items-center justify-center relative z-10 mb-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl p-2 transition-colors">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="max-w-full max-h-full object-contain transform group-hover:scale-110 group-hover:rotate-3 transition duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="relative z-10">
                    <h3 className="text-sm font-black tracking-wider uppercase mb-1 font-title text-slate-800 dark:text-slate-200 group-hover:text-[#ff512f] dark:group-hover:text-[#ff512f] transition">
                      {cat.name}
                    </h3>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{cat.itemCount}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={() => scrollCategories("right")}
              className="absolute -right-2 md:-right-6 z-20 p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 text-slate-700 dark:text-slate-300 hover:bg-[#ff512f] hover:text-white dark:hover:bg-[#ff512f] dark:hover:text-white transition duration-300 shadow-md cursor-pointer opacity-0 group-hover/cat:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* 3. Triple High-Impact Promotion Panels */}
        <section className="py-10 max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dynamicHighlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 relative overflow-hidden group hover:border-[#ff512f]/30 dark:hover:border-[#ff512f]/30 hover:shadow-md transition duration-300 flex flex-col justify-between min-h-[350px]"
              >
                {/* Visual Backdrop decoration */}
                <div
                  className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full blur-[70px] opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: item.accentColor }}
                />

                <div>
                  <span
                    className="font-bold text-[10px] tracking-widest uppercase mb-3 block"
                    style={{ color: item.accentColor }}
                  >
                    {item.tag}
                  </span>
                  <h3 className="text-xl font-black mb-3 font-title text-slate-800 dark:text-white tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed mb-6 font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="flex justify-between items-end">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350 hover:text-[#ff512f] dark:hover:text-[#ff512f] transition"
                  >
                    <span>View Showcase</span>
                    <ArrowRight size={13} />
                  </Link>

                  <div className="w-24 h-24 flex items-center justify-center shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-w-full max-h-full object-contain group-hover:-translate-y-2 transition duration-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 3D Interactive Sandbox Experience */}
        <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-t border-b border-slate-200 dark:border-slate-800 relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Info & Parameters Specs */}
              <div className="lg:col-span-5 text-left">
                <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight font-title text-slate-800 dark:text-white">
                  CUSTOMIZE YOUR ULTIMATE GEAR
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mb-8 leading-relaxed font-medium">
                  Take total control over your playstyle. Preview our flagship gaming controller in full 3D from every angle. Built with pro-grade materials, zero-drift analog sticks, and customizable paddles to match your ultimate competitive setup.
                </p>

                {/* Specs List */}
                <div className="space-y-4">
                  {[
                    { title: "Zero-Drift Hall-Effect Analog Sticks", icon: Target, color: "#ff512f" },
                    { title: "Tactile Mouse-Click Microswitches", icon: Cpu, color: "#dd2476" },
                    { title: "4x Interchangeable Rear Paddles", icon: Keyboard, color: "#ff512f" }
                  ].map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl">
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 flex items-center justify-center" style={{ color: spec.color }}>
                        <spec.icon size={18} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tracking-wide uppercase">{spec.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3D Canvas Visual (Center / Right) */}
              <div className="lg:col-span-7 flex justify-center relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xl rounded-3xl p-4">
                <div className="absolute top-4 left-4 z-10 px-3 py-1 text-[10px] tracking-widest font-black uppercase bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white rounded shadow-sm">
                  Interactive 3D Preview
                </div>
                <Suspense fallback={
                  <div className="w-[580px] h-[530px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse text-xs text-slate-400">
                    Loading 3D Controller...
                  </div>
                }>
                  <Controller3D />
                </Suspense>
              </div>

            </div>
          </div>
        </section>

        {/* 5. Our Products - Catalog Showcase */}
        <section className="py-20 max-w-7xl mx-auto px-6 md:px-12 text-center">
          <span className="text-[#dd2476] font-bold text-xs uppercase tracking-[0.2em] mb-3 block">
            DOCK YOUR WEAPON
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-4 font-title text-slate-800 dark:text-white">
            CHOOSE YOUR WEAPON
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-xl mx-auto mb-12 font-medium">
            Engineered to exceed critical standards. Pick accessories built by world-class designers to level up your gaming rig.
          </p>

          <ProductsView />
        </section>

        {/* 6. Dual Split Promotional Banners */}
        <section className="py-10 max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Banner 1 */}
            <Link
              to={razerProduct ? `/product-details/${razerProduct.id}` : "/products"}
              className="relative rounded-2xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between group hover:border-[#ff512f]/35 dark:hover:border-[#ff512f]/35 hover:shadow-md transition duration-500 cursor-pointer block"
            >
              <div className="text-left relative z-10 max-w-xs mb-6 md:mb-0">
                <span className="text-[#dd2476] text-xs font-bold uppercase tracking-widest block mb-2 font-title">
                  NEW ARRIVALS
                </span>
                <h3 className="text-2xl font-black mb-3 font-title tracking-wide text-slate-800 dark:text-white leading-tight">
                  {razerProduct ? razerProduct.name : "RAZER BLACKSHARK V2 PRO"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium line-clamp-2">
                  {razerProduct ? razerProduct.description : "Pro-performance wireless esports headset with high-fidelity sound and supreme comfort."}
                </p>
                <div className="text-lg font-black text-[#ff512f] mb-4 font-title">
                  ₹{razerProduct ? razerProduct.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "12,999.00"}
                </div>
                <div
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white font-bold uppercase text-[10px] tracking-wider rounded-lg transition hover:opacity-95 shadow-md shadow-orange-500/10"
                >
                  <span>Buy Now</span>
                  <ArrowRight size={12} />
                </div>
              </div>

              <div className="w-48 h-48 flex items-center justify-center shrink-0 relative z-10">
                <img
                  src={razerProduct ? getCloudinaryUrl(razerProduct.images?.[0]?.imageUrl || razerProduct.image) : getCloudinaryUrl("/assets/products/razer_blackshark_v2_pro.png")}
                  alt="Razer Headset"
                  className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition duration-500"
                />
              </div>
            </Link>

            {/* Banner 2 */}
            <Link
              to={redragonProduct ? `/product-details/${redragonProduct.id}` : "/products"}
              className="relative rounded-2xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between group hover:border-[#dd2476]/35 dark:hover:border-[#dd2476]/35 hover:shadow-md transition duration-500 cursor-pointer block"
            >
              <div className="text-left relative z-10 max-w-xs mb-6 md:mb-0">
                <span className="text-[#ff512f] text-xs font-bold uppercase tracking-widest block mb-2 font-title">
                  TACTICAL PERIPHERALS
                </span>
                <h3 className="text-2xl font-black mb-3 font-title tracking-wide text-slate-800 dark:text-white leading-tight">
                  {redragonProduct ? redragonProduct.name : "REDRAGON K552 KUMARA"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium line-clamp-2">
                  {redragonProduct ? redragonProduct.description : "Tenkeyless mechanical gaming keyboard with dustproof switches and gorgeous RGB backlighting."}
                </p>
                <div className="text-lg font-black text-[#ff512f] mb-4 font-title">
                  ₹{redragonProduct ? redragonProduct.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "3,499.00"}
                </div>
                <div
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white font-bold uppercase text-[10px] tracking-wider rounded-lg transition hover:opacity-95 shadow-md shadow-orange-500/10"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={12} />
                </div>
              </div>

              <div className="w-48 h-48 flex items-center justify-center shrink-0 relative z-10">
                <img
                  src={redragonProduct ? getCloudinaryUrl(redragonProduct.images?.[0]?.imageUrl || redragonProduct.image) : getCloudinaryUrl("/assets/products/redragon_k552.png")}
                  alt="Redragon Keyboard"
                  className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition duration-500"
                />
              </div>
            </Link>

          </div>
        </section>

        {/* 8. Testimonials Section */}
        <section className="py-20 max-w-7xl mx-auto px-6 md:px-12 text-center relative">
          <span className="text-[#ff512f] font-bold text-xs uppercase tracking-[0.2em] mb-3 block">
            CUSTOMER TRUST
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-12 font-title text-slate-800 dark:text-white">
            VOICES OF THE ARENA
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 text-left relative hover:border-[#ff512f]/20 transition shadow-sm">
                <div className="absolute top-6 right-8 text-slate-200/40 dark:text-slate-800/20">
                  <MessageSquare size={80} className="fill-current" />
                </div>

                <p className="text-slate-500 dark:text-slate-400 italic mb-6 relative z-10 leading-relaxed text-sm font-medium">
                  "{test.quote}"
                </p>

                <div className="flex items-center gap-4 relative z-10">
                  <img
                    src={test.avatar}
                    alt={test.author}
                    className="w-12 h-12 rounded-full object-cover border border-[#ff512f]/25"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-title">{test.author}</h4>
                    <span className="text-[10px] text-[#dd2476] uppercase font-bold tracking-widest">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
