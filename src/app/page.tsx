import CtaBand from "@/components/site/CtaBand";
import Features from "@/components/site/Features";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import Pricing from "@/components/site/Pricing";
import Problems from "@/components/site/Problems";
import Security from "@/components/site/Security";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Problems />
        <Features />
        <Security />
        <Pricing />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
