import { useEffect } from "react";
import { CONTACT } from "@/lib/site";

const setOrCreate = (selector, attrs, content) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith("meta") ? "meta" : (selector.startsWith("link") ? "link" : "script"));
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (content !== undefined) el.textContent = content;
  return el;
};

const setMeta = (name, content) => {
  if (!content) return;
  let el = document.head.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setProperty = (prop, content) => {
  if (!content) return;
  let el = document.head.querySelector(`meta[property="${prop}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", prop);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const upsertJsonLd = (id, json) => {
  let el = document.head.querySelector(`script[data-jsonld="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-jsonld", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
};

/**
 * Set page-level SEO + Open Graph + Twitter + canonical + optional JSON-LD.
 * Pass title, description, optional image, path, and jsonLd object/array.
 */
export const useSEO = ({ title, description, image, path, jsonLd } = {}) => {
  useEffect(() => {
    const fullTitle = title || "NR Global Nexus | BPO Outsourcing, Sales & Growth Solutions";
    const desc = description || "NR Global Nexus provides BPO outsourcing, recruitment, project outsourcing, sales outsourcing, digital marketing and business consulting services to help businesses scale globally.";
    const url = typeof window !== "undefined" ? window.location.origin + (path || window.location.pathname) : "";
    const og = image || "/brand/nr-logo-1200.png";

    document.title = fullTitle;
    setMeta("description", desc);
    setMeta("keywords", "BPO outsourcing company, call center services, project outsourcing, lead generation services, recruitment agency, staffing solutions, digital marketing agency, business consulting, customer support outsourcing, sales outsourcing, Ayurveda business consulting");

    setProperty("og:type", "website");
    setProperty("og:url", url);
    setProperty("og:title", fullTitle);
    setProperty("og:description", desc);
    setProperty("og:image", og.startsWith("http") ? og : (window.location.origin + og));
    setProperty("og:site_name", "NR Global Nexus");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", og.startsWith("http") ? og : (window.location.origin + og));

    setCanonical(url);

    if (jsonLd) {
      const arr = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      // clear existing page-scoped json-ld
      document.head.querySelectorAll('script[data-jsonld^="page-"]').forEach((n) => n.remove());
      arr.forEach((j, i) => upsertJsonLd(`page-${i}`, j));
    }
  }, [title, description, image, path, JSON.stringify(jsonLd || null)]);
};

/**
 * Inject the global Organization + LocalBusiness JSON-LD once.
 * Mount once near the app root.
 */
export const useGlobalSchema = () => {
  useEffect(() => {
    const org = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "NR Global Nexus",
      url: typeof window !== "undefined" ? window.location.origin : "https://nrglobalnexus.com",
      logo: typeof window !== "undefined" ? window.location.origin + "/brand/nr-logo-1200.png" : "/brand/nr-logo-1200.png",
      foundingDate: "2018",
      founders: CONTACT.founders.map((n) => ({ "@type": "Person", name: n })),
      contactPoint: [
        { "@type": "ContactPoint", telephone: CONTACT.whatsapp, contactType: "sales", areaServed: "IN", availableLanguage: ["en", "hi", "bn"] },
        { "@type": "ContactPoint", telephone: CONTACT.whatsapp, contactType: "customer support", areaServed: "IN" },
      ],
      sameAs: Object.values(CONTACT.socials),
    };
    const local = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "NR Global Nexus",
      image: typeof window !== "undefined" ? window.location.origin + "/brand/nr-logo-1200.png" : "/brand/nr-logo-1200.png",
      telephone: CONTACT.whatsapp,
      email: CONTACT.emails.info,
      address: {
        "@type": "PostalAddress",
        streetAddress: "28/1 Nazrul Sarani, Ashrampara",
        addressLocality: "Hakimpara, Siliguri",
        addressRegion: "West Bengal",
        postalCode: "734001",
        addressCountry: "IN",
      },
      areaServed: "Worldwide",
      priceRange: "$$",
      openingHours: "Mo-Sa 10:00-19:00",
    };
    upsertJsonLd("global-org", org);
    upsertJsonLd("global-local", local);
  }, []);
};

export default useSEO;
