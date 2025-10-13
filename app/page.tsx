
import Navbar from "../components/Navbar";
import Hero from "@/components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

export const metadata = {
  title: "BrandOrbit",
  description: "Connecting And Marketing",
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

