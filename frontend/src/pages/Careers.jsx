import React, { useEffect, useState } from "react";
import { api } from "@/lib/site";
import { Upload, Briefcase, MapPin, Clock, Heart, Sparkles, GraduationCap, Globe2, BadgePercent, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useSEO } from "@/lib/seo";

const PERKS = [
  { Icon: Sparkles, t: "Meaningful Work", d: "Ship outcomes for clients across 15+ industries — never just tickets." },
  { Icon: GraduationCap, t: "Continuous Learning", d: "Weekly upskilling pods on BPO, sales, marketing and tech." },
  { Icon: Globe2, t: "Remote-Friendly", d: "Hybrid + remote roles across India and abroad." },
  { Icon: BadgePercent, t: "Performance Rewards", d: "Quarterly bonuses tied to client outcomes — not just hours." },
  { Icon: TrendingUp, t: "Fast Career Growth", d: "Lead a pod in 12 months. Run a vertical in 24." },
  { Icon: Heart, t: "People-First Culture", d: "Mental wellness, leaves and family-first leadership." },
];

const HIRING = [
  { step: "01", t: "Apply Online", d: "Submit your resume in under 2 minutes." },
  { step: "02", t: "HR Screening Call", d: "15-min chat to align role + expectations." },
  { step: "03", t: "Skill / Voice Round", d: "Role-specific assessment — voice, written, technical or sales." },
  { step: "04", t: "Manager Round", d: "Meet the hiring manager. Talk team, scope and growth." },
  { step: "05", t: "Offer & Onboarding", d: "Offer rolled out within 48 hrs. Onboarding starts on day-1 of the next batch." },
];

const FIELDS = [
  { k: "name", l: "Full Name", t: "text", req: true },
  { k: "phone", l: "Mobile Number", t: "tel", req: true },
  { k: "email", l: "Email Address", t: "email", req: true },
  { k: "current_location", l: "Current Location", t: "text" },
  { k: "qualification", l: "Qualification", t: "text" },
  { k: "experience", l: "Total Experience", t: "text" },
  { k: "current_salary", l: "Current Salary (LPA / Monthly)", t: "text" },
  { k: "expected_salary", l: "Expected Salary", t: "text" },
  { k: "preferred_role", l: "Preferred Role", t: "text" },
  { k: "position", l: "Position Applying For", t: "text", req: true },
];

