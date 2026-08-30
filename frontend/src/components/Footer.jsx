import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Linkedin, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import Logo from "@/components/Logo";
import { CONTACT, SERVICES } from "@/lib/site";
import { api } from "@/lib/site";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post("/newsletter", { email });
      toast.success("You're subscribed. Welcome aboard!");
      setEmail("");
    } catch (err) {
      toast.error("Could not subscribe. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer data-testid="site-footer" className="relative bg-[#0A192F] text-white pt-20 pb-10 mt-32 overflow-hidden">
      <div className="absolute inset-0 nx-dot-bg opacity-30" />
      <div className="nx-container relative">
        {/* Newsletter band */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-14 border-b border-white/10">
          <div>
            <p className="nx-pill nx-pill-light">Newsletter</p>
            <h3 className="font-display text-3xl md:text-4xl mt-4 tracking-tight">
              Get sharp, no-fluff insights on outsourcing, sales & growth.
            </h3>
            <p className="text-white/70 mt-3 max-w-md text-sm">Monthly playbooks from operators who've scaled support, sales and hiring across 1,000+ projects.</p>
          </div>
          <form onSubmit={subscribe} className="flex items-end gap-3 lg:justify-end" data-testid="newsletter-form">
            <div className="flex-1 max-w-md">
              <label className="text-xs uppercase tracking-widest text-white/50">Work email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                data-testid="newsletter-email"
                className="mt-1.5 w-full bg-transparent border-b border-white/30 focus:border-white py-2 outline-none text-base placeholder:text-white/40"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              data-testid="newsletter-submit"
              className="nx-btn-primary px-5 py-2.5 rounded-md text-sm font-medium inline-flex items-center gap-2"
            >
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-14">
          <div className="col-span-2">
            <Logo variant="light" />
            <p className="text-white/70 text-sm mt-4 max-w-sm">
              Premium BPO, Project Outsourcing, Recruitment, Lead Generation, Digital Marketing & Business Consulting — engineered to scale ambitious businesses globally.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { Icon: Linkedin, href: CONTACT.socials.linkedin, label: "linkedin" },
                { Icon: Facebook, href: CONTACT.socials.facebook, label: "facebook" },
                { Icon: Instagram, href: CONTACT.socials.instagram, label: "instagram" },
                { Icon: Twitter, href: CONTACT.socials.twitter, label: "x" },
                { Icon: Youtube, href: CONTACT.socials.youtube, label: "youtube" },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" data-testid={`social-${label}`}
                   className="w-9 h-9 rounded-full border border-white/15 hover:bg-white hover:text-[#0A192F] flex items-center justify-center transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Services</p>
            <ul className="space-y-2.5 text-sm text-white/80">
              {SERVICES.map((s) => (
                <li key={s.slug}><Link to={`/services#${s.slug}`} className="hover:text-white">{s.title}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Company</p>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/case-studies" className="hover:text-white">Case Studies</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link to="/partnership" className="hover:text-white">Partnership</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/contact?form=partnership" className="hover:text-white">Partnerships Inquiry</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Reach us</p>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" />
                <span>{CONTACT.addressLines.map((l, i) => <span key={i} className="block">{l}</span>)}</span>
              </li>
              <li className="flex items-start gap-2"><Phone size={15} className="mt-0.5 shrink-0" /><a href={`tel:${CONTACT.phone}`} className="hover:text-white">{CONTACT.whatsappDisplay}</a></li>
              <li className="flex items-start gap-2"><Mail size={15} className="mt-0.5 shrink-0" />
                <span className="flex flex-col">
                  <a href={`mailto:${CONTACT.emails.info}`} className="hover:text-white">{CONTACT.emails.info}</a>
                  <a href={`mailto:${CONTACT.emails.sales}`} className="hover:text-white">{CONTACT.emails.sales}</a>
                  <a href={`mailto:${CONTACT.emails.hr}`} className="hover:text-white">{CONTACT.emails.hr}</a>
                </span>
              </li>
              <li className="text-white/50 text-xs mt-2">{CONTACT.hours}</li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs text-white/55">
          <p>© {new Date().getFullYear()} NR Global Nexus. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13}/> SSL Secured</span>
            <span className="inline-flex items-center gap-1.5"><Lock size={13}/> GDPR-ready forms</span>
            <Link to="/contact" className="hover:text-white">Privacy</Link>
            <Link to="/contact" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
