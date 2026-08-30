from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Header, Request
from fastapi.responses import StreamingResponse, Response, PlainTextResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone
import base64
import json
import re

from google import genai
from google.genai import types

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=GEMINI_API_KEY)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN')

app = FastAPI(title="NR Global Nexus API")
api_router = APIRouter(prefix="/api")


# ----------------- Utility -----------------
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text)
    return text.strip("-")


# ----------------- Models -----------------
class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    designation: Optional[str] = None
    country: Optional[str] = None
    industry: Optional[str] = None
    service: Optional[str] = None
    monthly_budget: Optional[str] = None
    requirements: Optional[str] = None
    form_type: Literal[
        "proposal", "project_inquiry", "recruitment", "partnership",
        "consultation", "contact", "chatbot", "newsletter"
    ] = "contact"
    source: Optional[str] = "website"


class Lead(LeadCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)
    status: Literal["new", "contacted", "qualified", "closed"] = "new"


class NewsletterCreate(BaseModel):
    email: EmailStr


class CareerApplicationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    position: str
    current_location: Optional[str] = None
    qualification: Optional[str] = None
    experience: Optional[str] = None
    current_salary: Optional[str] = None
    expected_salary: Optional[str] = None
    preferred_role: Optional[str] = None
    cover_letter: Optional[str] = None
    resume_filename: Optional[str] = None
    resume_b64: Optional[str] = None


class CareerApplication(CareerApplicationCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)


class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    cover_image: Optional[str] = None
    author: str = "NR Global Nexus Team"
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    tags: List[str] = []
    reading_time: Optional[int] = None
    published: bool = True


class BlogPost(BlogPostCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


class ChatRequest(BaseModel):
    session_id: str
    message: str


# ----------------- Lead Endpoints -----------------
@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    await db.leads.insert_one(lead.model_dump())
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(form_type: Optional[str] = None, limit: int = 200):
    q = {}
    if form_type:
        q["form_type"] = form_type
    cursor = db.leads.find(q, {"_id": 0}).sort("created_at", -1).limit(limit)
    return await cursor.to_list(limit)


# ----------------- Newsletter -----------------
@api_router.post("/newsletter")
async def newsletter_subscribe(payload: NewsletterCreate):
    existing = await db.newsletter.find_one({"email": payload.email})
    if existing:
        return {"message": "Already subscribed", "email": payload.email}
    doc = {
        "id": str(uuid.uuid4()),
        "email": payload.email,
        "created_at": now_iso(),
    }
    await db.newsletter.insert_one(doc)
    return {"message": "Subscribed", "email": payload.email}


# ----------------- Careers -----------------
@api_router.post("/careers/apply", response_model=CareerApplication)
async def career_apply(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(""),
    position: str = Form(...),
    current_location: str = Form(""),
    qualification: str = Form(""),
    experience: str = Form(""),
    current_salary: str = Form(""),
    expected_salary: str = Form(""),
    preferred_role: str = Form(""),
    cover_letter: str = Form(""),
    resume: Optional[UploadFile] = File(None),
):
    resume_b64 = None
    resume_filename = None
    if resume is not None:
        content = await resume.read()
        if len(content) > 5 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="Resume exceeds 5MB limit")
        resume_b64 = base64.b64encode(content).decode("utf-8")
        resume_filename = resume.filename

    app_data = CareerApplication(
        name=name,
        email=email,
        phone=phone or None,
        position=position,
        current_location=current_location or None,
        qualification=qualification or None,
        experience=experience or None,
        current_salary=current_salary or None,
        expected_salary=expected_salary or None,
        preferred_role=preferred_role or None,
        cover_letter=cover_letter or None,
        resume_filename=resume_filename,
        resume_b64=resume_b64,
    )
    await db.career_applications.insert_one(app_data.model_dump())
    safe = app_data.model_dump()
    safe.pop("resume_b64", None)
    return CareerApplication(**{**safe, "resume_b64": None})


