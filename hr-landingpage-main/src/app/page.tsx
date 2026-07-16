import SiteHeader from "../components/SiteHeader";
import Hero from "../components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import WhyUs from "@/components/WhyUs";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ProductShowcase />
        <WhyUs />
        <Features />
        <Pricing />
        <CtaBanner />
        <Footer />
      </main>
    </>
  );
}