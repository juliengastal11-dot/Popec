import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Dumbbell, Flame, HeartPulse, Mountain, Route, Users } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { scrollToSection } from "@/pages/Landing";

const services = [
  {
    id: "fitness-park",
    testId: "prestation-card-fitness-park-beziers",
    icon: Dumbbell,
    title: "Coaching en salle",
    place: "Fitness Park Béziers",
    text: "Séances encadrées en salle partenaire : renforcement, cardio, préparation physique. Matériel pro, progression garantie.",
    tags: ["salle"],
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200",
    span: "md:col-span-4",
  },
  {
    id: "trail",
    testId: "prestation-card-conseil-trail",
    icon: Mountain,
    title: "Conseils & préparation trail",
    place: "Grands espaces",
    text: "Plans d'entraînement trail, gestion du dénivelé, nutrition, stratégie de course. De votre premier 10 km nature à l'ultra.",
    tags: ["outdoor"],
    img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200",
    span: "md:col-span-2",
  },
  {
    id: "running",
    testId: "prestation-card-course-a-pied",
    icon: Route,
    title: "Course à pied & endurance",
    place: "Route & stade",
    text: "Technique de foulée, VMA, fractionné, préparation 10 km → marathon. Courez plus vite, plus longtemps, sans blessure.",
    tags: ["outdoor"],
    span: "md:col-span-2",
  },
  {
    id: "remise-en-forme",
    testId: "prestation-card-remise-en-forme",
    icon: HeartPulse,
    title: "Remise en forme & vitalité",
    place: "Salle & extérieur",
    text: "Reprise d'activité douce ou intensive, perte de poids, tonicité. Un cap clair, un rythme adapté à votre vie.",
    tags: ["salle", "outdoor"],
    span: "md:col-span-2",
  },
  {
    id: "coaching-groupe",
    testId: "prestation-card-coaching-indiv-groupe",
    icon: Users,
    title: "Coaching individuel & groupe",
    place: "Solo ou tribu",
    text: "Séances one-to-one ultra personnalisées ou coaching de groupe convivial et stimulant, pour particuliers comme pour pros.",
    tags: ["salle", "outdoor"],
    span: "md:col-span-2",
  },
  {
    id: "cours-collectifs",
    testId: "prestation-card-cours-collectifs-burning-cross-hydroxyde",
    icon: Flame,
    title: "Cours collectifs",
    place: "Burning · Cross · Hyrox",
    text: "Des formats signature à haute énergie : brûlez, transpirez, dépassez-vous en musique et en groupe.",
    tags: ["salle"],
    img: "/images/coach-sled-pull.jpeg",
    span: "md:col-span-4",
  },
];

const filters = [
  { id: "all", label: "Tout", testId: "prestations-filter-all" },
  { id: "outdoor", label: "Outdoor", testId: "prestations-filter-outdoor" },
  { id: "salle", label: "En salle", testId: "prestations-filter-indoor" },
];

export default function Prestations() {
  const [filter, setFilter] = useState("all");
  const visible = services.filter((s) => filter === "all" || s.tags.includes(filter));

  return (
    <section
      id="prestations"
      data-testid="prestations-section"
      className="relative py-28 lg:py-36 bg-sanddeep border-y border-forest/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-terracotta font-mono">
              Les prestations
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-forest mt-4 max-w-xl leading-[1.1]">
              Six terrains, un seul objectif : le vôtre.
            </h2>
          </div>
          <div className="flex gap-2 flex-wrap" data-testid="prestations-filters">
            {filters.map((f) => (
              <button
                key={f.id}
                data-testid={f.testId}
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 active:scale-95 ${
                  filter === f.id
                    ? "bg-forest text-sand"
                    : "bg-transparent border border-forest/25 text-forest hover:border-forest"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div layout className="mt-14 grid md:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {visible.map((s, i) => (
              <motion.article
                layout
                key={s.id}
                data-testid={s.testId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative ${s.span} rounded-3xl border border-forest/10 bg-sand overflow-hidden transition-shadow duration-500 hover:shadow-[0_30px_60px_-25px_rgba(12,59,76,0.35)]`}
              >
                {s.img && (
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={s.img}
                      alt={s.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-forest/20" />
                  </div>
                )}
                <div className="p-7">
                  <div className="flex items-start justify-between">
                    <span className="w-11 h-11 rounded-2xl bg-forest/8 border border-forest/10 text-forest flex items-center justify-center transition-colors duration-300 group-hover:bg-terracotta group-hover:text-sand group-hover:border-terracotta">
                      <s.icon size={20} strokeWidth={2} />
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="text-forest/30 transition-all duration-300 group-hover:text-terracotta group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-forest mt-5">
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
