import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/Reveal";

const chapters = [
  {
    num: "01",
    testId: "manifesto-chapter-01",
    title: "La nature comme terrain de jeu",
    text: "Sentiers, crêtes, forêts : le dehors est la plus belle des salles. Le trail et la course à pied apprennent à lire le terrain, gérer l'effort et respirer. Chaque sortie est une aventure, chaque dénivelé une leçon.",
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200",
    alt: "Sentier forestier baigné de lumière, terrain de jeu naturel",
    tag: "Outdoor",
  },
  {
    num: "02",
    testId: "manifesto-chapter-02",
    title: "L'exigence du mouvement, en salle",
    text: "Partenaire de Fitness Park à Béziers, je vous accompagne aussi entre quatre murs : burning, cross training, hydroxyde. Des séances intenses, cadrées et progressives, pour construire un corps fort et durable.",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200",
    alt: "Salle de sport moderne équipée chez Fitness Park",
    tag: "Indoor",
  },
  {
    num: "03",
    testId: "manifesto-chapter-03",
    title: "Un suivi humain et mesurable",
    text: "Pas de programme copié-collé. Bilan initial, objectifs clairs, plan d'entraînement évolutif et réajustements constants. Votre progression se mesure, se célèbre et ne s'arrête jamais vraiment.",
    img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200",
    alt: "Paysage naturel de montagne et sentier de trail outdoor",
    tag: "Suivi",
  },
];

function Chapter({ chapter, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const reversed = index % 2 === 1;

  return (
    <div
      ref={ref}
      data-testid={chapter.testId}
      className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
        reversed ? "" : ""
      }`}
    >
      <Reveal className={`lg:col-span-6 ${reversed ? "lg:order-2" : ""}`}>
        <div className="flex items-start gap-6">
          <span className="font-mono font-semibold text-terracotta text-sm pt-3 tracking-widest">
            /{chapter.num}
          </span>
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-sage font-mono">
              {chapter.tag}
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-forest mt-3 leading-tight">
              {chapter.title}
            </h3>
            <p className="mt-5 text-base text-clay leading-relaxed max-w-lg">{chapter.text}</p>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.15} className={`lg:col-span-6 ${reversed ? "lg:order-1" : ""}`}>
        <div
          className={`relative overflow-hidden aspect-[16/11] shadow-[0_30px_60px_-25px_rgba(27,59,43,0.4)] ${
            reversed ? "rounded-[2rem] rounded-tl-[5rem]" : "rounded-[2rem] rounded-br-[5rem]"
          }`}
        >
          <motion.img
            src={chapter.img}
            alt={chapter.alt}
            style={{ y: imgY }}
            className="absolute inset-0 w-full h-[118%] object-cover -top-[9%]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-forest/10" />
        </div>
      </Reveal>
    </div>
  );
}

export default function Manifesto() {
  return (
    <section id="manifeste" data-testid="manifesto-section" className="relative py-28 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-terracotta font-mono">
            Le manifeste
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-forest mt-4 max-w-2xl leading-[1.1]">
            Trois convictions, une seule ligne de crête.
          </h2>
        </Reveal>
        <div className="mt-20 lg:mt-28 flex flex-col gap-24 lg:gap-36">
          {chapters.map((c, i) => (
            <Chapter key={c.num} chapter={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
