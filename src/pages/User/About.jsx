import React from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white ">
      <Navbar />
      <div className="pt-20 px-8 md:px-20 text-center md:text-left mb-20">
        <h1 className="text-5xl font-bold text-[#00FFFF] mb-6 text-center">
          About Our Store
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
          Welcome to <span className="text-[#00FFFF] font-semibold">EBoost</span> — your one-stop destination for premium gaming accessories. 
          We are passionate gamers who believe every player deserves the best tools to dominate the game. 
          From mechanical keyboards to pro-grade headsets, our mission is to deliver high-quality gear 
          that enhances your gaming performance.
        </p>

        <h2 className="text-3xl font-semibold text-[#00FFFF] mb-4">
          Why Choose Us?
        </h2>
        <ul className="text-gray-300 space-y-3 mb-10 max-w-2xl mx-auto list-disc list-inside">
          <li>Top-quality and durable gaming products</li>
          <li>Affordable prices with exclusive discounts</li>
          <li>Fast and reliable delivery</li>
          <li>24/7 customer support</li>
          <li>Trusted by gamers worldwide</li>
        </ul>

        <h2 className="text-3xl font-semibold text-[#00FFFF] mb-4">
          Our Vision
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
          Our vision is to build a community where gaming meets excellence. 
          We aim to provide innovative and high-performance accessories 
          that take your gaming experience to the next level.
        </p>
      </div>
      <Footer />
    </div>
  );
}
