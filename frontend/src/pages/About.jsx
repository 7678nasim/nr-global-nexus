import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Compass, Award, TrendingUp, MapPin, Calendar, Users } from "lucide-react";
import { CONTACT } from "@/lib/site";

const About = () => (
  <div data-testid="about-page">
    <section className="pt-36 pb-20 bg-white">
      <div className="nx-container">
        <p className="nx-pill">About Us</p>
        <h1 className="font-display text-5xl md:text-7xl tracking-tight mt-5 max-w-4xl text-[#0A192F]">
          A long-term <span className="text-[#0A58CA]">business growth partner</span> for ambitious teams.
        </h1>
        <p className="text-lg text-[#0A192F]/70 mt-6 max-w-3xl">
          Founded in {CONTACT.founded} by <strong className="text-[#0A192F]">{CONTACT.founders.join(" and ")}</strong>, NR Global Nexus was established with one purpose — to help businesses reduce operational burden, improve customer engagement, increase sales, build efficient teams, and achieve sustainable growth through outsourcing and business support services.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#0A192F]/70">
          <span className="inline-flex items-center gap-2"><Calendar size={15} className="text-[#0A58CA]"/> Founded {CONTACT.founded}</span>
          <span className="inline-flex items-center gap-2"><Users size={15} className="text-[#0A58CA]"/> 500+ Professionals Network</span>
          <span className="inline-flex items-center gap-2"><MapPin size={15} className="text-[#0A58CA]"/> Headquartered in Siliguri, India</span>
        </div>
      </div>
    </section>

    <section className="py-20 bg-[#F8F9FA]">
      <div className="nx-container grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6">
          <img src="https://images.pexels.com/photos/12903168/pexels-photo-12903168.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="Team" className="rounded-2xl w-full h-full object-cover" />
        </div>
        <div className="lg:col-span-6 grid grid-cols-1 gap-5">
          {[
            { Icon: Compass, title: "Our Vision", body: "To become a globally trusted business growth partner — connecting organisations with scalable outsourcing, talent, technology and business expansion solutions." },
            { Icon: Target, title: "Our Mission", body: "Help businesses achieve sustainable growth through reliable outsourcing, workforce solutions, innovative sales strategies and operational excellence." },
            { Icon: Award, title: "Who We Serve", body: "Startups, SMEs, agencies, healthcare organisations, educational institutions, e-commerce brands, real estate companies, Ayurveda businesses, and growing enterprises across 15+ industries." },
            { Icon: TrendingUp, title: "Our Growth Story", body: "From a focused outsourcing studio in Siliguri to a multi-service business growth partner — 1,000+ successful projects, 500+ professionals network, and clients across 12+ countries." },
          ].map((b) => (
            <div key={b.title} data-testid={`about-${b.title.toLowerCase().replace(/\s/g, "-")}`} className="nx-card rounded-xl p-7">
              <b.Icon size={20} className="text-[#0A58CA]" />
              <h3 className="font-display text-2xl mt-3 text-[#0A192F]">{b.title}</h3>
              <p className="text-sm text-[#0A192F]/70 mt-2">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 bg-white">
      <div className="nx-container">
        <p className="nx-pill">Founders</p>
        <h2 className="font-display text-4xl md:text-5xl mt-4 tracking-tight text-[#0A192F] max-w-3xl">Operators who've scaled support, sales and hiring at the front-line.</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {CONTACT.founders.map((f) => (
            <div key={f} data-testid={`founder-${f.split(" ")[0].toLowerCase()}`} className="nx-card rounded-2xl p-8 flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-[#0A192F] text-white flex items-center justify-center font-display text-xl">
                {f.split(" ").map((p) => p[0]).join("")}
              </div>
              <div>
                <h3 className="font-display text-2xl text-[#0A192F]">{f}</h3>
                <p className="text-xs uppercase tracking-widest text-[#0A192F]/55 mt-1">Co-Founder · NR Global Nexus</p>
                <p className="text-sm text-[#0A192F]/70 mt-3">Brings hands-on experience across BPO operations, sales acceleration, recruitment and consulting — built around a single belief: outsourcing should compound your business, not dilute it.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 bg-[#0A192F] text-white relative overflow-hidden">
      <div className="absolute inset-0 nx-dot-bg opacity-30"/>
      <div className="nx-container relative text-center">
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">A global approach. Local delivery.</h2>
        <p className="mt-4 text-white/65 max-w-2xl mx-auto">From our delivery hub in Siliguri to remote pods across India, ME and SEA — we operate where our clients need us most.</p>
        <Link to="/contact?form=consultation" className="nx-btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-medium mt-8">Talk to our team <ArrowRight size={15}/></Link>
      </div>
    </section>
  </div>
);
export default About;
