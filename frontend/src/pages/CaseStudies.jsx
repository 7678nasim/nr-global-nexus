import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/lib/site";

const CaseStudies = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/case-studies").then(r => setItems(r.data)).catch(() => {}); }, []);
  return (
    <div data-testid="case-studies-page">
      <section className="pt-36 pb-12 bg-white">
        <div className="nx-container">
          <p className="nx-pill">Case Studies</p>
          <h1 className="font-display text-5xl md:text-7xl mt-5 max-w-4xl tracking-tight text-[#0A192F]">Outcomes, not promises.</h1>
          <p className="text-[#0A192F]/70 mt-5 max-w-2xl">Real engagements. Measurable ROI. A glimpse into how we operate alongside our clients.</p>
        </div>
      </section>
      <section className="pb-24">
        <div className="nx-container space-y-6">
          {items.map((cs, i) => (
            <div key={cs.id} data-testid={`case-study-${cs.id}`} className={`nx-card rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 ${i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}>
              <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto overflow-hidden">
                <img src={cs.image} alt={cs.client} className="w-full h-full object-cover" />
              </div>
              <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-[#0A192F]/55">
                  <span>{cs.industry}</span>·<span>{cs.service}</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl mt-3 text-[#0A192F] tracking-tight">{cs.client}</h2>
                <p className="text-[#0A192F]/75 mt-4">{cs.result}</p>
                <div className="mt-6 inline-flex items-end gap-4">
                  <div className="nx-stat-num text-5xl text-[#0A58CA]">{cs.metric}</div>
                  <p className="text-xs uppercase tracking-widest text-[#0A192F]/55 pb-1.5">{cs.metric_label}</p>
                </div>
                <Link to="/contact?form=proposal" className="text-sm text-[#0A58CA] inline-flex items-center gap-1 font-medium mt-6">Replicate this for your team <ArrowUpRight size={14}/></Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default CaseStudies;
