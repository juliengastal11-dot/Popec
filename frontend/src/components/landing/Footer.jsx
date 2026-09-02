import { Instagram, Timer } from "lucide-react";
import { scrollToSection } from "@/pages/Landing";

export default function Footer() {
  return (
    <footer data-testid="footer-section" className="relative bg-ink text-sand pt-20 pb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          <div>
            <div className="flex items-center gap-2.5">
              <a
                data-testid="footer-instagram-link"
                href="https://www.instagram.com/popec_run/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Popec Run"
                className="w-9 h-9 rounded-full bg-terracotta text-sand flex items-center justify-center transition-colors duration-300 hover:bg-aqua hover:text-ink"
              >
                <Instagram size={17} strokeWidth={2.2} />
              </a>
              <button
                data-testid="footer-logo"
                onClick={() => window.__lenis?.scrollTo(0, { duration: 1.4 })}
                className="font-display font-extrabold text-lg tracking-tight"
              >
                POPEC<span className="text-terracotta">RUN</span>
              </button>
            </div>
            <p className="mt-5 text-sm text-sand/50 max-w-xs leading-relaxed">
              Coaching sportif indépendant — trail, course à pied, remise en forme et cours
              collectifs. Béziers & grands espaces.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                data-testid="footer-social-instagram"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-sand/20 flex items-center justify-center text-sand/70 transition-all duration-300 hover:bg-terracotta hover:border-terracotta hover:text-sand"
              >
                <Instagram size={16} />
              </a>
              <a
                data-testid="footer-social-strava"
                href="https://strava.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Strava"
                className="w-10 h-10 rounded-full border border-sand/20 flex items-center justify-center text-sand/70 transition-all duration-300 hover:bg-terracotta hover:border-terracotta hover:text-sand"
              >
                <Timer size={16} />
              </a>
            </div>
          </div>

          <div className="flex gap-16 sm:gap-24">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-sand/40 mb-5">Navigation</p>
              <div className="flex flex-col gap-3">
                {[
                  ["manifeste", "Manifeste"],
                  ["prestations", "Prestations"],
                  ["apropos", "À propos"],
                  ["contact", "Contact"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    data-testid={`footer-link-${id}`}
                    onClick={() => scrollToSection(id)}
                    className="text-left text-sm text-sand/70 transition-colors duration-300 hover:text-terracotta"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-sand/40 mb-5">Terrains</p>
              <div className="flex flex-col gap-3 text-sm text-sand/70">
                <span>Fitness Park Béziers</span>
                <span>Sentiers & crêtes du Biterrois</span>
                <span>À domicile ou en entreprise</span>
              </div>
            </div>
          </div>
        </div>

        <p className="font-display font-extrabold text-[13vw] leading-none text-outline-sand select-none text-center mt-16 -mb-4">
          POPEC RUN
        </p>

        <div className="border-t border-sand/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-sand/40">
          <span>© {new Date().getFullYear()} Popec Run — Coach diplômé DEUST · Métiers de la Forme</span>
          <span>Fait pour ceux qui aiment suer dehors.</span>
        </div>
      </div>
    </footer>
  );
}
