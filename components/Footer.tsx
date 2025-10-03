"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="container mx-auto flex flex-col items-center gap-8">
        {/* Social Media Links */}
        <div className="flex gap-6 mb-6">
          {/* Replace # with your actual social media URLs */}
          <a href="#" target="_blank" rel="noopener noreferrer" title="Instagram">
            <span className="text-3xl">📸</span>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" title="Twitter">
            <span className="text-3xl">🐦</span>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <span className="text-3xl">💼</span>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" title="YouTube">
            <span className="text-3xl">▶️</span>
          </a>
        </div>
        {/* Feedback Form */}
        <form className="w-full max-w-md bg-gray-800 rounded-lg p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold mb-2">Feedback</h3>
          <input type="text" placeholder="Your Name" className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none" />
          <input type="email" placeholder="Your Email" className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none" />
          <textarea placeholder="Your Feedback" className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none" rows={3} />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold">Submit</button>
        </form>
        <div className="mt-6 text-sm text-gray-400">© 2025 Brand Orbit. All rights reserved.</div>
      </div>
    </footer>
  );
}
