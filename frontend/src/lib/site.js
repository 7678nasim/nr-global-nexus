import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, timeout: 30000 });

export const CONTACT = {
  brand: "NR Global Nexus",
  founded: 2018,
  founders: ["Nasim Khan", "Reshmi Saibya"],
  tagline: "Connecting Businesses. Accelerating Growth.",
  whatsapp: "+919933351374",
  whatsappDisplay: "+91 99333 51374",
  phone: "+919933351374",
  emails: {
    info: "info@nrglobalnexus.com",
    sales: "sales@nrglobalnexus.com",
    hr: "hr@nrglobalnexus.com",
  },
  addressLines: [
    "28/1 Nazrul Sarani, Ashrampara",
    "Hakimpara, Siliguri – 734001",
    "West Bengal, India",
  ],
  address: "28/1 Nazrul Sarani, Ashrampara, Hakimpara, Siliguri – 734001, West Bengal, India",
  hours: "Mon–Sat · 10:00 AM – 7:00 PM IST",
  socials: {
    linkedin: "https://linkedin.com/company/nrglobalnexus",
    facebook: "https://facebook.com/nrglobalnexus",
    instagram: "https://instagram.com/nrglobalnexus",
    twitter: "https://x.com/nrglobalnexus",
    youtube: "https://youtube.com/@nrglobalnexus",
  },
};