@api_router.get("/careers/applications")
async def list_applications(limit: int = 100):
    cursor = db.career_applications.find({}, {"_id": 0, "resume_b64": 0}).sort("created_at", -1).limit(limit)
    return await cursor.to_list(limit)


@api_router.get("/careers/openings")
async def list_openings():
    return [
        {"id": "bpo-agent", "title": "BPO Customer Support Executive", "department": "Operations", "location": "Siliguri, India / Remote", "type": "Full-time", "experience": "0-3 years"},
        {"id": "telecaller", "title": "Telecaller / Telesales Executive", "department": "Sales", "location": "Siliguri, India", "type": "Full-time", "experience": "0-3 years"},
        {"id": "sales-bdm", "title": "Business Development Manager", "department": "Sales", "location": "Remote / Hybrid", "type": "Full-time", "experience": "3-6 years"},
        {"id": "digital-marketer", "title": "Performance Marketing Specialist", "department": "Marketing", "location": "Remote", "type": "Full-time", "experience": "2-5 years"},
        {"id": "recruiter", "title": "Senior Recruitment Consultant", "department": "HR", "location": "Siliguri, India", "type": "Full-time", "experience": "3-7 years"},
        {"id": "team-lead", "title": "Operations Team Lead", "department": "Operations", "location": "Siliguri, India", "type": "Full-time", "experience": "5+ years"},
        {"id": "web-dev", "title": "Full-Stack Web Developer", "department": "Technology", "location": "Remote", "type": "Full-time", "experience": "2-5 years"},
        {"id": "ayur-consult", "title": "Ayurveda Business Consultant", "department": "Consulting", "location": "Remote / Siliguri", "type": "Full-time / Contract", "experience": "3-8 years"},
    ]


# ----------------- Blog -----------------
@api_router.get("/blog")
async def list_blog(category: Optional[str] = None, q: Optional[str] = None, limit: int = 50):
    query = {"published": True}
    if category and category.lower() != "all":
        query["category"] = category
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"excerpt": {"$regex": q, "$options": "i"}},
            {"content": {"$regex": q, "$options": "i"}},
        ]
    cursor = db.blog.find(query, {"_id": 0, "content": 0}).sort("created_at", -1).limit(limit)
    return await cursor.to_list(limit)


@api_router.get("/blog/categories")
async def blog_categories():
    cats = await db.blog.distinct("category")
    return cats


@api_router.get("/blog/{slug}")
async def get_blog(slug: str):
    post = await db.blog.find_one({"slug": slug}, {"_id": 0})
    if not post:
        raise HTTPException(404, "Post not found")
    related_cursor = db.blog.find(
        {"category": post["category"], "slug": {"$ne": slug}, "published": True},
        {"_id": 0, "content": 0},
    ).limit(3)
    related = await related_cursor.to_list(3)
    return {"post": post, "related": related}


