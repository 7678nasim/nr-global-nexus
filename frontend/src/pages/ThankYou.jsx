import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, MessageCircle, Calendar, Mail } from "lucide-react";
import { CONTACT } from "@/lib/site";

const ThankYou = () => {
  useEffect(() => {
    document.title = "Thank You — NR Global Nexus";
  }, []);

  return (
    <div data-testid="thank-you-page" className="min-h-[80vh] flex items-center pt-32 pb-24 bg-white">
      <div className="nx-container max-w-3xl text-center">
        <div className="w-20 h-20 rounded-full bg-[#0A58CA]/10 text-[#0A58CA] flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="font-display text-4xl md:text-6xl tracking-tight text-[#0A192F] mt-8">Thank you. Your inquiry is in.</h1>
        <p className="text-[#0A192F]/70 text-base md:text-lg mt-5 max-w-2xl mx-auto">
          A senior consultant from NR Global Nexus will reach out within <strong>24 hours</strong> with a tailored plan. Meanwhile, here's how you can get faster help.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 text-left">
          <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="nx-card rounded-xl p-6">
            <MessageCircle size={20} className="text-[#25D366]" />
            <h3 className="font-display text-lg mt-3 text-[#0A192F]">WhatsApp us</h3>
            <p className="text-sm text-[#0A192F]/65 mt-1">Fastest channel — we respond in minutes.</p>
            <span className="text-sm text-[#0A58CA] mt-3 inline-flex items-center gap-1">{CONTACT.whatsappDisplay} <ArrowRight size={13}/></span>
          </a>
          <a href={`mailto:${CONTACT.emails.sales}`} className="nx-card rounded-xl p-6">
            <Mail size={20} className="text-[#0A58CA]" />
            <h3 className="font-display text-lg mt-3 text-[#0A192F]">Email sales</h3>
            <p className="text-sm text-[#0A192F]/65 mt-1">Share docs, scope or specs directly.</p>
            <span className="text-sm text-[#0A58CA] mt-3 inline-flex items-center gap-1">{CONTACT.emails.sales} <ArrowRight size={13}/></span>
          </a>
          <Link to="/contact?form=consultation" className="nx-card rounded-xl p-6">
            <Calendar size={20} className="text-[#0A58CA]" />
            <h3 className="font-display text-lg mt-3 text-[#0A192F]">Book a 30-min call</h3>
            <p className="text-sm text-[#0A192F]/65 mt-1">Walk through your scope with our team.</p>
            <span className="text-sm text-[#0A58CA] mt-3 inline-flex items-center gap-1">Schedule consultation <ArrowRight size={13}/></span>
          </Link>
        </div>

        <div className="mt-14">
          <Link to="/" className="text-sm text-[#0A192F]/60 hover:text-[#0A192F] underline">Back to home</Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
