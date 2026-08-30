import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CheckCircle2, Sparkles, Globe, ShieldCheck, Star, Quote } from "lucide-react";
import { api, CONTACT, HOMEPAGE_SERVICES, INDUSTRIES, WHY_US, PROCESS } from "@/lib/site";
import * as Icons from "lucide-react";
import TrustSection from "@/components/TrustSection";
import ClientLogos from "@/components/ClientLogos";
import { useSEO } from "@/lib/seo";

const SERVICE_BG = "https://images.unsplash.com/photo-1582647509711-c8aa8a8bda71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBnbGFzcyUyMG9mZmljZSUyMHNreXNjcmFwZXIlMjBibHVlfGVufDB8fHx8MTc4MTI5MjY5Mnww&ixlib=rb-4.1.0&q=85";

const Home = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  useSEO({
    title: "NR Global Nexus | BPO Outsourcing, Recruitment, Digital Marketing & Business Consulting",
    description: "Premium BPO, Project Outsourcing, Recruitment, Lead Generation, Digital Marketing & Business Consulting — engineered to scale ambitious businesses globally.",
    path: "/",
  });
  useEffect(() => {
    api.get("/testimonials").then((r) => setTestimonials(r.data)).catch(() => {});
    api.get("/case-studies").then((r) => setCaseStudies(r.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={SERVICE_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A192F]/95 via-[#0A192F]/85 to-[#0A58CA]/70" />
          <div className="absolute inset-0 nx-dot-bg opacity-30" />
        </div>
        <div className="nx-container relative">
          <span className="nx-pill nx-pill-light"><Sparkles size={13}/> Business Growth Partner · Since {CONTACT.founded}</span>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <h1 className="font-display text-white text-[42px] sm:text-5xl lg:text-[72px] leading-[1.02] tracking-tight">
                Empowering Businesses Through<br />
                <span className="text-[#7FB3FF]">Outsourcing, Sales</span> & <span className="italic font-medium">Growth Solutions</span>.
              </h1>
              <p className="text-white/75 mt-6 text-base md:text-lg max-w-2xl">
                NR Global Nexus helps businesses scale faster through BPO services, project outsourcing, recruitment, lead generation, digital marketing, staffing solutions and strategic business consulting.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/contact?form=proposal" data-testid="hero-request-proposal" className="nx-btn-primary px-6 py-3.5 rounded-md text-sm font-medium inline-flex items-center gap-2">
                  Request a Proposal <ArrowRight size={15}/>
                </Link>
                <Link to="/contact?form=consultation" data-testid="hero-book-consultation" className="px-6 py-3.5 rounded-md text-sm font-medium border border-white/30 text-white hover:bg-white hover:text-[#0A192F] transition-colors inline-flex items-center gap-2">
                  Book a Consultation <ArrowUpRight size={15}/>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/70">
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#7FB3FF]"/> 24/7 Global Delivery</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#7FB3FF]"/> NDA & Data Confidentiality</span>
                <span className="inline-flex items-center gap-1.5"><Globe size={14} className="text-[#7FB3FF]"/> Multi-geo Workforce</span>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-xl p-5">
                <p className="text-[11px] uppercase tracking-widest text-white/60">Trusted across</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-white">
                  {["Healthcare", "Ayurveda", "E-Commerce", "Finance", "Real Estate", "EdTech"].map(t => (
                    <div key={t} className="text-sm border border-white/10 rounded-md px-3 py-2 bg-white/5">{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 border-t border-white/10 pt-10">
            {[
              { v: "100", s: "+", l: "Business Partners" },
              { v: "500", s: "+", l: "Professionals Network" },
              { v: "1000", s: "+", l: "Successful Projects" },
              { v: "24", s: "/7", l: "Global Support" },
            ].map((x) => (
              <div key={x.l} data-testid={`hero-stat-${x.l.toLowerCase().replace(/\s/g, "-")}`}>
                <div className="nx-stat-num text-4xl md:text-5xl text-white">{x.v}<span className="text-[#7FB3FF]">{x.s}</span></div>
                <p className="text-[11px] uppercase tracking-widest text-white/60 mt-2">{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT LOGOS */}
      <ClientLogos />

      {/* SERVICES — priority 6 */}
      <section className="py-24 md:py-32 bg-white">
        <div className="nx-container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end mb-14">
            <div className="md:col-span-7">
              <p className="nx-pill">Core Services</p>
              <h2 className="font-display text-4xl md:text-5xl mt-4 tracking-tight text-[#0A192F]">
                Six business growth engines, <span className="text-[#0A58CA]">one accountable partner.</span>
              </h2>
            </div>
            <p className="md:col-span-5 text-[#0A192F]/70 text-base">
              From front-line BPO operations to growth marketing and consulting — every engagement is structured around your KPIs and shipped by dedicated pods.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOMEPAGE_SERVICES.map((s, i) => {
              const I = Icons[s.icon] || Icons.Sparkles;
              return (
                <Link to={`/services#${s.slug}`} key={s.slug} data-testid={`service-card-${s.slug}`} className="nx-card rounded-xl p-7 group block">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-lg bg-[#0A58CA]/8 text-[#0A58CA] flex items-center justify-center"><I size={20} /></div>
                    <span className="text-xs text-[#0A192F]/40 font-mono">0{i + 1}</span>
                  </div>
                  <h3 className="font-display text-2xl mt-5 text-[#0A192F]">{s.title}</h3>
                  <p className="text-sm text-[#0A192F]/65 mt-2">{s.tagline}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {s.items.slice(0, 3).map((it) => (
                      <span key={it} className="text-[11px] px-2 py-1 rounded-full border border-[var(--nx-line)] text-[#0A192F]/70">{it}</span>
                    ))}
                  </div>
                  <span className="mt-6 text-sm text-[#0A58CA] inline-flex items-center gap-1 font-medium group-hover:gap-2 transition-all">Explore <ArrowRight size={14}/></span>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link to="/services" data-testid="home-all-services" className="nx-btn-ghost inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium">
              See all 8 services <ArrowRight size={14}/>
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 md:py-32 bg-[#F8F9FA]">
        <div className="nx-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-6">
              <p className="nx-pill">Our Process</p>
              <h2 className="font-display text-4xl md:text-5xl mt-4 tracking-tight text-[#0A192F]">A 7-step playbook<br/>built for scale.</h2>
            </div>
            <p className="lg:col-span-6 text-[#0A192F]/65 self-end">Every engagement follows a structured methodology — from discovery to ongoing optimisation — so outcomes are predictable, not lucky.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS.map((p, i) => (
              <div key={p.num} data-testid={`process-${p.num}`} className={`relative nx-card rounded-xl p-7 ${i === 3 ? "lg:col-span-1" : ""}`}>
                <span className="font-mono text-xs text-[#0A58CA]">{p.num}</span>
                <h3 className="font-display text-lg mt-3 text-[#0A192F]">{p.title}</h3>
                <p className="text-sm text-[#0A192F]/65 mt-2 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES BENTO */}
      <section className="py-24 md:py-32 bg-white">
        <div className="nx-container">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <p className="nx-pill">Industries Served</p>
              <h2 className="font-display text-4xl md:text-5xl mt-4 tracking-tight text-[#0A192F]">Tailored playbooks across<br/>15+ verticals.</h2>
            </div>
            <Link to="/industries" className="text-sm font-medium text-[#0A58CA] inline-flex items-center gap-1">All industries <ArrowRight size={14}/></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-[var(--nx-line)] border border-[var(--nx-line)] rounded-xl overflow-hidden">
            {INDUSTRIES.slice(0, 10).map((ind) => {
              const I = Icons[ind.icon] || Icons.Sparkles;
              return (
                <div key={ind.name} data-testid={`industry-${ind.name.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/g, "")}`} className="bg-white p-6 hover:bg-[#0A58CA] group transition-colors">
                  <I size={20} className="text-[#0A58CA] group-hover:text-white transition-colors" />
                  <h3 className="font-display text-base mt-3 text-[#0A192F] group-hover:text-white">{ind.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 md:py-32 bg-[#0A192F] text-white relative overflow-hidden">
        <div className="absolute inset-0 nx-dot-bg opacity-30" />
        <div className="nx-container relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-6">
              <p className="nx-pill nx-pill-light">Why NR Global Nexus</p>
              <h2 className="font-display text-4xl md:text-5xl mt-4 tracking-tight">An operating partner — not a vendor.</h2>
            </div>
            <p className="lg:col-span-6 text-white/70 self-end">
              We win when you win. Every engagement is structured around your KPIs, with transparent reporting and a single accountable partner from day one.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_US.map((w, i) => {
              const I = Icons[w.icon] || Icons.ShieldCheck;
              return (
                <div key={w.title} data-testid={`why-${i}`} className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl p-6 transition-colors">
                  <I size={20} className="text-[#7FB3FF]" />
                  <h3 className="font-display text-lg mt-3">{w.title}</h3>
                  <p className="text-sm text-white/65 mt-2">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <TrustSection />

      {/* CASE STUDIES */}
      <section className="py-24 md:py-32 bg-white">
        <div className="nx-container">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <p className="nx-pill">Case Studies</p>
              <h2 className="font-display text-4xl md:text-5xl mt-4 tracking-tight text-[#0A192F]">Results we've shipped<br/>for ambitious teams.</h2>
            </div>
            <Link to="/case-studies" className="text-sm font-medium text-[#0A58CA] inline-flex items-center gap-1">View all <ArrowRight size={14}/></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.slice(0, 4).map((cs) => (
              <div key={cs.id} data-testid={`case-${cs.id}`} className="nx-card rounded-xl overflow-hidden">
                <div className="aspect-[16/8] overflow-hidden">
                  <img src={cs.image} alt={cs.client} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-2 text-xs text-[#0A192F]/60">
                    <span>{cs.industry}</span>·<span>{cs.service}</span>
                  </div>
                  <h3 className="font-display text-2xl mt-3 text-[#0A192F]">{cs.client}</h3>
                  <p className="text-sm text-[#0A192F]/70 mt-2">{cs.result}</p>
                  <div className="mt-5 flex items-end justify-between border-t border-[var(--nx-line)] pt-5">
                    <div>
                      <div className="nx-stat-num text-4xl text-[#0A58CA]">{cs.metric}</div>
                      <p className="text-[11px] uppercase tracking-widest text-[#0A192F]/55 mt-1">{cs.metric_label}</p>
                    </div>
                    <ArrowUpRight size={20} className="text-[#0A192F]/40" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32 bg-[#F8F9FA]">
        <div className="nx-container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="nx-pill mx-auto">Testimonials</p>
            <h2 className="font-display text-4xl md:text-5xl mt-4 tracking-tight text-[#0A192F]">Operators talk to operators.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((t, i) => (
              <div key={i} data-testid={`testimonial-${i}`} className="nx-card rounded-xl p-7">
                <Quote size={20} className="text-[#0A58CA]" />
                <p className="text-sm text-[#0A192F]/80 mt-4 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center justify-between border-t border-[var(--nx-line)] pt-4">
                  <div>
                    <p className="text-sm font-medium text-[#0A192F]">{t.name}</p>
                    <p className="text-xs text-[#0A192F]/55">{t.role}, {t.company}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={12} fill="#FACC15" stroke="#FACC15"/>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-28 bg-white">
        <div className="nx-container">
          <div className="rounded-2xl overflow-hidden relative p-10 md:p-16 bg-[#0A192F] text-white">
            <div className="absolute inset-0 nx-dot-bg opacity-30" />
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8">
                <h3 className="font-display text-3xl md:text-5xl tracking-tight">Let's scale your operations — <span className="text-[#7FB3FF]">together.</span></h3>
                <p className="text-white/70 mt-4 max-w-xl">Tell us what you're solving for. We'll come back with a tailored outsourcing, sales or growth plan within 24 hours.</p>
              </div>
              <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                <Link to="/contact?form=proposal" className="nx-btn-primary px-6 py-3.5 rounded-md text-sm font-medium inline-flex items-center gap-2">Request a Proposal <ArrowRight size={15}/></Link>
                <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="px-6 py-3.5 rounded-md text-sm font-medium border border-white/30 text-white hover:bg-white hover:text-[#0A192F] transition-colors">WhatsApp Us</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