@api_router.post("/blog", response_model=BlogPost)
async def create_blog(payload: BlogPostCreate):
    slug = slugify(payload.title)
    existing = await db.blog.find_one({"slug": slug})
    if existing:
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"
    if not payload.reading_time:
        words = len(payload.content.split())
        payload.reading_time = max(1, words // 200)
    post = BlogPost(**payload.model_dump(), slug=slug)
    await db.blog.insert_one(post.model_dump())
    return post


@api_router.put("/blog/{slug}")
async def update_blog(slug: str, payload: BlogPostCreate):
    update = payload.model_dump()
    update["updated_at"] = now_iso()
    result = await db.blog.update_one({"slug": slug}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(404, "Post not found")
    return {"updated": True}


@api_router.delete("/blog/{slug}")
async def delete_blog(slug: str):
    result = await db.blog.delete_one({"slug": slug})
    if result.deleted_count == 0:
        raise HTTPException(404, "Post not found")
    return {"deleted": True}


# ----------------- AI Chatbot -----------------
SYSTEM_PROMPT = """You are NexusAI, the official AI Business Assistant for NR Global Nexus — a premium global Business Growth, Outsourcing, Recruitment, Digital Marketing, Project Outsourcing and Business Consulting company.

About NR Global Nexus:
- Founded: 2018 by Nasim Khan and Reshmi Saibya.
- Tagline: "Connecting Businesses. Accelerating Growth."
- Headquarters: 28/1 Nazrul Sarani, Ashrampara, Hakimpara, Siliguri – 734001, West Bengal, India.
- Business Hours: Monday – Saturday, 10:00 AM – 7:00 PM IST.
- Contact: Phone/WhatsApp +91 99333 51374. Emails: info@nrglobalnexus.com (general), sales@nrglobalnexus.com (sales), hr@nrglobalnexus.com (careers).

Mission: Help businesses achieve sustainable growth through reliable outsourcing, workforce solutions, innovative sales strategies, and operational excellence.
Vision: Become a globally trusted business growth partner connecting organisations with scalable outsourcing, talent, technology, and business expansion solutions.

Core Services (8):
1. BPO & Call Center Services — inbound/outbound, telemarketing, telesales, retention, appointment setting, verification, surveys.
2. Project Outsourcing Services — voice/non-voice, chat & email support, data entry, back-office, BPO, white-label.
3. Lead Generation & Sales Solutions — B2B/B2C lead-gen, sales prospecting, appointment booking, telemarketing campaigns, CRM follow-up.
4. Recruitment & Staffing Solutions — bulk hiring, BPO/sales recruitment, virtual staffing, remote workforce, dedicated resources, RPO.
5. Digital Marketing Services — SEO, social media, Google Ads, Meta Ads, lead-gen campaigns, ORM, content marketing.
6. Website & Digital Solutions — business websites, e-commerce, landing pages, business email, maintenance, CRM integrations.
7. Business Consulting & Setup — call-center setup, sales process design, CRM implementation, team training, ops consulting, startup support.
8. Industry-Specific Solutions — Ayurveda business setup/telemarketing/sales-team setup, distributor & franchise development, dealer network expansion.

Industries: Healthcare, Ayurveda, Education, Real Estate, E-Commerce, Finance, Banking, Insurance, IT & Technology, Logistics, Telecommunications, Startups, SMEs, Agencies, Professional Services.

Reach: 100+ Business Partners, 500+ Professionals Network, 1000+ Successful Projects, 24/7 Global Support.

Your role:
1. Answer questions clearly and professionally about NR Global Nexus services, pricing approach (custom quote based on scope), partnerships, careers, and industry expertise.
2. Qualify leads: if a visitor wants a proposal, consultation, partnership, or to apply, politely collect Name, Company, Designation (if business), Email, Phone, Country, Industry, Service of Interest, Monthly Budget (optional), and Requirements.
3. When you have enough lead info, output a single line beginning with `[LEAD_JSON]` followed by JSON: `[LEAD_JSON]{"name":"...","email":"...","phone":"...","company":"...","designation":"...","country":"...","industry":"...","service":"...","monthly_budget":"...","requirements":"..."}` then continue with a warm confirmation. Only emit the marker once per conversation.
4. Offer WhatsApp handoff (+91 99333 51374) or human-agent escalation when the user asks for it or for complex/urgent issues.
5. Support multilingual conversation — reply in the same language the user writes in (English, Hindi, Bengali, etc.).
6. Tone: Professional, trustworthy, concise, conversion-focused. Avoid generic AI filler. Keep replies under 120 words unless the user asks for detail.
"""


def parse_lead_json(text: str) -> Optional[dict]:
    m = re.search(r"\[LEAD_JSON\]\s*(\{.*?\})", text, re.DOTALL)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except Exception:
        return None


@api_router.post("/chat")
async def chat_endpoint(payload: ChatRequest):
    # Persist user message
    await db.chat_messages.insert_one({
        "session_id": payload.session_id,
        "role": "user",
        "content": payload.message,
        "created_at": now_iso(),
    })

    # Load conversation history to pass to model context
    history_cursor = db.chat_messages.find(
        {"session_id": payload.session_id}, {"_id": 0}
    ).sort("created_at", 1).limit(40)
    history = await history_cursor.to_list(40)

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=payload.session_id,
        system_message=SYSTEM_PROMPT,
    ).with_model("anthropic", "claude-sonnet-4-6")

    # Replay prior turns (skip the just-inserted user message which is the last)
    prior = history[:-1] if history else []
    for msg in prior:
        if msg["role"] == "user":
            try:
                await chat.send_message(UserMessage(text=msg["content"]))
            except Exception as e:
                logger.warning(f"history replay failed: {e}")
                break

    async def event_gen():
        buffer = ""
        try:
            async for event in chat.stream_message(UserMessage(text=payload.message)):
                if isinstance(event, TextDelta):
                    buffer += event.content
                    yield f"data: {json.dumps({'delta': event.content})}\n\n"
                elif isinstance(event, StreamDone):
                    break
        except Exception as e:
            logger.exception("chat stream error")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

        # Strip lead JSON markers from displayed text and capture lead
        lead = parse_lead_json(buffer)
        display_text = re.sub(r"\[LEAD_JSON\]\s*\{.*?\}", "", buffer, flags=re.DOTALL).strip()

        await db.chat_messages.insert_one({
            "session_id": payload.session_id,
            "role": "assistant",
            "content": display_text or buffer,
            "created_at": now_iso(),
        })

        if lead and lead.get("email"):
            try:
                lead_obj = Lead(
                    name=lead.get("name") or "Chatbot Lead",
                    email=lead.get("email"),
                    phone=lead.get("phone"),
                    company=lead.get("company"),
                    designation=lead.get("designation"),
                    country=lead.get("country"),
                    industry=lead.get("industry"),
                    service=lead.get("service"),
                    monthly_budget=lead.get("monthly_budget"),
                    requirements=lead.get("requirements"),
                    form_type="chatbot",
                    source=f"chatbot:{payload.session_id}",
                )
                await db.leads.insert_one(lead_obj.model_dump())
                yield f"data: {json.dumps({'lead_captured': True})}\n\n"
            except Exception as e:
                logger.warning(f"lead capture failed: {e}")

        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no", "Connection": "keep-alive"},
    )


