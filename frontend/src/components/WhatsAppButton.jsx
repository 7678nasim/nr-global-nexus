import React from "react";
import { CONTACT } from "@/lib/site";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const num = CONTACT.whatsapp.replace(/[^0-9]/g, "");
  const url = `https://wa.me/${num}?text=${encodeURIComponent("Hi NR Global Nexus, I'd like to learn more about your services.")}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      data-testid="floating-whatsapp"
      className="fixed bottom-6 left-6 z-40 group"
      aria-label="WhatsApp NR Global Nexus"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
      <span className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebd5d] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 transition-transform group-hover:scale-105">
        <MessageCircle size={22} />
      </span>
    </a>
  );
};

export default WhatsAppButton;
