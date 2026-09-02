import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { CalendarCheck, Loader2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SLOTS = ["07:00", "09:00", "12:00", "14:00", "17:30", "19:00"];

const inputCls =
  "w-full rounded-2xl border border-forest/20 bg-white/70 text-ink placeholder:text-clay/60 px-5 py-4 text-sm outline-none transition-[border-color,background-color] duration-300 focus:border-wave focus:bg-white";

export default function Reservation() {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", slot: "" });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.slot) {
      toast.error("Choisissez un créneau horaire");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/booking`, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        date: form.date,
        slot: form.slot,
      });
      toast.success("Créneau réservé !", {
        description: "Popec vous confirme votre bilan très vite. Préparez vos baskets.",
      });
      setForm({ name: "", email: "", phone: "", date: "", slot: "" });
    } catch {
      toast.error("Réservation impossible", {
        description: "Vérifiez les champs puis réessayez.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="reservation"
      data-testid="reservation-section"
      className="relative py-28 lg:py-36 bg-skywash border-y border-forest/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-14 items-center">
        <div className="lg:col-span-5">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-wave font-mono">
              Réservation en ligne
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-forest mt-4 leading-[1.1]">
              Réservez votre bilan offert.
            </h2>
            <p className="mt-6 text-base sm:text-lg text-clay leading-relaxed max-w-md">
              30 minutes pour faire le point sur vos objectifs, votre niveau et vos envies —
              en salle ou dehors, sans engagement. Choisissez un créneau, je m'occupe du reste.
            </p>
            <p className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-forest">
              <span className="w-9 h-9 rounded-full bg-aqua/40 border border-forest/10 flex items-center justify-center shrink-0">
                <CalendarCheck size={16} className="text-forest" />
              </span>
              Confirmation personnelle sous 48 h
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <form
            data-testid="reservation-form"
            onSubmit={submit}
            className="rounded-[2rem] border border-forest/10 bg-sand p-7 sm:p-10 flex flex-col gap-5 shadow-[0_30px_60px_-25px_rgba(15,76,99,0.25)]"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <input
                data-testid="reservation-input-name"
                type="text"
                required
                minLength={2}
                placeholder="Nom complet *"
                value={form.name}
                onChange={set("name")}
                className={inputCls}
              />
              <input
                data-testid="reservation-input-email"
                type="email"
                required
                placeholder="Email *"
                value={form.email}
                onChange={set("email")}
                className={inputCls}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <input
                data-testid="reservation-input-phone"
                type="tel"
                placeholder="Téléphone (optionnel)"
                value={form.phone}
                onChange={set("phone")}
                className={inputCls}
              />
              <input
                data-testid="reservation-input-date"
                type="date"
                required
                min={today}
                value={form.date}
                onChange={set("date")}
                className={`${inputCls} cursor-pointer`}
              />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-clay mb-3">
                Créneau souhaité *
              </p>
              <div className="flex flex-wrap gap-2">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    data-testid={`reservation-slot-${s.replace(":", "")}`}
                    onClick={() => setForm({ ...form, slot: s })}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 active:scale-95 ${
                      form.slot === s
                        ? "bg-forest text-sand"
                        : "bg-transparent border border-forest/25 text-forest hover:border-forest"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button
              data-testid="reservation-submit-button"
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-forest text-sand font-semibold px-8 py-4 transition-all duration-300 hover:bg-wave active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Réservation en cours…
                </>
              ) : (
                "Je réserve mon bilan"
              )}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