@api_router.get("/chat/{session_id}")
async def chat_history(session_id: str):
    cursor = db.chat_messages.find({"session_id": session_id}, {"_id": 0}).sort("created_at", 1)
    return await cursor.to_list(500)


# ----------------- Admin -----------------
def _require_admin(token: Optional[str]):
    if not ADMIN_TOKEN or token != ADMIN_TOKEN:
        raise HTTPException(401, "Unauthorized")


class AdminLoginPayload(BaseModel):
    password: str


@api_router.post("/admin/login")
async def admin_login(payload: AdminLoginPayload):
    if not ADMIN_PASSWORD or payload.password != ADMIN_PASSWORD:
        raise HTTPException(401, "Invalid password")
    return {"token": ADMIN_TOKEN}


@api_router.get("/admin/leads")
async def admin_leads(x_admin_token: Optional[str] = Header(None), form_type: Optional[str] = None, limit: int = 500):
    _require_admin(x_admin_token)
    q = {}
    if form_type and form_type != "all":
        q["form_type"] = form_type
    cursor = db.leads.find(q, {"_id": 0}).sort("created_at", -1).limit(limit)
    return await cursor.to_list(limit)


@api_router.get("/admin/careers")
async def admin_careers(x_admin_token: Optional[str] = Header(None), limit: int = 500):
    _require_admin(x_admin_token)
    cursor = db.career_applications.find({}, {"_id": 0, "resume_b64": 0}).sort("created_at", -1).limit(limit)
    return await cursor.to_list(limit)


@api_router.get("/admin/careers/{app_id}/resume")
async def admin_resume(app_id: str, x_admin_token: Optional[str] = Header(None)):
    _require_admin(x_admin_token)
    doc = await db.career_applications.find_one({"id": app_id})
    if not doc or not doc.get("resume_b64"):
        raise HTTPException(404, "Resume not found")
    data = base64.b64decode(doc["resume_b64"])
    filename = doc.get("resume_filename") or f"resume-{app_id}.pdf"
    safe = filename.replace('"', '')
    return Response(
        content=data,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{safe}"'},
    )


