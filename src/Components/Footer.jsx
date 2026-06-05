import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Truck, RefreshCw, BadgePercent, Headphones, Send } from "lucide-react";

export default function Footer() {


  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 relative mt-20">
      
      {/* 1. Value Proposition Banner Grid */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#1f2937] border border-[#ff512f]/20 flex items-center justify-center text-[#ff512f] shrink-0 shadow-lg">
              <Truck size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white font-title mb-1">FREE SHIPPING</h4>
              <p className="text-[11px] text-slate-500 dark:text-[#94a3b8]">Free shipping on orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#1f2937] border border-[#dd2476]/20 flex items-center justify-center text-[#dd2476] shrink-0 shadow-lg">
              <RefreshCw size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white font-title mb-1">FLEXIBLE RETURNS</h4>
              <p className="text-[11px] text-slate-500 dark:text-[#94a3b8]">Easy returns within 30 days of purchase</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#1f2937] border border-[#ff512f]/20 flex items-center justify-center text-[#ff512f] shrink-0 shadow-lg">
              <BadgePercent size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white font-title mb-1">SMART SAVINGS</h4>
              <p className="text-[11px] text-slate-500 dark:text-[#94a3b8]">Up to 40% off on premium mechanical keys</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#1f2937] border border-[#dd2476]/20 flex items-center justify-center text-[#dd2476] shrink-0 shadow-lg">
              <Headphones size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white font-title mb-1">24/7 EXPERT SUPPORT</h4>
              <p className="text-[11px] text-slate-500 dark:text-[#94a3b8]">Get expert support whenever you need it</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Structured Link Columns & Newsletter */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & Description (6 cols) */}
          <div className="lg:col-span-6 text-left">
            <Link to="/" className="text-2xl font-black tracking-widest font-title mb-4 flex items-center">
              <span className="text-black dark:text-white pr-[2px]">E</span>
              <span className="text-[#ff512f]">BOOST</span>
            </Link>
            <p className="text-slate-500 dark:text-[#94a3b8] text-xs leading-relaxed mb-6 max-w-sm">
              EBoost is your high-performance battle station supplier. We deliver esports-grade mechanical keyboards, modular controllers, high-fidelity headsets, and performance optical gaming mice designed for competitive play.
            </p>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="w-8 h-8 rounded-full bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-[#94a3b8] hover:text-[#ff512f] dark:hover:text-[#ff512f] hover:border-[#ff512f]/50 transition"><Facebook size={15} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-[#94a3b8] hover:text-[#ff512f] dark:hover:text-[#ff512f] hover:border-[#ff512f]/50 transition"><Twitter size={15} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-[#94a3b8] hover:text-[#ff512f] dark:hover:text-[#ff512f] hover:border-[#ff512f]/50 transition"><Instagram size={15} /></a>
            </div>
          </div>

          {/* Let Us Help (2 cols) */}
          <div className="lg:col-span-2 text-left">
            <h3 className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white font-title mb-6">LET US HELP</h3>
            <ul className="space-y-3.5 text-xs text-slate-500 dark:text-[#94a3b8]">
              <li><Link to="/orders" className="hover:text-[#ff512f] transition font-semibold">Track My Order</Link></li>
              <li><Link to="/orders" className="hover:text-[#ff512f] transition font-semibold">Cancel My Order</Link></li>
              <li><Link to="/orders" className="hover:text-[#ff512f] transition font-semibold">Return My Order</Link></li>
              <li><Link to="/products" className="hover:text-[#ff512f] transition font-semibold">Search Catalog</Link></li>
            </ul>
          </div>

          {/* Our Policies (2 cols) */}
          <div className="lg:col-span-2 text-left">
            <h3 className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white font-title mb-6">OUR POLICIES</h3>
            <ul className="space-y-3.5 text-xs text-slate-500 dark:text-[#94a3b8]">
              <li><Link to="/about" className="hover:text-[#ff512f] transition font-semibold">Shipping & Delivery</Link></li>
              <li><Link to="/about" className="hover:text-[#ff512f] transition font-semibold">Returns & Cancellations</Link></li>
              <li><Link to="/about" className="hover:text-[#ff512f] transition font-semibold">Terms & Conditions</Link></li>
              <li><Link to="/about" className="hover:text-[#ff512f] transition font-semibold">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* My Account (2 cols) */}
          <div className="lg:col-span-2 text-left">
            <h3 className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white font-title mb-6">MY ACCOUNT</h3>
            <ul className="space-y-3.5 text-xs text-slate-500 dark:text-[#94a3b8]">
              <li><Link to="/User" className="hover:text-[#ff512f] transition font-semibold">Help & Advice</Link></li>
              <li><Link to="/orders" className="hover:text-[#ff512f] transition font-semibold">Order History</Link></li>
              <li><Link to="/wishlist" className="hover:text-[#ff512f] transition font-semibold">My Wishlist</Link></li>
              <li><Link to="/User" className="hover:text-[#ff512f] transition font-semibold">Account Settings</Link></li>
            </ul>
          </div>



        </div>
      </div>

      {/* 3. Bottom Credits Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0f172a]/60 py-6 px-6 md:px-12 text-center text-xs text-slate-500 dark:text-[#94a3b8]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            &copy; 2026 <span className="text-[#ff512f] font-bold">EBOOST</span>. Redesigned Premium E-Commerce theme. All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  );
}
