import Marquee from "react-fast-marquee";
import { Sparkle } from "lucide-react";

const items = [
  "Trail Running",
  "Fitness Park Béziers",
  "Remise en forme",
  "Cours collectifs Burning",
  "Fonctionnel",
  "Hyrox",
  "Diplômé DEUST · Métiers de la Forme",
  "Course à pied",
];

export default function EditorialMarquee() {
  return (
    <section
      data-testid="editorial-marquee-section"
      className="relative z-10 -rotate-1 bg-aqua py-5 border-y border-forest/15 shadow-[0_20px_50px_-20px_rgba(15,76,99,0.35)]"
    >
      <Marquee speed={35} gradient={false} pauseOnHover>
        {items.map((item) => (
          <span key={item} className="flex items-center gap-10 pr-10">
            <span className="font-display font-bold uppercase tracking-wide text-forest text-lg sm:text-xl whitespace-nowrap">
              {item}
            </span>
            <Sparkle size={16} className="text-forest shrink-0" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
