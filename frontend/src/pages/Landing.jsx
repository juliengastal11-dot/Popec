import { useEffect } from "react";
import Lenis from "lenis";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import EditorialMarquee from "@/components/landing/EditorialMarquee";
import Manifesto from "@/components/landing/Manifesto";
import Prestations from "@/components/landing/Prestations";
import About from "@/components/landing/About";
import WhatsAppBubble from "@/components/landing/WhatsAppBubble";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";

export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -72, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

export default function Landing() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    window.__lenis = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <main className="relative overflow-x-clip">
      <div className="grain-overlay" aria-hidden="true" />
      <Nav />
      <Hero />
      <EditorialMarquee />
      <Manifesto />
      <Prestations />
      <About />
      <Contact />
      <WhatsAppBubble />
      <Footer />
    </main>
  );
}
