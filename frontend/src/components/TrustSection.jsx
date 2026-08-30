import React from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";

const TRUST_ITEMS = [
  { title: "NDA & Confidentiality", desc: "Mutual NDAs on day one. Secure-room delivery and access controls for sensitive workflows.", icon: "FileLock2" },
  { title: "Dedicated Account Manager", desc: "One accountable POC owns delivery, escalations and weekly business reviews.", icon: "UserCheck" },
  { title: "Quality Assurance Process", desc: "100% interaction QA via dedicated coaches and AI-led monitoring against your scorecards.", icon: "ShieldCheck" },
  { title: "Project Monitoring System", desc: "Live dashboards on productivity, quality, attendance and outcome KPIs — visible 24/7.", icon: "Activity" },
  { title: "Transparent Reporting", desc: "Weekly governance reports tied to your KPIs. No black boxes. Drill down to agent-level data.", icon: "BarChart3" },
  { title: "Long-Term Partnership", desc: "Engagements designed to compound — not churn. We co-build roadmaps quarter over quarter.", icon: "Handshake" },
];

export const TrustSection = () => (
  <section className="py-24 md:py-32 bg-[#F8F9FA]" data-testid="trust-section">
    <div className="nx-container">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
        <div className="lg:col-span-6">
          <p className="nx-pill">Why Clients Choose NR Global Nexus</p>
          <h2 className="font-display text-4xl md:text-5xl mt-4 tracking-tight text-[#0A192F]">
            A high-trust delivery model — engineered, not improvised.
          </h2>
        </div>
        <p className="lg:col-span-6 text-[#0A192F]/65 self-end">
          From signing the NDA to your first business review — every step is structured around accountability, transparency and outcomes.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TRUST_ITEMS.map((t, i) => {
          const I = Icons[t.icon] || Icons.ShieldCheck;
          return (
            <div key={t.title} data-testid={`trust-${i}`} className="nx-card rounded-xl p-7 group">
              <div className="w-11 h-11 rounded-lg bg-[#0A58CA]/8 text-[#0A58CA] flex items-center justify-center group-hover:bg-[#0A58CA] group-hover:text-white transition-colors">
                <I size={20} />
              </div>
              <h3 className="font-display text-xl mt-4 text-[#0A192F]">{t.title}</h3>
              <p className="text-sm text-[#0A192F]/65 mt-2 leading-relaxed">{t.desc}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-12 text-center">
        <Link to="/contact?form=consultation" className="nx-btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-medium" data-testid="trust-cta">
          Talk to our team <ArrowRight size={14}/>
        </Link>
      </div>
    </div>
  </section>
);

export default TrustSection;