// Eight full services for the Services page
export const SERVICES = [
  {
    slug: "bpo-call-center",
    title: "BPO & Call Center Services",
    icon: "Headset",
    tagline: "24/7 voice operations engineered for outcomes.",
    description:
      "Inbound, outbound and blended call-center operations — built to lift CSAT, retention and revenue across every channel.",
    items: [
      "Inbound Customer Support",
      "Outbound Calling",
      "Telemarketing",
      "Telesales",
      "Customer Retention Campaigns",
      "Appointment Setting",
      "Customer Verification Services",
      "Customer Feedback Surveys",
    ],
  },
  {
    slug: "project-outsourcing",
    title: "Project Outsourcing Services",
    icon: "PackageCheck",
    tagline: "Voice, non-voice and back-office, delivered as a project.",
    description:
      "Outsource entire workflows or one-off projects — from voice campaigns to back-office processing — under fixed scopes and SLAs.",
    items: [
      "Voice Process Outsourcing",
      "Non-Voice Process Outsourcing",
      "Chat Support Services",
      "Email Support Services",
      "Data Entry & Data Processing",
      "Back Office Operations",
      "Business Process Outsourcing (BPO)",
      "White Label Outsourcing Solutions",
    ],
  },
  {
    slug: "lead-generation-sales",
    title: "Lead Generation & Sales Solutions",
    icon: "TrendingUp",
    tagline: "Predictable pipeline — every quarter.",
    description:
      "B2B and B2C lead generation, sales prospecting and outsourced SDRs that book qualified meetings and close them.",
    items: [
      "B2B Lead Generation",
      "B2C Lead Generation",
      "Sales Prospecting",
      "Appointment Booking",
      "Telemarketing Campaigns",
      "Customer Acquisition Support",
      "CRM Management & Follow-Up",
    ],
  },
  {
    slug: "recruitment-staffing",
    title: "Recruitment & Staffing Solutions",
    icon: "Users",
    tagline: "Hire smarter, faster, at scale.",
    description:
      "Bulk hiring, BPO and sales-team recruitment, virtual staffing and full Recruitment Process Outsourcing (RPO).",
    items: [
      "Bulk Hiring",
      "BPO Recruitment",
      "Sales Team Recruitment",
      "Virtual Staffing",
      "Remote Workforce Solutions",
      "Dedicated Resource Hiring",
      "Recruitment Process Outsourcing (RPO)",
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing Services",
    icon: "Megaphone",
    tagline: "Performance-driven growth marketing.",
    description:
      "Full-funnel SEO, paid media, content and reputation — assembled as one accountable growth pod.",
    items: [
      "Search Engine Optimization (SEO)",
      "Social Media Marketing",
      "Google Ads Management",
      "Meta Ads Management",
      "Lead Generation Campaigns",
      "Online Reputation Management",
      "Content Marketing",
    ],
  },
  {
    slug: "website-digital-solutions",
    title: "Website & Digital Solutions",
    icon: "Globe",
    tagline: "Web, e-commerce and CRM, end-to-end.",
    description:
      "Business and e-commerce websites, landing pages, business email and CRM integration — engineered for conversion and uptime.",
    items: [
      "Business Website Development",
      "E-Commerce Website Development",
      "Landing Page Development",
      "Business Email Setup",
      "Website Maintenance & Support",
      "CRM Integration Solutions",
    ],
  },
  {
    slug: "business-consulting",
    title: "Business Consulting & Setup",
    icon: "Briefcase",
    tagline: "Strategy that ships — not slideware.",
    description:
      "Call-center setup, sales-process design, CRM implementation, team training and full operations consulting for startups and scale-ups.",
    items: [
      "Call Center Setup Consultancy",
      "Sales Process Setup",
      "Customer Support Process Design",
      "Team Training & Development",
      "CRM Setup & Implementation",
      "Business Operations Consulting",
      "Startup Support Solutions",
    ],
  },
  {
    slug: "industry-specific",
    title: "Industry-Specific Solutions",
    icon: "Leaf",
    tagline: "Specialised playbooks. Ayurveda, distribution & beyond.",
    description:
      "Vertical-tuned consulting and setup — including Ayurveda business support, distributor and dealer network expansion, and franchise development.",
    items: [
      "Ayurvedic Business Setup Consultancy",
      "Ayurvedic Telemarketing Setup",
      "Ayurvedic Sales Team Setup",
      "Distributor & Franchise Development",
      "Dealer Network Development",
      "Business Expansion Consulting",
    ],
  },
];

// Six priority services to feature on the homepage
export const HOMEPAGE_SERVICES_SLUGS = [
  "bpo-call-center",
  "project-outsourcing",
  "lead-generation-sales",
  "recruitment-staffing",
  "digital-marketing",
  "business-consulting",
];
export const HOMEPAGE_SERVICES = SERVICES.filter((s) => HOMEPAGE_SERVICES_SLUGS.includes(s.slug));

export const INDUSTRIES = [
  { name: "Healthcare", icon: "HeartPulse", desc: "Patient support, claims, telehealth ops, healthcare hiring." },
  { name: "Ayurveda", icon: "Leaf", desc: "Specialised Ayurveda business setup, telemarketing and distributor networks." },
  { name: "Education", icon: "GraduationCap", desc: "Admissions, tele-counselling, learner support, EdTech CX." },
  { name: "Real Estate", icon: "Building2", desc: "Lead nurturing, site visits, post-sales, broker support." },
  { name: "E-Commerce", icon: "ShoppingBag", desc: "CX, returns, performance marketing, marketplace ops." },
  { name: "Finance", icon: "Landmark", desc: "Collections, fraud ops, back-office and customer care." },
  { name: "Banking", icon: "Banknote", desc: "Customer onboarding, KYC, cross-sell, retention." },
  { name: "Insurance", icon: "ShieldCheck", desc: "Policy servicing, renewals, claims support, lead-gen." },
  { name: "IT & Technology", icon: "Cpu", desc: "Tier-1/2 tech support, dev hiring, SaaS growth ops." },
  { name: "Logistics", icon: "Truck", desc: "Order tracking, dispatch ops, driver hiring, customer care." },
  { name: "Telecommunications", icon: "Signal", desc: "Subscriber ops, retention, churn reduction, helpdesk." },
  { name: "Startups", icon: "Rocket", desc: "Founder-led pods, GTM acceleration, lean outsourcing." },
  { name: "SMEs", icon: "Store", desc: "Cost-efficient growth, lean ops, scalable workforce." },
  { name: "Agencies", icon: "Briefcase", desc: "White-label delivery, fulfilment, surge capacity." },
  { name: "Professional Services", icon: "ScrollText", desc: "Lead-gen, back-office, client servicing pods." },
];

export const WHY_US = [
  { title: "End-to-End Business Solutions", desc: "From front-line ops to consulting — one accountable partner.", icon: "Layers" },
  { title: "Scalable Outsourcing Support", desc: "Ramp 10 seats or 500 — without breaking quality.", icon: "Expand" },
  { title: "Dedicated Project Management", desc: "Single accountable POC and weekly governance reviews.", icon: "UserCheck" },
  { title: "Flexible Service Models", desc: "FTE-based, transaction-based or performance-linked engagements.", icon: "Settings2" },
  { title: "Cost-Effective Growth", desc: "30–55% lower fully-loaded cost vs. in-house teams.", icon: "BadgePercent" },
  { title: "Experienced Partner Network", desc: "Vetted delivery partners across India, ME and SEA.", icon: "Globe2" },
  { title: "Customised Business Strategies", desc: "Playbooks built around your KPIs — never generic.", icon: "Target" },
  { title: "Quality-Focused Delivery", desc: "100% QA via dedicated coaches and AI-led monitoring.", icon: "Award" },
  { title: "Long-Term Partnership Approach", desc: "Engagements designed to compound — not churn.", icon: "Handshake" },
  { title: "Transparent Communication", desc: "Live dashboards, NDAs, secure-room delivery, clear SLAs.", icon: "MessagesSquare" },
];

export const PROCESS = [
  { num: "01", title: "Business Requirement Analysis", desc: "Discovery workshops to map outcomes, KPIs, scope and constraints." },
  { num: "02", title: "Strategy & Solution Design", desc: "Custom playbook, delivery model and pricing structure tailored to your business." },
  { num: "03", title: "Resource Planning", desc: "Workforce, tooling, infrastructure and SLA plan aligned to launch readiness." },
  { num: "04", title: "Team Deployment", desc: "Hire, train and onboard a dedicated pod under a single accountable manager." },
  { num: "05", title: "Execution & Monitoring", desc: "Live execution with real-time dashboards, daily/weekly governance cadences." },
  { num: "06", title: "Performance Reporting", desc: "Transparent reporting on outcomes, quality, productivity and ROI." },
  { num: "07", title: "Continuous Optimisation & Scaling", desc: "Iterate, scale headcount, expand scope and unlock the next growth lever." },
];

export const PARTNERSHIPS = [
  { title: "BPO Centers", desc: "Backfill capacity, share campaigns, white-label our delivery model.", icon: "Building" },
  { title: "Freelancers", desc: "Plug into ongoing projects with consistent monthly engagements.", icon: "User" },
  { title: "Consultants", desc: "Refer or co-deliver alongside our consulting and setup pods.", icon: "Briefcase" },
  { title: "Recruitment Agencies", desc: "Joint hiring campaigns and RPO sub-contracting opportunities.", icon: "Users" },
  { title: "Sales Agencies", desc: "Co-sell SDR-as-a-service, lead-gen and outbound programs.", icon: "TrendingUp" },
  { title: "Marketing Agencies", desc: "Performance, content and SEO co-delivery for shared clients.", icon: "Megaphone" },
  { title: "Business Development Pros", desc: "Earn recurring revenue on referred client engagements.", icon: "Handshake" },
  { title: "Startup Consultants", desc: "Bring outsourcing depth to your startup advisory practice.", icon: "Rocket" },
  { title: "Channel Partners", desc: "Multi-year channel programs with margin-rich incentives.", icon: "Network" },
  { title: "Strategic Business Partners", desc: "Co-build new verticals, geographies or service lines together.", icon: "Globe2" },
];

export const FAQS = [
  { q: "What services does NR Global Nexus offer?", a: "BPO & call-center, project outsourcing, lead generation & sales, recruitment & staffing, digital marketing, website & CRM solutions, business consulting & setup, and industry-specific support (including specialised Ayurveda business solutions)." },
  { q: "How fast can NR Global Nexus ramp up a project?", a: "Most BPO and sales engagements ramp in 14–30 days. Bulk recruitment and back-office projects can ramp faster based on profile and volume." },
  { q: "Do you sign NDAs and follow strict data confidentiality?", a: "Yes. We sign mutual NDAs, operate ISO-aligned secure delivery rooms, and support GDPR/HIPAA-compliant workflows for regulated industries." },
  { q: "How is pricing structured?", a: "We offer FTE-based, transaction-based, performance-linked and project-based pricing. Every proposal is custom — book a consultation for a tailored quote." },
  { q: "Can you handle both inbound and outbound BPO operations?", a: "Yes. Our call-center pods cover inbound customer support, outbound telemarketing, telesales, retention campaigns, appointment setting, verification and surveys — domestic and international." },
  { q: "Do you take up white-label outsourcing for agencies?", a: "Yes. We act as the silent delivery backbone for agencies, BPOs and consultancies under their brand, with full white-label process control." },
  { q: "What's the difference between Project Outsourcing and BPO?", a: "Project outsourcing covers fixed-scope assignments (data entry, chat support, back-office, etc.). BPO is an ongoing managed-services engagement with dedicated FTEs against your SLAs." },
  { q: "How do you ensure lead quality in lead-generation campaigns?", a: "Every campaign is built around your ICP. We use scripted qualification, AI call-scoring, and double-verification before passing any lead to your sales team." },
  { q: "Can you hire at high volume (50–500+ people) quickly?", a: "Yes. Our bulk-hiring pods regularly close 50–500 hires within 30–60 days across BPO, sales, healthcare and operations roles." },
  { q: "Do you provide remote and virtual staffing?", a: "Yes. We offer remote workforce solutions and virtual employees across customer support, sales, marketing, back-office and admin functions." },
  { q: "Which digital-marketing channels do you specialise in?", a: "SEO, Google Ads, Meta Ads, social media marketing, content, online reputation management and integrated lead-generation campaigns — measured on revenue, not vanity metrics." },
  { q: "Do you build websites and e-commerce stores?", a: "Yes. We build conversion-optimised business websites, e-commerce stores, landing pages and CRM integrations — with ongoing maintenance and support." },
  { q: "Can you help set up a call center from scratch?", a: "Yes. Our consulting team handles end-to-end call-center setup — infrastructure, hiring, training, scripts, QA and CRM — for startups and enterprises." },
  { q: "Do you support Ayurveda and other niche industries?", a: "Yes. We run specialised playbooks for Ayurveda business setup, telemarketing, sales teams and distributor/franchise development, plus support across healthcare, real estate, e-commerce, finance and more." },
  { q: "How do I get started with NR Global Nexus?", a: "Request a proposal or book a 30-minute consultation. Our team will review your requirement and revert with a tailored plan within 24 hours." },
];
