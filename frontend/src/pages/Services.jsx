import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { SERVICES } from "@/lib/site";
import * as Icons from "lucide-react";

const Services = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [location]);

  return (
    <div data-testid="services-page">
      <section className="pt-36 pb-16 bg-[#0A192F] text-white relative overflow-hidden">
        <div className="absolute inset-0 nx-dot-bg opacity-30" />
        <div className="nx-container relative">
          <p className="nx-pill nx-pill-light">Services</p>
          <h1 className="font-display text-5xl md:text-7xl mt-5 max-w-4xl tracking-tight">
            One partner. <span className="text-[#7FB3FF]">Six disciplines.</span> Real outcomes.
          </h1>
          <p className="text-white/70 mt-6 max-w-2xl">From front-line BPO to deep AI integration — every engagement is structured around your KPIs and shipped by dedicated pods.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="nx-container space-y-4">
          {SERVICES.map((s, i) => {
            const I = Icons[s.icon] || Icons.Sparkles;
            return (
              <div key={s.slug} id={s.slug} data-testid={`service-card-${s.slug}`} className="nx-card rounded-2xl p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#0A58CA]/8 text-[#0A58CA] flex items-center justify-center"><I size={20}/></div>
                    <span className="text-xs font-mono text-[#0A192F]/40">0{i + 1}</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl mt-4 text-[#0A192F] tracking-tight">{s.title}</h2>
                  <p className="text-[#0A192F]/70 mt-3">{s.description}</p>
                  <Link to={`/contact?form=proposal&service=${encodeURIComponent(s.title)}`} className="nx-btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium mt-6">
                    Request a proposal <ArrowRight size={14}/>
                  </Link>
                </div>
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {s.items.map((it) => (
                    <div key={it} className="flex items-start gap-2 p-4 border border-[var(--nx-line)] rounded-md hover:border-[#0A58CA]/40 transition-colors">
                      <Check size={16} className="text-[#0A58CA] mt-0.5 shrink-0" />
                      <span className="text-sm text-[#0A192F]">{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
export default Services;
