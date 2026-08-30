import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, MessageCircle, ArrowRight, Send } from "lucide-react";
import { api, CONTACT, SERVICES, FAQS } from "@/lib/site";
import { toast } from "sonner";

const FORMS = [
  { key: "proposal", label: "Request a Proposal" },
  { key: "project_inquiry", label: "Project Inquiry" },
  { key: "recruitment", label: "Recruitment Inquiry" },
  { key: "partnership", label: "Partnership" },
  { key: "consultation", label: "Schedule a Consultation" },
];

const BUDGETS = [
  "< $1,000 / month",
  "$1,000 – $5,000 / month",
  "$5,000 – $15,000 / month",
  "$15,000 – $50,000 / month",
  "$50,000+ / month",
  "Project-based / One-time",
];

const Contact = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initial = FORMS.find(f => f.key === params.get("form")) ? params.get("form") : "proposal";
  const [tab, setTab] = useState(initial);
  const [form, setForm] = useState({
    name: "", company: "", designation: "", email: "", phone: "",
    country: "", industry: params.get("industry") || "",
    service: params.get("service") || "", monthly_budget: "", requirements: "",
  });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => { setTab(initial); }, [initial]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leads", { ...form, form_type: tab });
      toast.success("Thanks! Our team will reach out within 24 hours.");
      setForm({ name: "", company: "", designation: "", email: "", phone: "", country: "", industry: "", service: "", monthly_budget: "", requirements: "" });
    } catch (err) { toast.error("Submission failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div data-testid="contact-page">
      <section className="pt-36 pb-12 bg-white">
        <div className="nx-container">
          <p className="nx-pill">Contact</p>
          <h1 className="font-display text-5xl md:text-7xl mt-5 max-w-4xl tracking-tight text-[#0A192F]">Let's build <span className="text-[#0A58CA]">something measurable.</span></h1>
          <p className="text-[#0A192F]/70 mt-5 max-w-2xl">Pick the form that fits — proposal, project, recruitment, partnership or a quick consultation. We typically reply within 24 hours.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="nx-container grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap gap-2 mb-5">
              {FORMS.map((f) => (
                <button key={f.key} type="button" onClick={() => setTab(f.key)} data-testid={`form-tab-${f.key}`} className={`px-4 py-2 rounded-full text-sm border transition-colors ${tab === f.key ? "bg-[#0A192F] text-white border-[#0A192F]" : "border-[var(--nx-line)] text-[#0A192F] hover:border-[#0A58CA]/50"}`}>
                  {f.label}
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="nx-card rounded-2xl p-7 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="contact-form">
              {[
                { k: "name", l: "Full Name", t: "text", req: true },
                { k: "company", l: "Company Name", t: "text" },
                { k: "designation", l: "Designation", t: "text" },
                { k: "email", l: "Email Address", t: "email", req: true },
                { k: "phone", l: "Mobile Number", t: "tel", req: true },
                { k: "country", l: "Country", t: "text" },
              ].map(({ k, l, t, req }) => (
                <label key={k} className="text-xs uppercase tracking-widest text-[#0A192F]/60">
                  {l}{req && " *"}
                  <input required={req} type={t} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} data-testid={`contact-${k}`} className="mt-1.5 w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none normal-case tracking-normal text-[#0A192F]" />
                </label>
              ))}
              <label className="text-xs uppercase tracking-widest text-[#0A192F]/60">
                Industry
                <input type="text" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} data-testid="contact-industry" placeholder="e.g. Healthcare, Ayurveda, E-Commerce" className="mt-1.5 w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none normal-case tracking-normal text-[#0A192F]" />
              </label>
              <label className="text-xs uppercase tracking-widest text-[#0A192F]/60">
                Service Required
                <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} data-testid="contact-service" className="mt-1.5 w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none normal-case tracking-normal text-[#0A192F] bg-white">
                  <option value="">Select a service</option>
                  {SERVICES.map(s => <option key={s.slug} value={s.title}>{s.title}</option>)}
                  <option value="Other / Not sure">Other / Not sure</option>
                </select>
              </label>
              <label className="text-xs uppercase tracking-widest text-[#0A192F]/60 md:col-span-2">
                Monthly Budget
                <select value={form.monthly_budget} onChange={(e) => setForm({ ...form, monthly_budget: e.target.value })} data-testid="contact-budget" className="mt-1.5 w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none normal-case tracking-normal text-[#0A192F] bg-white">
                  <option value="">Select a budget range</option>
                  {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </label>
              <label className="text-xs uppercase tracking-widest text-[#0A192F]/60 md:col-span-2">
                Project Description *
                <textarea required rows={5} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} data-testid="contact-requirements" placeholder="Tell us what you're solving for, target outcomes, team size or ramp expectations." className="mt-1.5 w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none normal-case tracking-normal text-[#0A192F]" />
              </label>
              <div className="md:col-span-2 flex items-center justify-between flex-wrap gap-3">
                <p className="text-[11px] text-[#0A192F]/50 max-w-md">By submitting, you agree to be contacted by NR Global Nexus regarding your inquiry. Your data is kept confidential under our NDA-aligned policies.</p>
                <button type="submit" disabled={loading} data-testid="contact-submit" className="nx-btn-primary px-6 py-3 rounded-md text-sm font-medium inline-flex items-center gap-2">
                  {loading ? "Sending…" : "Send Inquiry"} <Send size={14}/>
                </button>
              </div>
            </form>
          </div>

          <aside className="lg:col-span-4 space-y-4">
            <div className="nx-card rounded-2xl p-6">
              <h3 className="font-display text-xl text-[#0A192F]">Reach us directly</h3>
              <ul className="mt-4 space-y-3 text-sm text-[#0A192F]/80">
                <li className="flex items-start gap-2">
                  <MapPin size={15} className="mt-0.5 text-[#0A58CA] shrink-0"/>
                  <span>{CONTACT.addressLines.map((l, i) => <span key={i} className="block">{l}</span>)}</span>
                </li>
                <li className="flex items-start gap-2"><Phone size={15} className="mt-0.5 text-[#0A58CA]"/><a href={`tel:${CONTACT.phone}`}>{CONTACT.whatsappDisplay}</a></li>
                <li className="flex items-start gap-2"><Mail size={15} className="mt-0.5 text-[#0A58CA]"/>
                  <span className="flex flex-col">
                    <a href={`mailto:${CONTACT.emails.info}`}>{CONTACT.emails.info}</a>
                    <a href={`mailto:${CONTACT.emails.sales}`}>{CONTACT.emails.sales}</a>
                    <a href={`mailto:${CONTACT.emails.hr}`}>{CONTACT.emails.hr}</a>
                  </span>
                </li>
                <li className="flex items-start gap-2"><Clock size={15} className="mt-0.5 text-[#0A58CA]"/>{CONTACT.hours}</li>
              </ul>
              <div className="grid grid-cols-2 gap-2 mt-5">
                <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" data-testid="contact-whatsapp" className="px-3 py-2.5 rounded-md text-xs font-medium bg-[#25D366] text-white inline-flex items-center justify-center gap-1.5"><MessageCircle size={13}/> WhatsApp</a>
                <a href={`tel:${CONTACT.phone}`} className="px-3 py-2.5 rounded-md text-xs font-medium border border-[var(--nx-line)] text-[#0A192F] inline-flex items-center justify-center gap-1.5"><Phone size={13}/> Call</a>
              </div>
            </div>

            <div className="nx-card rounded-2xl overflow-hidden">
              <iframe
                title="map"
                src="https://www.google.com/maps?q=Nazrul+Sarani,Hakimpara,Siliguri,West+Bengal+734001&output=embed"
                className="w-full h-64 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                data-testid="google-map"
              />
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24">
        <div className="nx-container">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="nx-pill">FAQ</p>
              <h2 className="font-display text-4xl md:text-5xl mt-3 tracking-tight text-[#0A192F]">15 quick answers.</h2>
            </div>
          </div>
          <div className="space-y-2">
            {FAQS.map((f, i) => (
              <div key={i} className="nx-card rounded-xl">
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} data-testid={`faq-${i}`} className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                  <span className="font-display text-base md:text-lg text-[#0A192F]">{f.q}</span>
                  <ArrowRight size={16} className={`transition-transform shrink-0 ${openFaq === i ? "rotate-90 text-[#0A58CA]" : "text-[#0A192F]/40"}`} />
                </button>
                {openFaq === i && <div className="px-6 pb-5 text-sm text-[#0A192F]/75">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Contact;
