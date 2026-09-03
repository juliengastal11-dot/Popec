import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Dumbbell, Flame, Mountain } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { scrollToSection } from "@/pages/Landing";

const services = [
  {
    id: "fitness-park",
    testId: "prestation-card-fitness-park-beziers",
    icon: Dumbbell,
    title: "Coaching en salle",
    place: "Fitness Park Béziers · Individuel & groupe",
    text: "Séances encadrées en salle partenaire, en coaching individuel ou en groupe : renforcement, cardio, préparation physique. Matériel pro, progression garantie.",
    img: "/images/hyrox-rouge.jpeg",
  },
  {
    id: "trail",
    testId: "prestation-card-conseil-trail",
    icon: Mountain,
    title: "Conseils & prépa trail, course à pied & endurance",
    place: "Grands espaces · Route & stade",
    text: "Plans d'entraînement trail et course à pied : dénivelé, technique de foulée, VMA, nutrition, stratégie de course. De votre premier 10 km nature au marathon.",
    img: "/images/spartan.png",
  },
  {
    id: "cours-collectifs",
    testId: "prestation-card-cours-collectifs-burning-cross-hydroxyde",
    icon: Flame,
    title: "Cours collectifs",
    place: "Burning · Cross · Hyrox",
    text: "Des formats signature à haute énergie : brûlez, transpirez, dépassez-vous en musique et en groupe.",
    img: "/images/coach-groupe.jpeg",
    pos: "center 72%",
  },
];

export default function Prestations() {
  return (
    <section
      id="prestations"
      data-testid="prestations-section"
      className="relative py-28 lg:py-36 bg-sanddeep border-y border-forest/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-terracotta font-mono">
            Mes prestations
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-forest mt-4 max-w-xl leading-[1.1]">
            Trois terrains, un seul objectif : le vôtre.
          </h2>
        </Reveal>

        <motion.div className="mt-14 grid md:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {services.map((s, i) => (
              <motion.article
                layout
                key={s.id}
                data-testid={s.testId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative rounded-3xl border border-forest/10 bg-sand overflow-hidden transition-shadow duration-500 hover:shadow-[0_30px_60px_-25px_rgba(15,76,99,0.35)]`}
              >
                {s.img && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={s.img}
                      alt={s.title}
                      loading="lazy"
                      style={{ objectPosition: s.pos || "center" }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-forest/20" />
                  </div>
                )}
                <div className="px-7 pb-7 pt-5">
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-forest">
                    {s.title}
                  </h3>
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-terracotta mt-1.5">
                    {s.place}
                  </p>
                  <p className="text-sm text-clay leading-relaxed mt-4">{s.text}</p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal delay={0.1} className="mt-12">
          <button
            data-testid="prestations-cta-contact"
            onClick={() => scrollToSection("contact")}
            className="group inline-flex items-center gap-2.5 text-forest font-semibold border-b-2 border-terracotta pb-1 transition-colors duration-300 hover:text-terracotta"
          >
            Une envie, un projet ? Parlons-en
            <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
