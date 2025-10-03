import React from "react";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Footer from "../components/Footer";

export const metadata = {
  title: "BrandOrbit",
  description: "Conneting And Marketing",
};

export default function Home() {
  return (
    <main className="space-bg min-h-screen text-white">
      <Navbar />
      {/* main description  */}
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="handlee-regular text-5xl font-extrabold mb-4 text-center drop-shadow-lg">Welcome to Brand Orbit</h1>
        <p className="text-lg text-gray-300 mb-10 text-center max-w-xl">The space where brands and influencers connect, collaborate, and launch successful campaigns. Explore our features below!</p>
      </div>
      <Features />
      <Footer />
    </main>
  );
}

