import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Award } from "lucide-react";
import { scrollToSection } from "@/pages/Landing";

const HERO_IMG = "/images/coach-sled-push.jpeg";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } },
};

const lineReveal = {
  hidden: { y: "115%" },
  visible: { y: "0%", transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);

  return (
    <section
      id="hero"
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-screen flex flex-col justify-end overflow-hidden pt-28"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full relative z-10 grid lg:grid-cols-12 gap-10 items-end pb-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={{ y: textY }}
          className="lg:col-span-7 pb-6"
        >
          <motion.div variants={fade} className="mb-8">
            <span
              data-testid="hero-bpjeps-badge"
              className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-sanddeep px-4 py-1.5 text-xs font-mono uppercase tracking-[0.25em] text-forest"
            >
              <Award size={14} className="text-terracotta" />
              Coach diplômé BPJEPS — Béziers
            </span>
          </motion.div>

          <h1
            data-testid="hero-headline"
            className="font-display font-extrabold tracking-tight leading-[1.04] text-4xl sm:text-5xl lg:text-[4.4rem] text-forest"
          >
            <span className="block overflow-hidden pb-1">
              <motion.span variants={lineReveal} className="block">
                Repoussez vos
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-1">
              <motion.span variants={lineReveal} className="block">
                limites. <span className="text-terracotta">Domptez</span>
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span variants={lineReveal} className="block">
                le terrain.
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={fade}
            className="mt-6 max-w-xl text-base sm:text-lg text-clay leading-relaxed"
          >
            Coaching running, trail et remise en forme — en pleine nature ou en salle chez
            Fitness Park Béziers. Un accompagnement sur-mesure, exigeant et profondément humain.
          </motion.p>

          <motion.div variants={fade} className="mt-9 flex flex-wrap items-center gap-4">
            <button
              data-testid="hero-cta-primary"
              onClick={() => scrollToSection("prestations")}
              className="group inline-flex items-center gap-2.5 rounded-full bg-forest text-sand font-semibold px-8 py-4 transition-all duration-300 hover:bg-terracotta hover:gap-4 active:scale-95"
            >
              Explorer les prestations
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              data-testid="hero-cta-secondary"
              onClick={() => scrollToSection("contact")}
              className="inline-flex items-center gap-2.5 rounded-full border-2 border-forest/25 text-forest font-semibold px-8 py-[14px] transition-all duration-300 hover:border-forest hover:bg-forest hover:text-sand active:scale-95"
            >
              Prendre contact
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative"
        >
          <div className="relative overflow-hidden rounded-[2rem] rounded-tr-[6rem] aspect-[4/5] max-h-[62vh] w-full shadow-[0_40px_80px_-30px_rgba(27,59,43,0.45)]">
            <motion.img
              data-testid="hero-trail-image"
              src={HERO_IMG}
              alt="Popec, coach sportif, en pleine poussée de sled lors d'une compétition outdoor"
              style={{ y: imgY, scale: imgScale }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-forest/15" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-sand rounded-2xl border border-forest/10 shadow-xl px-5 py-4 flex items-center gap-4">
            <span className="font-display font-extrabold text-3xl text-forest">100%</span>
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-clay leading-snug">
              Sur-mesure
              <br />
              Salle & Outdoor
            </span>
          </div>
        </motion.div>
      </div>

      <motion.button
        data-testid="hero-scroll-indicator"
        onClick={() => scrollToSection("manifeste")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-6 lg:left-10 z-10 hidden sm:flex items-center gap-3 text-forest/60 text-xs font-mono uppercase tracking-[0.25em] transition-colors duration-300 hover:text-forest"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ArrowDown size={15} />
        </motion.span>
        Défiler
      </motion.button>
    </section>
  );
}
