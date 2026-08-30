import React, { useState } from "react";
import { Handshake, ArrowRight, CheckCircle2, Send } from "lucide-react";
import { api, PARTNERSHIPS } from "@/lib/site";
import { toast } from "sonner";
import * as Icons from "lucide-react";

const BENEFITS = [
  "Co-branded growth — leverage our delivery network and your client relationships.",
  "Recurring revenue share on every active engagement.",
  "Dedicated partner manager and shared performance dashboards.",
  "White-label delivery available for agencies and consultancies.",
  "Access to vetted talent pool across BPO, sales, marketing and tech.",
  "Joint go-to-market for high-potential verticals and geographies.",
];

const PARTNER_TYPES = [
  "BPO Center",
  "Freelancer",
  "Consultant",
  "Recruitment Agency",
  "Sales Agency",
  "Marketing Agency",
  "Business Development Professional",
  "Startup Consultant",
  "Channel Partner",
  "Strategic Business Partner",
];

const Partnership = () => {
  const [form, setForm] = useState({
    name: "", company: "", designation: "", email: "", phone: "",
    country: "", industry: "Partnership", service: "", requirements: "",
  });
  const [partnerType, setPartnerType] = useState(PARTNER_TYPES[0]);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leads", {
        ...form,
        service: partnerType,
        form_type: "partnership",
        source: "partnership-page",
      });
      toast.success("Thanks! Our partnership team will reach out within 24 hours.");
      setForm({ name: "", company: "", designation: "", email: "", phone: "", country: "", industry: "Partnership", service: "", requirements: "" });
    } catch { toast.error("Submission failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div data-testid="partnership-page">
      <section className="pt-36 pb-16 bg-[#0A192F] text-white relative overflow-hidden">
        <div className="absolute inset-0 nx-dot-bg opacity-30"/>
        <div className="nx-container relative">
          <p className="nx-pill nx-pill-light"><Handshake size={13}/> Partnership Program</p>
          <h1 className="font-display text-5xl md:text-7xl mt-5 max-w-4xl tracking-tight">Grow with us — <span className="text-[#7FB3FF]">don't sell alone.</span></h1>
          <p className="text-white/70 mt-6 max-w-2xl">Join our partner network and unlock co-branded delivery, recurring revenue and access to a vetted pool of BPO, sales, marketing and tech talent.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="nx-container">
          <p className="nx-pill">Who can partner</p>
          <h2 className="font-display text-4xl md:text-5xl mt-3 tracking-tight text-[#0A192F]">Ten ways to grow together.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {PARTNERSHIPS.map((p, i) => {
              const I = Icons[p.icon] || Icons.Handshake;
              return (
                <div key={p.title} data-testid={`partnership-${i}`} className="nx-card rounded-xl p-6">
                  <I size={20} className="text-[#0A58CA]" />
                  <h3 className="font-display text-lg mt-3 text-[#0A192F]">{p.title}</h3>
                  <p className="text-sm text-[#0A192F]/65 mt-2">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F8F9FA]">
        <div className="nx-container grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <p className="nx-pill">Why partner</p>
            <h2 className="font-display text-4xl md:text-5xl mt-3 tracking-tight text-[#0A192F]">Six concrete reasons.</h2>
            <ul className="mt-8 space-y-4">
              {BENEFITS.map((b) => (
                <li key={b} className="flex gap-3 items-start">
                  <CheckCircle2 size={18} className="text-[#0A58CA] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#0A192F]/80">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={submit} className="lg:col-span-7 nx-card rounded-2xl p-7 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="partnership-form">
            <h3 className="md:col-span-2 font-display text-2xl text-[#0A192F]">Partnership Inquiry</h3>
            {[
              { k: "name", l: "Full Name", t: "text", req: true },
              { k: "company", l: "Company / Brand", t: "text", req: true },
              { k: "designation", l: "Designation", t: "text" },
              { k: "email", l: "Email", t: "email", req: true },
              { k: "phone", l: "Phone / WhatsApp", t: "tel", req: true },
              { k: "country", l: "Country", t: "text" },
            ].map(({ k, l, t, req }) => (
              <label key={k} className="text-xs uppercase tracking-widest text-[#0A192F]/60">
                {l}{req && " *"}
                <input required={req} type={t} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} data-testid={`partnership-${k}`} className="mt-1.5 w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none normal-case tracking-normal text-[#0A192F]" />
              </label>
            ))}
            <label className="text-xs uppercase tracking-widest text-[#0A192F]/60 md:col-span-2">
              Partner Type *
              <select required value={partnerType} onChange={(e) => setPartnerType(e.target.value)} data-testid="partnership-type" className="mt-1.5 w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none normal-case tracking-normal text-[#0A192F] bg-white">
                {PARTNER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="text-xs uppercase tracking-widest text-[#0A192F]/60 md:col-span-2">
              Tell us about your business & how you'd like to partner *
              <textarea required rows={5} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} data-testid="partnership-requirements" className="mt-1.5 w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none normal-case tracking-normal text-[#0A192F]" />
            </label>
            <div className="md:col-span-2 flex items-center justify-between flex-wrap gap-3">
              <p className="text-[11px] text-[#0A192F]/50 max-w-md">Submissions are reviewed by our partnership team and are kept strictly confidential.</p>
              <button type="submit" disabled={loading} data-testid="partnership-submit" className="nx-btn-primary px-6 py-3 rounded-md text-sm font-medium inline-flex items-center gap-2">
                {loading ? "Sending…" : "Submit Inquiry"} <Send size={14}/>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
export default Partnership;