@api_router.get("/admin/stats")
async def admin_stats(x_admin_token: Optional[str] = Header(None)):
    _require_admin(x_admin_token)
    async def cnt(coll, q=None):
        return await coll.count_documents(q or {})
    leads_total = await cnt(db.leads)
    by_type = {
        "proposals": await cnt(db.leads, {"form_type": "proposal"}),
        "consultations": await cnt(db.leads, {"form_type": "consultation"}),
        "partnerships": await cnt(db.leads, {"form_type": "partnership"}),
        "chatbot_leads": await cnt(db.leads, {"form_type": "chatbot"}),
    }
    career_apps = await cnt(db.career_applications)
    newsletter = await cnt(db.newsletter)
    blog_posts = await cnt(db.blog)
    recent = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).limit(10).to_list(10)
    return {
        "leads_total": leads_total,
        **by_type,
        "career_apps": career_apps,
        "newsletter": newsletter,
        "blog_posts": blog_posts,
        "recent_leads": recent,
    }


# Protect blog CRUD writes (read endpoints stay public)
@api_router.post("/admin/blog", include_in_schema=False)
async def admin_create_blog(payload: BlogPostCreate, x_admin_token: Optional[str] = Header(None)):
    _require_admin(x_admin_token)
    return await create_blog(payload)


# ----------------- Callback request -----------------
class CallbackPayload(BaseModel):
    name: str
    phone: str
    preferred_time: Optional[str] = None
    notes: Optional[str] = None


@api_router.post("/callback")
async def request_callback(payload: CallbackPayload):
    lead = Lead(
        name=payload.name,
        email=f"callback+{uuid.uuid4().hex[:8]}@nrglobalnexus.com",
        phone=payload.phone,
        requirements=f"Callback requested. Preferred time: {payload.preferred_time or 'ASAP'}. Notes: {payload.notes or '-'}",
        form_type="contact",
        source="instant-callback",
    )
    await db.leads.insert_one(lead.model_dump())
    return {"ok": True, "id": lead.id}


# ----------------- Sitemap / robots (under /api so they reach the backend; static
# fallbacks at the canonical /sitemap.xml + /robots.txt are served from frontend/public). -----------------
SITE_URLS = [
    "/", "/about", "/services", "/industries", "/case-studies",
    "/partnership", "/careers", "/contact", "/blog",
    "/services/bpo-services", "/services/outsourcing-services",
    "/services/recruitment-services", "/services/lead-generation-services",
    "/services/digital-marketing-services", "/services/business-consulting-services",
]


def _base_url(request: Request) -> str:
    proto = request.headers.get("x-forwarded-proto", "https")
    host = request.headers.get("x-forwarded-host", request.headers.get("host", "nrglobalnexus.com"))
    return f"{proto}://{host}"


@api_router.get("/sitemap.xml", include_in_schema=False)
async def sitemap(request: Request):
    base = _base_url(request)
    items = [(u, "1.0" if u == "/" else "0.7") for u in SITE_URLS]
    posts = await db.blog.find({"published": True}, {"_id": 0, "slug": 1, "updated_at": 1}).to_list(500)
    for p in posts:
        items.append((f"/blog/{p['slug']}", "0.6"))
    body = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u, pri in items:
        body.append(f"<url><loc>{base}{u}</loc><priority>{pri}</priority></url>")
    body.append("</urlset>")
    return Response("\n".join(body), media_type="application/xml")


