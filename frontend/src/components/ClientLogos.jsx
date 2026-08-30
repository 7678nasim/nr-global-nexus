import React from "react";

const LOGOS = [
  "FinEdge", "Lumio", "MedCare", "Sattva Ayurveda", "Velocity SaaS", "TrackPath",
  "Northstar", "Atlas Realty", "Solace EdTech", "Helix Insurance", "Civic Finance", "Kavya Wellness",
];

const ClientLogos = () => (
  <section data-testid="client-logos" className="py-14 bg-white border-y border-[var(--nx-line)]">
    <div className="nx-container">
      <p className="text-center text-[11px] uppercase tracking-[0.25em] text-[#0A192F]/55">Trusted by ambitious teams across 12+ countries</p>
      <div className="mt-8 relative overflow-hidden">
        <div className="flex gap-12 nx-marquee whitespace-nowrap">
          {[...LOGOS, ...LOGOS].map((name, i) => (
            <span key={i} className="font-display font-semibold text-2xl md:text-3xl text-[#0A192F]/30 hover:text-[#0A192F] transition-colors tracking-tight">
              {name}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent"></div>
      </div>
    </div>
  </section>
);
export default ClientLogos;
