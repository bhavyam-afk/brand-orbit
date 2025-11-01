import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Brand Orbit - Connect with Top Influencers",
  description: "Connecting And Marketing",
};

export default function Home() {
  return (
    <main className="min-h-screen">

      <Navbar />
      <Hero />
      <Features />
      <Footer />
     
    </main>
  );
}