# ----------------- Static content (case studies, testimonials, stats) -----------------
@api_router.get("/case-studies")
async def case_studies():
    return [
        {"id": "fintech-bpo", "client": "Leading Fintech Platform", "industry": "Finance", "service": "BPO + Customer Support", "result": "Reduced customer response time by 68% and scaled support team 4x in 90 days.", "metric": "68%", "metric_label": "Faster Response", "image": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"},
        {"id": "ecom-lead-gen", "client": "DTC E-commerce Brand", "industry": "E-Commerce", "service": "Lead Generation + Performance Marketing", "result": "Generated 12,400+ qualified leads in 6 months with a 5.2x ROAS on ad spend.", "metric": "5.2x", "metric_label": "ROAS Achieved", "image": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"},
        {"id": "health-recruit", "client": "Multi-specialty Hospital Chain", "industry": "Healthcare", "service": "Bulk Recruitment", "result": "Hired 320 healthcare professionals across 7 cities within 45 days.", "metric": "320", "metric_label": "Hires in 45 Days", "image": "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80"},
        {"id": "ayurveda-distribution", "client": "Premium Ayurveda Brand", "industry": "Ayurveda", "service": "Telemarketing + Distributor Setup", "result": "Built a 140-distributor network across 11 states with a dedicated tele-sales pod in 6 months.", "metric": "140", "metric_label": "Distributors Onboarded", "image": "https://images.unsplash.com/photo-1611073615452-04dba8af1d35?w=800&q=80"},
    ]


@api_router.get("/testimonials")
async def testimonials():
    return [
        {"name": "Arjun Mehta", "role": "COO", "company": "FinEdge Capital", "rating": 5, "quote": "NR Global Nexus rebuilt our entire customer support operation in under 60 days. CSAT jumped from 72 to 94. They behave like an extension of our team, not a vendor."},
        {"name": "Priya Sharma", "role": "Head of Growth", "company": "Lumio Commerce", "rating": 5, "quote": "Their performance marketing team delivered a 5x ROAS within the first quarter. The transparency in reporting and weekly strategy calls are unmatched."},
        {"name": "Dr. Rohan Banerjee", "role": "HR Director", "company": "MedCare Hospitals", "rating": 5, "quote": "Recruiting 300+ qualified nurses across 7 cities in 45 days felt impossible — until we partnered with NR Global Nexus. They simply deliver."},
        {"name": "Vaidya Anand Joshi", "role": "Founder", "company": "Sattva Ayurveda", "rating": 5, "quote": "Their Ayurveda business setup and tele-sales pod helped us scale to 140+ distributors across India. Truly an end-to-end growth partner."},
        {"name": "Karan Iyer", "role": "VP Sales", "company": "Velocity SaaS", "rating": 5, "quote": "Best sales outsourcing partner we've worked with. Their SDRs book 40+ qualified meetings every month, consistently."},
    ]


@api_router.get("/stats")
async def stats():
    return {
        "partners": 100,
        "professionals": 500,
        "projects": 1000,
        "support": "24/7",
    }


@api_router.get("/")
async def root():
    return {"service": "NR Global Nexus API", "status": "ok"}


# ----------------- Seed Blog -----------------
SEED_POSTS = [
    {
        "title": "How BPO Outsourcing Helps Businesses Scale Faster",
        "category": "BPO Outsourcing",
        "excerpt": "Discover how BPO outsourcing unlocks 24/7 operations, lower costs, and global scale for ambitious startups and enterprises.",
        "cover_image": "https://images.unsplash.com/photo-1552581234-26160f608093?w=1200&q=80",
        "tags": ["BPO", "Outsourcing", "Scaling"],
        "content": """## Why BPO is the fastest path to scale\n\nBusinesses today operate on global timelines and customer expectations are higher than ever. Building an in-house support, sales, or back-office team is expensive, slow, and difficult to scale on demand.\n\n**Business Process Outsourcing (BPO)** flips that equation. With the right partner, you get:\n\n- **24/7 multilingual coverage** without hiring abroad\n- **Variable cost structure** — pay only for the seats you need\n- **Pre-trained agents** ramping in days, not quarters\n- **Enterprise-grade infrastructure** without the capex\n\n### Where BPO delivers the biggest ROI\n\n1. **Customer Support** — Tier-1 ticket deflection and CSAT lift\n2. **Telecalling & Outbound** — Pipeline generation at predictable CAC\n3. **Back-office processing** — Data entry, KYC, claims, invoicing\n4. **Technical Support** — L1/L2 troubleshooting with SLAs\n\n### The NR Global Nexus difference\n\nWe operate as an extension of your team. Weekly strategy reviews, transparent dashboards, and dedicated quality teams ensure outsourcing actually scales your brand — not dilutes it.\n\nReady to scale? [Book a consultation](/contact) today.""",
    },
    {
        "title": "Top Benefits of Outsourcing Customer Support Services",
        "category": "BPO Outsourcing",
        "excerpt": "Customer support is now a competitive advantage. Here's why leading brands are outsourcing it — and winning.",
        "cover_image": "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80",
        "tags": ["Customer Support", "CX", "BPO"],
        "content": """## Customer support is no longer a cost center\n\nIt is the single biggest driver of retention, referral, and lifetime value. Yet most growing businesses still treat it as overhead.\n\n### 7 reasons to outsource customer support\n\n1. **24/7/365 availability** across time zones\n2. **Lower cost per ticket** by 40–60%\n3. **Faster ramp-up** during seasonal spikes\n4. **Multichannel coverage** — voice, chat, email, social, WhatsApp\n5. **Multilingual reach** without local hires\n6. **Built-in QA and coaching** for consistent CSAT\n7. **Focus on core product** while experts handle support\n\n### How NR Global Nexus structures support partnerships\n\n- Dedicated pods, not shared seats\n- Custom scripts and brand voice training\n- Real-time QA on 100% of interactions via AI\n- Monthly business reviews tied to your CX KPIs\n\nThe brands winning today don't outsource support to save money. They outsource it to **win customers for life**.""",
    },
    {
        "title": "AI Automation for Modern Businesses: A Complete Guide",
        "category": "AI Solutions",
        "excerpt": "From chatbots to intelligent workflows — here's how AI automation transforms operations, sales, and CX in 2026.",
        "cover_image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
        "tags": ["AI", "Automation", "Digital Transformation"],
        "content": """## AI automation is the new operating leverage\n\nIn 2026, every modern business runs on a layer of AI automation — whether they realize it or not.\n\n### The four pillars of AI automation\n\n1. **Conversational AI** — Chatbots, voice agents, lead qualification\n2. **Process automation** — Document parsing, KYC, invoice processing\n3. **Predictive intelligence** — Churn prediction, lead scoring, demand forecasting\n4. **Generative workflows** — Content creation, drafting, summarization\n\n### Where to start (without overspending)\n\n- **Pick one high-volume, repetitive workflow** (e.g., L1 support, lead routing)\n- **Measure baseline metrics** (handling time, cost, CSAT)\n- **Deploy a focused AI agent** with clear escalation rules\n- **Iterate weekly** based on real data\n\n### Real outcomes our clients see\n\n- 70%+ tier-1 query deflection\n- 2,000+ agent hours saved per month\n- 30–50% lower cost-to-serve\n- 24/7 lead capture and qualification\n\nThe winners of the next decade won't be the biggest — they'll be the most **AI-leveraged**.""",
    },
    {
        "title": "Lead Generation Strategies That Actually Work in 2026",
        "category": "Sales Outsourcing",
        "excerpt": "Forget vanity metrics. Here are the lead generation playbooks delivering pipeline in 2026.",
        "cover_image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
        "tags": ["Lead Generation", "Sales", "Growth"],
        "content": """## The lead gen playbook has changed\n\nCold spray-and-pray is dead. Buyer attention is fragmented. AI is filtering inboxes. So what actually works in 2026?\n\n### Five proven lead generation strategies\n\n1. **Multichannel outbound sequences** — Email + LinkedIn + WhatsApp + voice, orchestrated\n2. **Intent-based targeting** — Reach buyers showing real signals (search, content consumption, hiring patterns)\n3. **Personalized AI-driven outreach** — Hyper-personalized messaging at scale\n4. **Content + retargeting flywheels** — Build trust at scale, retarget high-intent visitors\n5. **Outsourced SDR teams** — Trained, dedicated SDRs running your playbook full-time\n\n### Why outsourced SDRs win in 2026\n\n- **Predictable pipeline** — 30–80 qualified meetings booked per SDR per month\n- **Lower fully-loaded cost** vs. in-house SDRs (40–55% savings)\n- **Faster ramp** — productive in week 2, not month 4\n- **Tooling included** — sequencers, CRM, dialers, intent data\n\nDon't generate more leads. Generate **better pipeline**.""",
    },
    {
        "title": "Digital Marketing Trends Every Business Should Know",
        "category": "Digital Marketing",
        "excerpt": "Search is shifting. Social is fragmenting. Here are the digital marketing trends that will define the next 24 months.",
        "cover_image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
        "tags": ["Digital Marketing", "SEO", "Performance"],
        "content": """## Six trends reshaping digital marketing\n\n1. **AI-powered search (GEO)** — Optimize for ChatGPT, Perplexity, Gemini, not just Google\n2. **Short-form video first** — Reels, Shorts, and TikTok dominate discovery\n3. **First-party data & CDPs** — Cookies are gone; owned data wins\n4. **Performance Max & full-funnel paid** — Channel boundaries are blurring\n5. **Influencer + UGC at scale** — Authentic creators beat brand ads\n6. **Conversion-rate engineering** — CRO is now the highest-ROI growth lever\n\n### What this means for your business\n\n- Re-architect SEO for **generative engines**, not just keywords\n- Build a **content engine**, not campaigns\n- Invest in **CRO and analytics** before more ad spend\n- Make **WhatsApp + email** your owned channels\n\n### The NR Global Nexus growth pod\n\nWe assemble dedicated pods of strategist + paid specialist + creative + SEO + analyst — delivered as an outsourced growth team. One scorecard, one accountable partner.""",
    },
    {
        "title": "Recruitment Outsourcing vs In-House Hiring: Which is Better?",
        "category": "Recruitment",
        "excerpt": "Should you build an in-house TA team or outsource recruitment? Here's a clear framework to decide.",
        "cover_image": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80",
        "tags": ["Recruitment", "Hiring", "RPO"],
        "content": """## The hiring decision most founders get wrong\n\nBuilding an in-house Talent Acquisition team feels safe — but it's slow, expensive, and rigid. Outsourcing recruitment (RPO) is faster, more flexible, and scales on demand.\n\n### When to keep recruitment in-house\n\n- You hire **fewer than 5 people / quarter** consistently\n- You have **niche, technical roles** requiring deep brand immersion\n- Recruitment is a **core competitive advantage**\n\n### When to outsource recruitment\n\n- You're scaling fast (10+ hires / quarter)\n- You have **seasonal or bulk hiring** needs\n- You want **predictable cost-per-hire**\n- You need **specialized sourcing** (healthcare, BPO, tech, sales)\n- Your in-house TA team is overwhelmed\n\n### What NR Global Nexus delivers\n\n- **Bulk hiring** — 50 to 500+ hires in 30–60 days\n- **Permanent staffing** — Pre-vetted candidates, 3-day shortlist SLA\n- **Contract staffing** — Flex workforce on demand\n- **Remote workforce** — Sourced and onboarded globally\n\nThe right answer is often hybrid: keep your senior/strategic hiring in-house and outsource volume and specialized roles. Talk to us about a [custom RPO model](/contact).""",
    },
]


@app.on_event("startup")
async def startup():
    # seed blog if empty
    count = await db.blog.count_documents({})
    if count == 0:
        for p in SEED_POSTS:
            words = len(p["content"].split())
            doc = BlogPost(
                **p,
                slug=slugify(p["title"]),
                reading_time=max(2, words // 200),
            ).model_dump()
            await db.blog.insert_one(doc)
        logger.info(f"Seeded {len(SEED_POSTS)} blog posts")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