const Careers = () => {
  const [openings, setOpenings] = useState([]);
  const [form, setForm] = useState(Object.fromEntries(FIELDS.map(f => [f.k, ""]).concat([["cover_letter", ""]])));
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useSEO({ title: "Careers | NR Global Nexus", description: "Join NR Global Nexus — 500+ specialists across BPO, sales, recruitment, marketing and tech. Remote and hybrid roles across India." });

  useEffect(() => { api.get("/careers/openings").then(r => setOpenings(r.data)).catch(() => {}); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("resume", file);
      await api.post("/careers/apply", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Application submitted. Our HR team will reach out soon!");
      setForm(Object.fromEntries(FIELDS.map(f => [f.k, ""]).concat([["cover_letter", ""]])));
      setFile(null);
    } catch (err) {
      toast.error("Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="careers-page">
      <section className="pt-36 pb-16 bg-[#0A192F] text-white relative overflow-hidden">
        <div className="absolute inset-0 nx-dot-bg opacity-30"/>
        <div className="nx-container relative">
          <p className="nx-pill nx-pill-light">Careers</p>
          <h1 className="font-display text-5xl md:text-7xl mt-5 max-w-4xl tracking-tight">Join the team scaling <span className="text-[#7FB3FF]">global businesses.</span></h1>
          <p className="text-white/70 mt-6 max-w-2xl">500+ specialists. 15+ industries. Remote and hybrid teams shipping outcomes for clients across continents.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="nx-container grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl text-[#0A192F]">Current openings</h2>
            <div className="mt-6 space-y-3">
              {openings.map((o) => (
                <div key={o.id} data-testid={`opening-${o.id}`} className="nx-card rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-display text-lg text-[#0A192F]">{o.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-[#0A192F]/60">
                      <span className="inline-flex items-center gap-1"><Briefcase size={12}/>{o.department}</span>
                      <span className="inline-flex items-center gap-1"><MapPin size={12}/>{o.location}</span>
                      <span className="inline-flex items-center gap-1"><Clock size={12}/>{o.type} · {o.experience}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => setForm(f => ({ ...f, position: o.title }))} className="nx-btn-primary px-4 py-2 rounded-md text-sm">Apply</button>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="lg:col-span-5 nx-card rounded-xl p-7 sticky top-24 self-start" data-testid="careers-form">
            <h3 className="font-display text-2xl text-[#0A192F]">Submit your application</h3>
            <p className="text-sm text-[#0A192F]/60 mt-1">We review every application — promise.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
              {FIELDS.map(({ k, l, t, req }) => (
                <label key={k} className={`text-[11px] uppercase tracking-widest text-[#0A192F]/60 ${k === "name" || k === "position" ? "md:col-span-2" : ""}`}>
                  {l}{req && " *"}
                  <input
                    required={req}
                    type={t}
                    value={form[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    data-testid={`careers-${k}`}
                    className="mt-1.5 w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none normal-case tracking-normal text-[#0A192F]"
                  />
                </label>
              ))}
              <label className="text-[11px] uppercase tracking-widest text-[#0A192F]/60 md:col-span-2">
                Cover Letter
                <textarea rows={3} value={form.cover_letter} onChange={(e) => setForm({ ...form, cover_letter: e.target.value })} data-testid="careers-cover" className="mt-1.5 w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none normal-case tracking-normal text-[#0A192F]" />
              </label>
              <label className="md:col-span-2 border border-dashed border-[var(--nx-line)] rounded-md p-4 flex items-center gap-3 cursor-pointer hover:border-[#0A58CA]/50">
                <Upload size={16} className="text-[#0A58CA]" />
                <span className="text-sm text-[#0A192F]/75">{file ? file.name : "Upload Resume (PDF/DOCX · max 5MB)"}</span>
                <input type="file" hidden accept=".pdf,.doc,.docx" data-testid="careers-resume" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            <button type="submit" disabled={loading} data-testid="careers-submit" className="nx-btn-primary w-full mt-5 py-3 rounded-md text-sm font-medium">{loading ? "Submitting…" : "Submit Application"}</button>
            <p className="text-[11px] text-[#0A192F]/50 mt-2">By submitting, you agree to our NDA-aligned data processing policy.</p>
          </form>
        </div>
      </section>

      {/* WHY WORK WITH US */}
      <section className="py-24 bg-[#F8F9FA]" data-testid="why-work-section">
        <div className="nx-container">
          <p className="nx-pill">Why Work With Us</p>
          <h2 className="font-display text-4xl md:text-5xl mt-3 tracking-tight text-[#0A192F] max-w-3xl">Build a career, not just a job.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {PERKS.map((p, i) => (
              <div key={p.t} data-testid={`perk-${i}`} className="nx-card rounded-xl p-6">
                <p.Icon size={20} className="text-[#0A58CA]" />
                <h3 className="font-display text-lg mt-3 text-[#0A192F]">{p.t}</h3>
                <p className="text-sm text-[#0A192F]/65 mt-2">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIRING TIMELINE */}
      <section className="py-24 bg-white" data-testid="hiring-timeline">
        <div className="nx-container">
          <p className="nx-pill">Hiring Process</p>
          <h2 className="font-display text-4xl md:text-5xl mt-3 tracking-tight text-[#0A192F]">From "Apply" to Day-1 in under 2 weeks.</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-10">
            {HIRING.map((h, i) => (
              <div key={h.step} className="nx-card rounded-xl p-5">
                <span className="font-mono text-xs text-[#0A58CA]">{h.step}</span>
                <h3 className="font-display text-base mt-2 text-[#0A192F]">{h.t}</h3>
                <p className="text-xs text-[#0A192F]/65 mt-1.5 leading-relaxed">{h.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Careers;
