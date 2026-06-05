import React from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col">
      <Navbar />
      <div className="flex-grow pt-28 px-6 md:px-12 max-w-4xl mx-auto text-center md:text-left mb-20">
        <h1 className="text-4xl md:text-5xl font-black font-title uppercase tracking-wide mb-8 text-center bg-gradient-to-r from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent">
          About Our Store
        </h1>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm mb-8">
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed mb-6 font-medium">
            Welcome to <span className="text-[#ff512f] font-bold">EBOOST</span> — your one-stop destination for premium gaming accessories.
            We are passionate gamers who believe every player deserves the best tools to dominate the game.
            From mechanical keyboards to pro-grade headsets, our mission is to deliver high-quality gear
            that enhances your gaming performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-black font-title uppercase text-slate-800 dark:text-white mb-4">
              Why Choose Us?
            </h2>
            <ul className="text-slate-600 dark:text-slate-400 space-y-3 list-disc list-inside font-medium text-sm">
              <li>Top-quality and durable gaming products</li>
              <li>Affordable prices with exclusive discounts</li>
              <li>Fast and reliable delivery</li>
              <li>24/7 customer support</li>
              <li>Trusted by gamers worldwide</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-black font-title uppercase text-slate-800 dark:text-white mb-4">
              Our Vision
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
              Our vision is to build a community where gaming meets excellence.
              We aim to provide innovative and high-performance accessories
              that take your gaming experience to the next level.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
