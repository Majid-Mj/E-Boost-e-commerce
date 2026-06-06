import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getCloudinaryUrl } from "../utils/cloudinary";

const SLIDES = [
  {
    tag: "GEAR UP FOR VICTORY",
    title: "EvoFox Elite X2 Wireless Gaming Controller ",
    subtitle: "NEXT-GEN CONTROLLERS",
    description: "Engineered with magnetic hall-effect triggers, customizable remappable paddle controls, and ultra-low latency response rate for gaming dominance.",
    image: "/assets/products/controller2.1.png",
    accentColor: "#ff512f",
    glowColor: "rgba(255, 81, 47, 0.25)",
    link: "/products"
  },
  {
    tag: "PRECISION & SPEED",
    title: "Minilo75 Pro",
    subtitle: "RGB TKL MECHANICALS",
    description: "Hot-swappable linear yellow switches, sound-dampening gasket mounted board, and per-key customizable dynamic neon RGB profiles.",
    image: "eboost/products/imilgz67sf56q9srmtv7",
    accentColor: "#dd2476",
    glowColor: "rgba(221, 36, 118, 0.25)",
    link: "/products"
  },
  {
    tag: "SURROUND IMMERSION",
    title: "Sony INZONE H9, Wireless Gaming Headset",
    subtitle: "3D SPATIAL HEADSETS",
    description: "Active hybrid noise cancellation, dual-wireless connectivity, and 3D spatial sound tracking to pinpoint enemy footsteps instantly.",
    image: "/assets/products/sony_INZONEH9_Headphone.png",
    accentColor: "#ff512f",
    glowColor: "rgba(255, 81, 47, 0.25)",
    link: "/products"
  }
];

export default function HeroSlider({ products = [] }) {
  const [current, setCurrent] = useState(0);

  const dynamicSlides = SLIDES.map(slide => {
    let rawImage = slide.image;
    let matchedLink = slide.link;

    if (products && products.length > 0) {
      const exactMatch = products.find(p => {
        const prodName = (p.name || "").toLowerCase().trim();
        const slideTitle = (slide.title || "").toLowerCase().trim();
        return prodName.includes(slideTitle) || slideTitle.includes(prodName);
      });

      if (exactMatch) {
        rawImage = exactMatch.images?.[0]?.imageUrl || exactMatch.image || slide.image;
        matchedLink = `/product-details/${exactMatch.id}`;
      }
    }

    return {
      ...slide,
      image: getCloudinaryUrl(rawImage),
      link: matchedLink
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % dynamicSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [dynamicSlides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % dynamicSlides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + dynamicSlides.length) % dynamicSlides.length);

  return (
    <div className="relative h-[720px] sm:h-[650px] md:h-[750px] w-full bg-gradient-to-br from-white via-slate-50/50 to-slate-100/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950/50 overflow-hidden border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Background Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Ambient Glows */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none opacity-[0.12] transition-all duration-1000"
        style={{ backgroundColor: dynamicSlides[current].accentColor }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none opacity-[0.08] transition-all duration-1000"
        style={{ backgroundColor: dynamicSlides[current].accentColor }}
      />

      <div className="max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center pt-24 sm:pt-20 md:pt-0 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full"
          >
            {/* Slide Text Content (Left) */}
            <div className="md:col-span-6 flex flex-col items-start justify-center text-left">
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="px-3 py-1 text-[10px] tracking-[0.2em] font-bold rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 uppercase mb-4 text-[#ff512f]"
              >
                {dynamicSlides[current].tag}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="text-4xl md:text-6xl font-black tracking-tight text-slate-800 dark:text-white mb-2 leading-none font-title"
              >
                {dynamicSlides[current].title}
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-xl md:text-2xl font-black tracking-widest uppercase mb-6 text-slate-700 dark:text-slate-300"
              >
                {dynamicSlides[current].subtitle}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-8 max-w-lg leading-relaxed"
              >
                {dynamicSlides[current].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                <Link
                  to={dynamicSlides[current].link}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#ff512f] to-[#dd2476] shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Purchase Now</span>
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>

            {/* Slide Image Showcase (Right) */}
            <div className="md:col-span-6 flex justify-center items-center relative mt-6 md:mt-0">
              {/* Spinning Accent Ring behind product */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-[280px] h-[280px] md:w-[420px] md:h-[420px] border border-dashed rounded-full pointer-events-none opacity-20"
                style={{ borderColor: dynamicSlides[current].accentColor }}
              />

              {/* Hexagon Outline backdrop */}
              <div
                className="absolute w-[220px] h-[220px] md:w-[320px] md:h-[320px] bg-gradient-to-tr from-slate-50/55 to-slate-100/55 dark:from-slate-900/55 dark:to-slate-850/55 border border-slate-200 dark:border-slate-800 rounded-[2rem] rotate-12 opacity-60 shadow-md"
              />

              <motion.img
                initial={{ opacity: 0, scale: 0.95, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -30 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                src={dynamicSlides[current].image}
                alt={dynamicSlides[current].title}
                className="w-[240px] h-[240px] md:w-[420px] md:h-[420px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)] relative z-10 hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Slide Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 hover:bg-gradient-to-r hover:from-[#ff512f] hover:to-[#dd2476] text-slate-700 dark:text-slate-300 hover:text-white transition z-20 shadow-md"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 hover:bg-gradient-to-r hover:from-[#ff512f] hover:to-[#dd2476] text-slate-700 dark:text-slate-300 hover:text-white transition z-20 shadow-md"
      >
        <ChevronRight size={20} />
      </button>

      {/* Navigation Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
        {dynamicSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${current === idx ? "w-8" : "w-2.5 bg-slate-300 dark:bg-slate-700"
              }`}
            style={{ backgroundColor: current === idx ? dynamicSlides[current].accentColor : undefined }}
          />
        ))}
      </div>
    </div>
  );
}
