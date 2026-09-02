import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Menu, X } from "lucide-react";
import { scrollToSection } from "@/pages/Landing";

const links = [
  { id: "manifeste", label: "Manifeste", testId: "nav-link-manifesto" },
  { id: "prestations", label: "Prestations", testId: "nav-link-prestations" },
  { id: "apropos", label: "À Propos", testId: "nav-link-about" },
  { id: "contact", label: "Contact", testId: "nav-link-contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <motion.header
      data-testid="nav-header"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-[80] transition-[background-color,box-shadow,border-color] duration-500 border-b ${
        scrolled
          ? "bg-sand/85 backdrop-blur-xl border-forest/10 shadow-[0_8px_30px_rgba(15,76,99,0.06)]"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <a
            data-testid="nav-instagram-link"
            href="https://www.instagram.com/popec_run/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Popec Run"
            className="w-9 h-9 rounded-full bg-forest text-sand flex items-center justify-center transition-colors duration-300 hover:bg-terracotta"
          >
            <Instagram size={17} strokeWidth={2.2} />
          </a>
          <button
            data-testid="nav-logo-link"
            onClick={() => window.__lenis?.scrollTo(0, { duration: 1.4 })}
            className="font-display font-extrabold text-lg tracking-tight text-forest"
          >
            POPEC<span className="text-terracotta">RUN</span>
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              data-testid={l.testId}
              onClick={() => go(l.id)}
              className="relative text-sm font-semibold text-forest/80 transition-colors duration-300 hover:text-forest after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-terracotta after:transition-[width] after:duration-300 hover:after:w-full"
            >
              {l.label}
            </button>
          ))}
          <button
            data-testid="nav-cta-contact-button"
            onClick={() => go("contact")}
            className="ml-2 rounded-full bg-aqua text-forest text-sm font-semibold px-6 py-2.5 transition-all duration-300 hover:bg-[#7df1ff] hover:scale-[1.03] active:scale-95"
          >
            Réserver un bilan
          </button>
        </nav>

        <button
          data-testid="nav-mobile-menu-button"
          onClick={() => setOpen(!open)}
          className="md:hidden text-forest p-2"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-sand/95 backdrop-blur-xl border-t border-forest/10 px-6 py-6 flex flex-col gap-4">
          {links.map((l) => (
            <button
              key={l.id}
              data-testid={`${l.testId}-mobile`}
              onClick={() => go(l.id)}
              className="text-left font-display font-bold text-xl text-forest"
            >
              {l.label}
            </button>
          ))}
          <button
            data-testid="nav-cta-contact-button-mobile"
            onClick={() => go("contact")}
            className="rounded-full bg-aqua text-forest font-semibold px-6 py-3 mt-2"
          >
            Réserver un bilan
          </button>
        </div>
      )}
    </motion.header>
  );
}
