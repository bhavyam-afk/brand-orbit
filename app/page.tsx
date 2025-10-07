import React from "react";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Hero from "@/components/Hero";


export const metadata = {
  title: "BrandOrbit",
  description: "Conneting And Marketing",
};


export default function Home() {
  return (
    <main className="space-bg min-h-screen text-white">

      <Navbar />
      <Hero />
      <Features />
      <Footer />
      
    </main>
  );
}

