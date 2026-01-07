import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <main className="bg-gradient-to-br from-[#0a0f2c] via-[#1a1f3c] to-[#232946]">

      <Navbar />
      <Hero />
      <Features />
      <Footer />
     
    </main>
  );
}

