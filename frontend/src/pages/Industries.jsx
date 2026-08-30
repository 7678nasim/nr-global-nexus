import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { INDUSTRIES } from "@/lib/site";
import * as Icons from "lucide-react";

const IMG = {
  Healthcare: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80",
  Ayurveda: "https://images.unsplash.com/photo-1611073615452-04dba8af1d35?w=800&q=80",
  Education: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
  "Real Estate": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  "E-Commerce": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
  Finance: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  Banking: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80",
  Insurance: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
  "IT & Technology": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  Logistics: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80",
  Telecommunications: "https://images.unsplash.com/photo-1611784728558-6a7645e72a04?w=800&q=80",
  Startups: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
  SMEs: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
  Agencies: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
  "Professional Services": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
};

const Industries = () => (
  <div data-testid="industries-page">
    <section className="pt-36 pb-16 bg-white">
      <div className="nx-container">
        <p className="nx-pill">Industries Served</p>
        <h1 className="font-display text-5xl md:text-7xl mt-5 max-w-4xl tracking-tight text-[#0A192F]">
          Tailored playbooks across <span className="text-[#0A58CA]">15+ high-velocity industries.</span>
        </h1>
        <p className="text-[#0A192F]/70 mt-5 max-w-2xl">From healthcare and Ayurveda to fintech and telecom — every vertical gets a delivery model tuned to its regulations, cycle and customer.</p>
      </div>
    </section>

    <section className="pb-24">
      <div className="nx-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {INDUSTRIES.map((ind) => {
          const I = Icons[ind.icon] || Icons.Sparkles;
          const slug = ind.name.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/g, "");
          return (
            <div key={ind.name} data-testid={`industry-card-${slug}`} className="nx-card rounded-xl overflow-hidden">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={IMG[ind.name]} alt={ind.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-[#0A58CA]/8 text-[#0A58CA] flex items-center justify-center"><I size={16}/></div>
                  <h3 className="font-display text-xl text-[#0A192F]">{ind.name}</h3>
                </div>
                <p className="text-sm text-[#0A192F]/65 mt-3">{ind.desc}</p>
                <Link to={`/contact?form=proposal&industry=${encodeURIComponent(ind.name)}`} className="text-sm text-[#0A58CA] mt-4 inline-flex items-center gap-1 font-medium">Discuss your scope <ArrowRight size={14}/></Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  </div>
);
export default Industries;
