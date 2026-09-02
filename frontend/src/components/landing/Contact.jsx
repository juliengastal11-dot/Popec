import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowRight, Loader2, Mail, MapPin } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const objectives = [
  "Trail & outdoor",
  "Course à pied",
  "Remise en forme",
  "Coaching en salle — Fitness Park",
  "Cours collectifs (Burning, Cross, Hyrox)",
  "Autre projet",
];

const inputCls =
  "w-full rounded-2xl border border-sand/20 bg-sand/10 text-sand placeholder:text-sand/40 px-5 py-4 text-sm outline-none transition-[border-color,background-color] duration-300 focus:border-ochre focus:bg-sand/15";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", objective: objectives[0], message: "" });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        objective: form.objective,
        message: form.message.trim(),
      });
      toast.success("Message envoyé !", {
        description: "Popec vous recontacte très vite pour caler votre premier bilan.",
      });
      setForm({ name: "", email: "", phone: "", objective: objectives[0], message: "" });
    } catch (err) {
      toast.error("Envoi impossible", {
        description: "Vérifiez les champs du formulaire puis réessayez.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" data-testid="contact-section" className="relative py-28 lg:py-36 bg-wave text-sand overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1600"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.12]"
        loading="lazy"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-6 left-0 font-display font-extrabold text-[16vw] leading-none text-outline-sand select-none pointer-events-none"
      >
        GO !
      </span>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-5">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-ochre font-mono">
              Prise de contact
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight mt-4 leading-[1.08]">
              Votre premier pas commence ici.
            </h2>
            <p className="mt-6 text-sand/70 leading-relaxed max-w-md">
              Racontez-moi votre projet : objectif, niveau, disponibilités. Je reviens vers vous
              sous 48 h pour un premier échange, sans engagement.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col gap-4">
              <p className="flex items-center gap-3 text-sm text-sand/80">
                <span className="w-9 h-9 rounded-full bg-sand/10 border border-sand/15 flex items-center justify-center shrink-0">
                  <MapPin size={15} className="text-ochre" />
                </span>
                Béziers & alentours — salle Fitness Park et terrains outdoor
              </p>
              <p className="flex items-center gap-3 text-sm text-sand/80">
                <span className="w-9 h-9 rounded-full bg-sand/10 border border-sand/15 flex items-center justify-center shrink-0">
                  <Mail size={15} className="text-ochre" />
                </span>
                Réponse garantie sous 48 h
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <form
            data-testid="contact-form"
            onSubmit={submit}
            className="rounded-[2rem] border border-sand/15 bg-sand/[0.06] backdrop-blur-md p-7 sm:p-10 flex flex-col gap-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <input
                data-testid="contact-input-name"
                type="text"
                required
                minLength={2}
                placeholder="Nom complet *"
                value={form.name}
                onChange={set("name")}
                className={inputCls}
              />
              <input
                data-testid="contact-input-email"
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
                data-testid="contact-input-phone"
                type="tel"
                placeholder="Téléphone (optionnel)"
                value={form.phone}
                onChange={set("phone")}
                className={inputCls}
              />
              <select
                data-testid="contact-select-objective"
                value={form.objective}
                onChange={set("objective")}
                className={`${inputCls} appearance-none cursor-pointer [&>option]:text-ink`}
              >
                {objectives.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              data-testid="contact-textarea-message"
              required
              minLength={5}
              rows={5}
              placeholder="Votre message : objectif, niveau, disponibilités… *"
              value={form.message}
              onChange={set("message")}
              className={`${inputCls} resize-none`}
            />
            <button
              data-testid="contact-submit-button"
              type="submit"
              disabled={loading}
              className="group mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-terracotta text-sand font-semibold px-8 py-4 transition-all duration-300 hover:bg-ochre hover:gap-4 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  Envoyer ma demande
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
