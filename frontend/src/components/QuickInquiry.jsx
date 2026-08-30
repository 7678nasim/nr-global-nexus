import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, Send } from "lucide-react";
import { api, SERVICES } from "@/lib/site";
import { toast } from "sonner";

/**
 * Sticky "Request Proposal" pill on the right side + Quick Inquiry modal.
 * Hidden on /contact (to avoid duplicate form) and /admin.
 */
const QuickInquiry = () => {
  const { pathname } = useLocation();
  const hidden = pathname.startsWith("/contact") || pathname.startsWith("/admin");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", service: "", requirements: "" });
  const [loading, setLoading] = useState(false);

  // Auto-open on first scroll past 60% (only once per session)
  useEffect(() => {
    if (hidden) return;
    if (sessionStorage.getItem("nx_qi_shown")) return;
    const onScroll = () => {
      const pct = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (pct > 0.55) {
        sessionStorage.setItem("nx_qi_shown", "1");
        setOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden]);

  if (hidden) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leads", { ...form, form_type: "proposal", source: "quick-inquiry-popup" });
      setOpen(false);
      toast.success("Thanks! Our team will reach out within 24 hours.");
      window.location.assign("/thank-you");
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <>
      {/* Sticky right-side pill — hidden on small screens to avoid overlap */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="sticky-request-proposal"
        className="hidden xl:flex fixed right-0 top-1/2 -translate-y-1/2 z-30 origin-right -rotate-90 translate-x-[42px] bg-[#0A58CA] hover:bg-[#0047AB] text-white text-xs font-semibold tracking-widest uppercase px-5 py-3 rounded-t-md shadow-lg shadow-[#0A58CA]/30 transition-colors"
        aria-label="Request a Proposal"
      >
        Request Proposal
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden border-none" data-testid="quick-inquiry-modal">
          <div className="bg-[#0A192F] text-white p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-white">Get a tailored proposal in 24 hours</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-white/65 mt-1">Tell us what you're solving for — we'll match you with the right pod.</p>
          </div>
          <form onSubmit={submit} className="p-6 space-y-3 bg-white" data-testid="quick-inquiry-form">
            {[
              { k: "name", l: "Full name", t: "text", req: true },
              { k: "email", l: "Work email", t: "email", req: true },
              { k: "phone", l: "Phone / WhatsApp", t: "tel", req: true },
              { k: "company", l: "Company", t: "text" },
            ].map(({ k, l, t, req }) => (
              <input
                key={k}
                required={req}
                type={t}
                placeholder={l + (req ? " *" : "")}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                data-testid={`qi-${k}`}
                className="w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none text-[#0A192F]"
              />
            ))}
            <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} data-testid="qi-service" className="w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none text-[#0A192F] bg-white">
              <option value="">Service of interest</option>
              {SERVICES.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
              <option value="Other">Other / Not sure</option>
            </select>
            <textarea
              required
              rows={3}
              placeholder="Briefly, what are you solving for? *"
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              data-testid="qi-requirements"
              className="w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none text-[#0A192F]"
            />
            <button type="submit" disabled={loading} data-testid="qi-submit" className="nx-btn-primary w-full py-3 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2">
              {loading ? "Sending…" : <>Send Inquiry <Send size={14}/></>}
            </button>
            <p className="text-[10px] text-[#0A192F]/50 text-center">Your information is kept strictly confidential.</p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickInquiry;
