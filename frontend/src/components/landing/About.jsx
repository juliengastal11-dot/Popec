import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Award, Handshake, MapPin } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const stats = [
  { value: "DEUST", label: "Métiers de la Forme" },
  { value: "6", label: "Disciplines coachées" },
  { value: "100%", label: "Programmes sur-mesure" },
  { value: "2", label: "Terrains : salle & nature" },
];

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section id="apropos" ref={ref} data-testid="about-coach-section" className="relative py-28 lg:py-40 overflow-hidden">
      <span
        aria-hidden="true"
        className="absolute top-10 right-0 font-display font-extrabold text-[18vw] leading-none text-outline select-none pointer-events-none"
      >
        COACH
      </span>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <div className="grid lg:grid-cols-12 gap-14 items-center">
          <Reveal className="lg:col-span-5">
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] rounded-bl-[6rem] aspect-[4/5] shadow-[0_40px_80px_-30px_rgba(27,59,43,0.45)]">
                <motion.img
                  data-testid="coach-portrait-image"
                  src="/images/coach-portrait.jpeg"
                  alt="Portrait souriant de Popec, coach sportif diplômé DEUST Métiers de la Forme, en extérieur"
                  style={{ y: imgY }}
                  className="w-full h-[115%] object-cover -mt-[7%]"
                  loading="lazy"
                />
              </div>
              <div
                data-testid="bpjeps-certification-badge"
                className="absolute -top-5 -right-4 bg-forest text-sand rounded-2xl px-5 py-4 shadow-xl flex items-center gap-3 rotate-2"
              >
                <Award size={22} className="text-ochre shrink-0" />
                <div>
                  <p className="font-display font-bold text-sm leading-tight">Diplômé DEUST</p>
                  <p className="text-[11px] text-sand/70 font-mono uppercase tracking-widest">Métiers de la Forme</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-terracotta font-mono">
                Oh fait ! Je ne me suis même pas présenté
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-forest mt-4 leading-[1.1]">
                Popec, un coach de terrain avant tout.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-base sm:text-lg text-clay leading-relaxed max-w-2xl">
                Moi, c'est Popec : coach diplômé DEUST Métiers de la Forme. Compétiteur de Trail
                Running et Hyrox, j'accompagne également des personnes pour de la transformation
                physique, ainsi que pour de la performance et remise en forme grâce à une méthode
                d'entraînement hybride (Endurance, Force ..) On s'entraîne sérieusement sans se
                prendre au sérieux !
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div
                data-testid="fitness-park-partner-badge"
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl border border-forest/15 bg-sanddeep px-5 py-4 text-center"
              >
                <Handshake size={20} className="text-terracotta shrink-0" />
                <p className="text-sm font-semibold text-forest">
                  Coach partenaire <span className="text-terracotta">Fitness Park Béziers</span>
                  <span className="flex items-center gap-1.5 text-xs text-clay font-normal mt-0.5">
                    <MapPin size={12} /> Séances en salle & en extérieur, Béziers et alentours
                  </span>
                </p>
              </div>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={0.1 + i * 0.08}>
                  <div className="border-t-2 border-forest/15 pt-4">
                    <p className={`font-display font-extrabold text-forest whitespace-nowrap ${
                      s.value.length > 4 ? "text-lg sm:text-xl pt-1.5" : "text-2xl sm:text-3xl"
                    }`}>
                      {s.value}
                    </p>
                    <p className="text-xs font-mono uppercase tracking-[0.15em] text-clay mt-1.5">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
