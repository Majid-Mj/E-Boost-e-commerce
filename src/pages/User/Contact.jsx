import React from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <h2 className="text-4xl font-bold text-[#00FFFF] mb-6 text-center">
          Contact Us
        </h2>
        <p className="text-gray-400 max-w-xl text-center mb-10">
          Have any questions or feedback? We’d love to hear from you! Fill out the form below and our team will get back to you soon.
        </p>

        <form className="w-full max-w-lg bg-[#121212] p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              rows="5"
              placeholder="Write your message here..."
              className="w-full px-4 py-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00FFFF] text-black py-3 rounded-md font-semibold hover:bg-cyan-400 transition"
          >
            Send Message
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-400">
            📍 123 Gaming Street, calicut , India
          </p>
          <p className="text-gray-400 mt-2">
            📞 +91 7529375603 | ✉️ support@eboost.com
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
