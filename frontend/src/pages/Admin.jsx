import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, LogOut, Mail, Mountain, Phone, Trash2, Inbox } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "popec_admin_token";

const inputCls =
  "w-full rounded-2xl border border-forest/20 bg-white/60 text-ink placeholder:text-clay/60 px-5 py-4 text-sm outline-none transition-[border-color] duration-300 focus:border-terracotta";

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [leads, setLeads] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loadLeads = async (tk) => {
    try {
      const { data } = await axios.get(`${API}/leads`, {
        headers: { Authorization: `Bearer ${tk}` },
      });
      setLeads(data);
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } else {
        toast.error("Impossible de charger les demandes");
        setLeads([]);
      }
    }
  };

  useEffect(() => {
    if (token) loadLeads(token);
  }, [token]);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email: email.trim(), password });
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      toast.success("Connexion réussie");
    } catch {
      toast.error("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setLeads(null);
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${API}/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast.success("Demande supprimée");
    } catch {
      toast.error("Suppression impossible");
    }
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-sand flex items-center justify-center px-6">
        <div className="grain-overlay" aria-hidden="true" />
        <form
          data-testid="admin-login-form"
          onSubmit={login}
          className="w-full max-w-md rounded-[2rem] border border-forest/10 bg-sanddeep p-9 shadow-[0_30px_60px_-25px_rgba(12,59,76,0.25)]"
        >
          <div className="flex items-center gap-2.5 mb-8">
            <span className="w-10 h-10 rounded-full bg-forest text-sand flex items-center justify-center">
              <Mountain size={18} />
            </span>
            <div>
              <p className="font-display font-extrabold text-forest leading-tight">POPEC RUN</p>
              <p className="text-xs font-mono uppercase tracking-widest text-clay">Espace coach</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <input
              data-testid="admin-email-input"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
            <input
              data-testid="admin-password-input"
              type="password"
              required
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
            <button
              data-testid="admin-login-submit"
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-forest text-sand font-semibold px-6 py-3.5 transition-colors duration-300 hover:bg-terracotta disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Se connecter
            </button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main data-testid="admin-dashboard" className="min-h-screen bg-sand">
      <div className="grain-overlay" aria-hidden="true" />
      <header className="border-b border-forest/10 bg-sand/85 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-forest text-sand flex items-center justify-center">
              <Mountain size={16} />
            </span>
            <p className="font-display font-extrabold text-forest">
              Demandes reçues
              {leads && (
                <span data-testid="admin-leads-count" className="ml-3 text-sm font-mono font-semibold text-terracotta">
                  {leads.length}
                </span>
              )}
            </p>
          </div>
          <button
            data-testid="admin-logout-button"
            onClick={logout}
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest/70 transition-colors duration-300 hover:text-terracotta"
          >
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {leads === null ? (
          <div className="flex justify-center py-24" data-testid="admin-loading">
            <Loader2 size={28} className="animate-spin text-forest" />
          </div>
        ) : leads.length === 0 ? (
          <div data-testid="admin-empty-state" className="flex flex-col items-center gap-4 py-24 text-clay">
            <Inbox size={40} strokeWidth={1.5} />
            <p className="font-semibold">Aucune demande pour le moment.</p>
          </div>
        ) : (
          <div data-testid="admin-leads-list" className="grid gap-5">
            {leads.map((lead) => (
              <article
                key={lead.id}
                data-testid={`lead-card-${lead.id}`}
                className="rounded-3xl border border-forest/10 bg-sanddeep p-6 sm:p-8 flex flex-col gap-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display font-bold text-xl text-forest">{lead.name}</h3>
                    <p className="text-xs font-mono uppercase tracking-widest text-terracotta mt-1">
                      {lead.objective}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-clay font-mono">
                      {new Date(lead.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <button
                      data-testid={`lead-delete-${lead.id}`}
                      onClick={() => remove(lead.id)}
                      aria-label="Supprimer"
                      className="w-9 h-9 rounded-full border border-forest/15 flex items-center justify-center text-clay transition-all duration-300 hover:bg-red-700 hover:border-red-700 hover:text-sand"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-wrap">{lead.message}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-clay">
                  <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 hover:text-terracotta transition-colors duration-300">
                    <Mail size={14} className="text-terracotta" /> {lead.email}
                  </a>
                  {lead.phone && (
                    <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 hover:text-terracotta transition-colors duration-300">
                      <Phone size={14} className="text-terracotta" /> {lead.phone}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
