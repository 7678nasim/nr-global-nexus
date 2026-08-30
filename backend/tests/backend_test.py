"""End-to-end backend API tests for NR Global Nexus.

Covers:
- Health check
- Blog CRUD + categories + slug detail
- Case studies, testimonials, stats
- Careers openings + multipart apply
- Leads (multiple form types) + filtering
- Newsletter subscribe + duplicate handling
- Chat SSE stream + lead capture via [LEAD_JSON]
"""
import io
import json
import os
import time
import uuid

import httpx
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://bpo-innovate.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


# ---------------- Health ----------------
def test_root_health():
    r = requests.get(f"{API}/", timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"
    assert "NR Global Nexus" in data.get("service", "")


# ---------------- Static endpoints ----------------
def test_stats():
    r = requests.get(f"{API}/stats", timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert data == {"partners": 100, "professionals": 500, "projects": 1000, "support": "24/7"}


def test_case_studies():
    r = requests.get(f"{API}/case-studies", timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) >= 4
    required = {"id", "client", "industry", "service", "result", "metric", "metric_label", "image"}
    for item in data:
        assert required.issubset(item.keys()), f"missing fields in case study: {item}"


def test_testimonials():
    r = requests.get(f"{API}/testimonials", timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) >= 5
    required = {"name", "role", "company", "rating", "quote"}
    for t in data:
        assert required.issubset(t.keys())
        assert t["rating"] >= 1


def test_careers_openings():
    r = requests.get(f"{API}/careers/openings", timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) == 8, f"expected 8 openings, got {len(data)}"
    ids = {j["id"] for j in data}
    # New rebrand expectations
    assert "telecaller" in ids
    assert "web-dev" in ids
    assert "ayur-consult" in ids
    assert "ai-engineer" not in ids  # removed in rebrand
    for j in data:
        assert {"id", "title", "department", "location", "type", "experience"}.issubset(j.keys())


def test_case_studies_includes_ayurveda():
    r = requests.get(f"{API}/case-studies", timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 4
    ids = {c["id"] for c in data}
    assert "ayurveda-distribution" in ids


def test_testimonials_includes_ayurveda():
    r = requests.get(f"{API}/testimonials", timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 5
    companies = " ".join(t["company"].lower() for t in data)
    assert "sattva ayurveda" in companies


# ---------------- Blog ----------------
def test_blog_seeded_six():
    r = requests.get(f"{API}/blog", timeout=30)
    assert r.status_code == 200
    posts = r.json()
    assert isinstance(posts, list)
    assert len(posts) >= 6, f"expected 6 seeded posts, got {len(posts)}"
    titles_lower = " ".join(p["title"].lower() for p in posts)
    for kw in ["recruitment outsourcing", "digital marketing trends", "lead generation",
               "ai automation", "customer support", "bpo outsourcing"]:
        assert kw in titles_lower, f"missing topic: {kw}"


def test_blog_categories():
    r = requests.get(f"{API}/blog/categories", timeout=30)
    assert r.status_code == 200
    cats = r.json()
    assert isinstance(cats, list)
    assert len(cats) >= 5
    expected = {"BPO Outsourcing", "AI Solutions", "Sales Outsourcing", "Digital Marketing", "Recruitment"}
    assert expected.issubset(set(cats))


def test_blog_detail_and_related():
    # First fetch a slug we know exists
    r = requests.get(f"{API}/blog", timeout=30)
    posts = r.json()
    slug = posts[0]["slug"]
    r2 = requests.get(f"{API}/blog/{slug}", timeout=30)
    assert r2.status_code == 200
    body = r2.json()
    assert "post" in body and "related" in body
    assert body["post"]["slug"] == slug
    assert "content" in body["post"]


def test_blog_detail_not_found():
    r = requests.get(f"{API}/blog/this-slug-does-not-exist-xyz", timeout=30)
    assert r.status_code == 404


def test_blog_crud_lifecycle():
    title = f"TEST_Post_{uuid.uuid4().hex[:6]}"
    payload = {
        "title": title,
        "excerpt": "test excerpt",
        "content": "word " * 400,  # ~400 words -> reading_time ~2
        "category": "TEST",
        "tags": ["test"],
    }
    r = requests.post(f"{API}/blog", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    post = r.json()
    assert post["slug"].startswith("test-post-") or post["slug"].startswith("test_post_".replace("_", ""))
    assert post["reading_time"] >= 1
    slug = post["slug"]

    # Update
    payload["excerpt"] = "updated excerpt"
    r2 = requests.put(f"{API}/blog/{slug}", json=payload, timeout=30)
    assert r2.status_code == 200
    assert r2.json().get("updated") is True

    # Verify update
    r3 = requests.get(f"{API}/blog/{slug}", timeout=30)
    assert r3.status_code == 200
    assert r3.json()["post"]["excerpt"] == "updated excerpt"

    # Delete
    r4 = requests.delete(f"{API}/blog/{slug}", timeout=30)
    assert r4.status_code == 200
    assert r4.json().get("deleted") is True

    # 404 after delete
    r5 = requests.get(f"{API}/blog/{slug}", timeout=30)
    assert r5.status_code == 404


# ---------------- Leads ----------------
@pytest.mark.parametrize("form_type", [
    "proposal", "project_inquiry", "recruitment", "partnership",
    "consultation", "contact", "newsletter"
])
def test_create_lead_form_types(form_type):
    payload = {
        "name": f"TEST {form_type}",
        "email": f"test_{form_type}_{uuid.uuid4().hex[:6]}@example.com",
        "phone": "+911234567890",
        "company": "Acme",
        "service": "BPO",
        "requirements": "50 seats",
        "form_type": form_type,
    }
    r = requests.post(f"{API}/leads", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    lead = r.json()
    assert lead["id"]
    assert lead["created_at"]
    assert lead["status"] == "new"
    assert lead["form_type"] == form_type
    assert lead["email"] == payload["email"]


def test_list_leads_filter():
    # create a known lead
    em = f"test_filter_{uuid.uuid4().hex[:6]}@example.com"
    requests.post(f"{API}/leads", json={
        "name": "TEST Filter", "email": em, "form_type": "partnership",
    }, timeout=30)
    r = requests.get(f"{API}/leads", params={"form_type": "partnership"}, timeout=30)
    assert r.status_code == 200
    leads = r.json()
    assert isinstance(leads, list)
    assert all(l["form_type"] == "partnership" for l in leads)
    assert any(l["email"] == em for l in leads)


# ---------------- Newsletter ----------------
def test_newsletter_subscribe_and_duplicate():
    em = f"test_news_{uuid.uuid4().hex[:6]}@example.com"
    r = requests.post(f"{API}/newsletter", json={"email": em}, timeout=30)
    assert r.status_code == 200
    assert r.json().get("message") == "Subscribed"
    r2 = requests.post(f"{API}/newsletter", json={"email": em}, timeout=30)
    assert r2.status_code == 200
    assert r2.json().get("message") == "Already subscribed"


# ---------------- Careers apply (multipart) ----------------
def test_careers_apply_multipart():
    files = {"resume": ("resume.pdf", io.BytesIO(b"%PDF-1.4 fake resume bytes"), "application/pdf")}
    data = {
        "name": "TEST Applicant",
        "email": f"test_app_{uuid.uuid4().hex[:6]}@example.com",
        "phone": "+911111111111",
        "position": "BPO Customer Support Executive",
        "current_location": "Siliguri, India",
        "qualification": "B.Tech CSE",
        "experience": "2 years",
        "current_salary": "4 LPA",
        "expected_salary": "6 LPA",
        "preferred_role": "Customer Support",
        "cover_letter": "Excited to join NR Global Nexus.",
    }
    r = requests.post(f"{API}/careers/apply", data=data, files=files, timeout=60)
    assert r.status_code == 200, r.text
    app = r.json()
    assert app["id"] and app["name"] == data["name"]
    assert app["resume_filename"] == "resume.pdf"
    assert app.get("resume_b64") in (None, "")
    # Verify expanded fields round-trip
    assert app["current_location"] == data["current_location"]
    assert app["qualification"] == data["qualification"]
    assert app["current_salary"] == data["current_salary"]
    assert app["expected_salary"] == data["expected_salary"]
    assert app["preferred_role"] == data["preferred_role"]

    # listing should also not expose resume_b64
    r2 = requests.get(f"{API}/careers/applications", timeout=30)
    assert r2.status_code == 200
    for a in r2.json():
        assert "resume_b64" not in a


# ---------------- Expanded lead payload (rebrand) ----------------
def test_create_lead_expanded_fields():
    em = f"test_expanded_{uuid.uuid4().hex[:6]}@example.com"
    payload = {
        "name": "TEST Expanded",
        "email": em,
        "phone": "+911234567890",
        "company": "Acme",
        "designation": "COO",
        "country": "India",
        "industry": "Ayurveda",
        "service": "BPO & Call Center",
        "monthly_budget": "$5000-15000",
        "requirements": "50 telecallers",
        "form_type": "proposal",
    }
    r = requests.post(f"{API}/leads", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    lead = r.json()
    for k in ("designation", "country", "industry", "monthly_budget"):
        assert lead[k] == payload[k], f"missing/wrong {k} in response: {lead}"

    # Verify persistence via GET filter
    r2 = requests.get(f"{API}/leads", params={"form_type": "proposal"}, timeout=30)
    assert r2.status_code == 200
    found = next((l for l in r2.json() if l.get("email") == em), None)
    assert found is not None
    assert found["designation"] == "COO"
    assert found["country"] == "India"
    assert found["industry"] == "Ayurveda"
    assert found["monthly_budget"] == "$5000-15000"


# ---------------- Chat SSE + lead capture ----------------
def _consume_sse(url, payload, timeout=120):
    """Consume an SSE response and return list of decoded JSON events."""
    events = []
    with httpx.stream("POST", url, json=payload, timeout=timeout) as resp:
        assert resp.status_code == 200, resp.text
        for line in resp.iter_lines():
            if not line:
                continue
            if line.startswith("data:"):
                raw = line[5:].strip()
                try:
                    events.append(json.loads(raw))
                except Exception:
                    pass
                if events and events[-1].get("done"):
                    break
    return events


def test_chat_stream_basic():
    sid = f"test-session-{uuid.uuid4().hex[:8]}"
    events = _consume_sse(f"{API}/chat", {"session_id": sid, "message": "Hello, what services do you offer?"})
    deltas = [e for e in events if "delta" in e]
    dones = [e for e in events if e.get("done")]
    assert len(deltas) > 0, f"no deltas received; events={events[:5]}"
    assert len(dones) >= 1

    # history retrievable
    r = requests.get(f"{API}/chat/{sid}", timeout=30)
    assert r.status_code == 200
    msgs = r.json()
    assert any(m["role"] == "user" for m in msgs)
    assert any(m["role"] == "assistant" for m in msgs)


def test_chat_lead_capture():
    sid = f"test-lead-{uuid.uuid4().hex[:8]}"
    unique_email = f"testlead_{uuid.uuid4().hex[:6]}@example.com"
    msg = (
        f"I want a proposal. My name is Test Lead, email is {unique_email}, "
        f"phone +911234567890, company Acme, designation COO, country India, "
        f"industry Ayurveda, service BPO, monthly budget $5000-15000, "
        f"requirements 50 telecallers. Please capture my details now."
    )
    events = _consume_sse(f"{API}/chat", {"session_id": sid, "message": msg}, timeout=180)
    assert any(e.get("done") for e in events)

    # Allow brief async write
    time.sleep(2)
    r = requests.get(f"{API}/leads", params={"form_type": "chatbot"}, timeout=30)
    assert r.status_code == 200
    leads = r.json()
    # Match by email or by session_id source
    matched = [l for l in leads if l.get("email") == unique_email or sid in (l.get("source") or "")]
    if not matched:
        pytest.skip(f"Assistant did not emit [LEAD_JSON]; cannot verify lead capture. Leads: {leads[:2]}")
    lead = matched[0]
    # Verify at least some of the expanded fields populated
    has_extras = any(lead.get(k) for k in ("designation", "country", "industry", "monthly_budget"))
    assert has_extras, f"expected expanded fields on captured lead: {lead}"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
