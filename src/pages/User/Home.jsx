import React from "react";
import Navbar from "../../Components/Navbar";
import ProductView from "../../Components/Productsview";
import Footer from "../../Components/Footer";
import { Link } from "react-router-dom";

export default function Home() {
  return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white ">
      <Navbar />
      <div className="pt-16">

        <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16">
          <div className="max-w-lg">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Boost Your <span className="text-[#00FFFF]">Gaming Experience</span> <br /> With Premium Accessories
            </h2>
            <p className="text-gray-400 mb-8">
              Explore our exclusive range of high-performance gaming accessories — controllers, headsets, keyboards, and more —
              designed to enhance your skills and give you the competitive edge you deserve.
            </p>

            <div className="flex flex-wrap gap-6 text-gray-300 mb-8">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-truck-fast text-[#00FFFF]"></i> Fast & Free Shipping
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-headset text-[#00FFFF]"></i> 24/7 Support
              </div>
             
            </div>
            <Link to="products">
            <button className="px-6 py-3 bg-[#00FFFF] hover:bg-cyan-400 text-black rounded-lg font-semibold transition">
              Shop Now
            </button>
            </Link>
          </div>

          <div className="mt-10 md:mt-0">
            <img
              src="/assets/products/controller2.1.png"
              alt="Gaming Controller"
              className="w-[350px] md:w-[500px] drop-shadow-[0_0_30px_rgba(0,255,255,0.6)]"
            />
          </div>
        </section>
        <ProductView/>
      </div>
      <Footer/>
    </div>
  );
}

