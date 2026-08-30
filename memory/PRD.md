# NR Global Nexus — PRD

## Problem Statement
Premium corporate marketing website for NR Global Nexus — a global BPO, AI Solutions, Recruitment, Sales Outsourcing, Digital Marketing & Business Consulting company. Site must be enterprise-grade, conversion-focused, mobile-responsive, SEO-optimised with dark + light blue palette.

## User Personas
1. **Outsourcing buyer** (Director/COO/Head of Ops) — looking to outsource BPO, customer support, sales, or hiring.
2. **Growth marketer** (CMO/Head of Growth) — needs performance marketing, SEO, AI automation.
3. **Job seeker** — applying via Careers page with resume.
4. **Partner/Reseller** — exploring partnership.
5. **Visitor** — reading blog, asking chatbot for info.

## Architecture
- **Backend**: FastAPI + MongoDB (motor). Public APIs under `/api`. Emergentintegrations + Claude Sonnet 4.6 for chatbot (SSE streaming). Emergent LLM key via env.
- **Frontend**: React 19 + React Router + Tailwind + Shadcn/UI (sonner toaster) + lucide-react icons. Cabinet Grotesk + IBM Plex Sans fonts.
- **Routes**: `/`, `/about`, `/services`, `/industries`, `/case-studies`, `/blog`, `/blog/:slug`, `/careers`, `/contact`.
- **Global widgets**: Sticky navbar (glassmorphic), Footer (newsletter+contact+social), Floating WhatsApp (left), AI Chatbot (right, above Emergent badge).

## What's Implemented (Dec 2026)
- Home: hero with headline, stats (100+/500+/1000+/24-7), 6 services grid, industries bento, why-us, case studies, testimonials, CTA.
- About: vision/mission/why/growth.
- Services: 6 service detail sections with anchor scroll, sub-services list, proposal CTA.
- Industries: 8 industries with images.
- Case Studies: 4 case studies with metric callouts (zigzag layout).
- Blog: list + search + category filter + detail page with markdown rendering + related posts + social share.
- Careers: 6 dynamic openings + resume upload form (multipart).
- Contact: 5 form tabs (proposal/project/recruitment/partnership/consultation) + Google Maps + FAQ accordion.
- AI Chatbot (NexusAI): Streaming Claude Sonnet 4.6, lead capture via `[LEAD_JSON]` markers persisted to db.leads with form_type='chatbot'. Multilingual.
- Newsletter footer subscribe (POST /api/newsletter, dedupes).
- 6 SEO-optimised blog posts seeded on startup if collection empty.

## Backend Endpoints
- POST /api/leads, GET /api/leads
- POST /api/newsletter
- POST /api/careers/apply (multipart), GET /api/careers/openings, GET /api/careers/applications
- GET/POST/PUT/DELETE /api/blog, GET /api/blog/{slug}, GET /api/blog/categories
- GET /api/case-studies, GET /api/testimonials, GET /api/stats
- POST /api/chat (SSE), GET /api/chat/{session_id}

## Test Coverage
- 22/22 backend pytest cases pass (CRUD, all lead form types, newsletter, careers multipart, blog seed, chat SSE + lead capture).
- Frontend ~95% pass; chatbot toggle now repositioned above Emergent preview badge (z-9999, bottom-24).

## Backlog / Next Phase
- **P1**: Admin dashboard UI (currently APIs exposed but no admin UI) — leads viewer, blog CMS UI, applications viewer
- **P1**: Email notifications on lead/application submit (SendGrid/Resend integration)
- **P1**: Refactor server.py into routers (blog/leads/careers/chat)
- **P2**: Replace inline base64 resume with object storage (S3/GCS)
- **P2**: GTM/Analytics integration, sitemap.xml + robots.txt
- **P2**: Pass conversation history directly to LLM instead of replaying turns (latency/cost optimisation)
- **P2**: Authentication for admin panel
- **P3**: Live human-agent chat handoff (currently AI only)
- **P3**: Multilingual UI (chatbot already replies in user's language; site copy is English only)

