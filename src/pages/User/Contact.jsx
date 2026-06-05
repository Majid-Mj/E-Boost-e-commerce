import React from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-28 pb-16">
        <h2 className="text-4xl font-black font-title uppercase tracking-wide mb-3 text-center bg-gradient-to-r from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent">
          Contact Us
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl text-center mb-10 font-medium text-sm">
          Have any questions or feedback? We’d love to hear from you! Fill out the form below and our team will get back to you soon.
        </p>

        <form className="w-full max-w-lg bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="mb-6">
            <label className="block text-slate-700 dark:text-slate-350 mb-2 text-xs font-bold uppercase tracking-wider" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 border border-slate-200 dark:border-slate-800 transition-all font-medium text-sm"
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-700 dark:text-slate-350 mb-2 text-xs font-bold uppercase tracking-wider" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 border border-slate-200 dark:border-slate-800 transition-all font-medium text-sm"
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-700 dark:text-slate-350 mb-2 text-xs font-bold uppercase tracking-wider" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              rows="5"
              placeholder="Write your message here..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 border border-slate-200 dark:border-slate-800 transition-all font-medium text-sm"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition shadow-md shadow-orange-500/10 hover:opacity-95"
          >
            Send Message
          </button>
        </form>

        <div className="mt-10 text-center space-y-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <p>
            📍 123 Gaming Street, Calicut, India
          </p>
          <p>
            📞 +91 7529375603 | ✉️ support@eboost.com
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
