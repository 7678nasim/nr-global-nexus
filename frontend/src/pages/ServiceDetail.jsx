import React, { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Send } from "lucide-react";
import { SERVICE_DETAILS } from "@/lib/serviceDetails";
import { useSEO } from "@/lib/seo";
import { api } from "@/lib/site";
import { toast } from "sonner";

const ServiceDetail = () => {
  const { slug } = useParams();
  const d = SERVICE_DETAILS[slug];
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", requirements: "" });
  const [openFaq, setOpenFaq] = useState(0);
  const [loading, setLoading] = useState(false);

  useSEO(d ? {
    title: `${d.title} | NR Global Nexus`,
    description: d.intro.slice(0, 160),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: d.title,
      provider: { "@type": "Organization", name: "NR Global Nexus" },
      description: d.intro,
      areaServed: "Worldwide",
    },
  } : {});

  if (!d) return <Navigate to="/services" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leads", { ...form, service: d.title, form_type: "proposal", source: `service-page:${slug}` });
      window.location.assign("/thank-you");
    } catch { toast.error("Submission failed. Please try again."); setLoading(false); }
  };

  return (
    <div data-testid={`service-page-${slug}`}>
      {/* HERO */}
      <section className="pt-36 pb-16 bg-[#0A192F] text-white relative overflow-hidden">
        <div className="absolute inset-0 nx-dot-bg opacity-30"/>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
          <img src={d.image} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0A192F]/60 to-[#0A192F]"/>
        </div>
        <div className="nx-container relative">
          <p className="nx-pill nx-pill-light">Services</p>
          <h1 className="font-display text-5xl md:text-7xl mt-5 max-w-3xl tracking-tight">{d.title}</h1>
          <p className="text-white/75 mt-5 max-w-2xl">{d.hero}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#inquiry" className="nx-btn-primary px-5 py-3 rounded-md text-sm font-medium inline-flex items-center gap-2">Request a Proposal <ArrowRight size={14}/></a>
            <Link to="/services" className="px-5 py-3 rounded-md text-sm font-medium border border-white/30 text-white hover:bg-white hover:text-[#0A192F] transition-colors">All Services</Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-20 bg-white">
        <div className="nx-container grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <p className="nx-pill">Overview</p>
            <h2 className="font-display text-3xl md:text-4xl mt-4 text-[#0A192F] tracking-tight">Outcomes engineered around your KPIs.</h2>
            <p className="text-[#0A192F]/70 mt-5 text-base leading-relaxed">{d.intro}</p>
          </div>
          <div className="lg:col-span-5">
            <img src={d.image} alt={d.title} className="rounded-2xl w-full h-full object-cover max-h-[420px]" />
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="nx-container">
          <p className="nx-pill">Benefits</p>
          <h2 className="font-display text-3xl md:text-5xl mt-4 text-[#0A192F] tracking-tight max-w-3xl">Why teams pick NR Global Nexus.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {d.benefits.map((b, i) => (
              <div key={b.title} data-testid={`benefit-${i}`} className="nx-card rounded-xl p-6">
                <CheckCircle2 size={18} className="text-[#0A58CA]" />
                <h3 className="font-display text-lg mt-3 text-[#0A192F]">{b.title}</h3>
                <p className="text-sm text-[#0A192F]/65 mt-2">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 bg-white">
        <div className="nx-container">
          <p className="nx-pill">Our Process</p>
          <h2 className="font-display text-3xl md:text-5xl mt-4 text-[#0A192F] tracking-tight">A 6-step delivery model.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {d.process.map((step, i) => (
              <div key={i} className="nx-card rounded-xl p-6">
                <span className="font-mono text-xs text-[#0A58CA]">0{i + 1}</span>
                <h3 className="font-display text-lg mt-3 text-[#0A192F]">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="nx-container max-w-3xl">
          <p className="nx-pill">FAQ</p>
          <h2 className="font-display text-3xl md:text-5xl mt-4 text-[#0A192F] tracking-tight">Quick answers.</h2>
          <div className="mt-8 space-y-2">
            {d.faqs.map((f, i) => (
              <div key={i} className="nx-card rounded-xl">
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} data-testid={`sfaq-${i}`} className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                  <span className="font-display text-base md:text-lg text-[#0A192F]">{f.q}</span>
                  <ArrowRight size={16} className={`transition-transform shrink-0 ${openFaq === i ? "rotate-90 text-[#0A58CA]" : "text-[#0A192F]/40"}`} />
                </button>
                {openFaq === i && <div className="px-6 pb-5 text-sm text-[#0A192F]/75">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INQUIRY CTA */}
      <section id="inquiry" className="py-24 bg-white">
        <div className="nx-container max-w-2xl">
          <div className="text-center">
            <p className="nx-pill mx-auto">Get a Proposal</p>
            <h2 className="font-display text-3xl md:text-5xl mt-4 text-[#0A192F] tracking-tight">Ready to scope {d.title}?</h2>
            <p className="text-[#0A192F]/65 mt-3">We'll come back within 24 hours with a tailored plan and indicative pricing.</p>
          </div>
          <form onSubmit={submit} className="nx-card rounded-2xl p-7 md:p-10 mt-10 grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="service-inquiry-form">
            {[
              { k: "name", l: "Full name", t: "text", req: true },
              { k: "email", l: "Work email", t: "email", req: true },
              { k: "phone", l: "Phone / WhatsApp", t: "tel", req: true },
              { k: "company", l: "Company", t: "text" },
            ].map(({ k, l, t, req }) => (
              <input key={k} required={req} type={t} placeholder={l + (req ? " *" : "")} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} data-testid={`sf-${k}`} className="w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none text-[#0A192F]" />
            ))}
            <textarea required rows={4} placeholder="Brief on your requirement *" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} data-testid="sf-requirements" className="md:col-span-2 w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none text-[#0A192F]" />
            <button type="submit" disabled={loading} data-testid="sf-submit" className="md:col-span-2 nx-btn-primary py-3 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2">{loading ? "Sending…" : <>Send Inquiry <Send size={14}/></>}</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
