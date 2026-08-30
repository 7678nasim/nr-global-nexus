import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Target,
  Layers3,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { api } from "@/lib/site";

/*
 * These are the same case-study records currently exposed
 * by the backend /api/case-studies endpoint.
 *
 * They are used as a safe frontend fallback so the page
 * never becomes blank if the API temporarily fails.
 */
const FALLBACK_CASE_STUDIES = [
  {
    id: "fintech-bpo",
    client: "Leading Fintech Platform",
    industry: "Finance",
    service: "BPO + Customer Support",
    result:
      "Reduced customer response time by 68% and scaled support team 4x in 90 days.",
    metric: "68%",
    metric_label: "Faster Response",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
    challenge:
      "The business needed to scale customer support rapidly while maintaining response quality and operational consistency.",
    approach:
      "A dedicated customer-support delivery model was structured around defined workflows, staffing requirements, service levels and ongoing performance monitoring.",
    execution:
      "The support operation was scaled through a dedicated team model with structured processes and performance governance.",
    outcome:
      "Customer response time was reduced by 68%, while the support team scaled 4x within 90 days.",
  },
  {
    id: "ecom-lead-gen",
    client: "DTC E-commerce Brand",
    industry: "E-Commerce",
    service: "Lead Generation + Performance Marketing",
    result:
      "Generated 12,400+ qualified leads in 6 months with a 5.2x ROAS on ad spend.",
    metric: "5.2x",
    metric_label: "ROAS Achieved",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80",
    challenge:
      "The brand needed a scalable acquisition engine capable of generating qualified demand while maintaining marketing efficiency.",
    approach:
      "Lead generation and performance marketing were structured around audience targeting, campaign execution, qualification and ongoing optimisation.",
    execution:
      "Campaign activity was managed as an integrated growth operation with continuous performance review and optimisation.",
    outcome:
      "The engagement generated 12,400+ qualified leads over six months with a reported 5.2x ROAS.",
  },
  {
    id: "health-recruit",
    client: "Multi-specialty Hospital Chain",
    industry: "Healthcare",
    service: "Bulk Recruitment",
    result:
      "Hired 320 healthcare professionals across 7 cities within 45 days.",
    metric: "320",
    metric_label: "Hires in 45 Days",
    image:
      "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=1200&q=80",
    challenge:
      "The hospital group required high-volume recruitment across multiple locations within a compressed hiring window.",
    approach:
      "Recruitment was organised around a focused bulk-hiring model designed for healthcare profiles and multi-location delivery.",
    execution:
      "Candidate sourcing, screening and hiring activity was coordinated across seven cities with a dedicated recruitment operation.",
    outcome:
      "320 healthcare professionals were hired across seven cities within 45 days.",
  },
  {
    id: "ayurveda-distribution",
    client: "Premium Ayurveda Brand",
    industry: "Ayurveda",
    service: "Telemarketing + Distributor Setup",
    result:
      "Built a 140-distributor network across 11 states with a dedicated tele-sales pod in 6 months.",
    metric: "140",
    metric_label: "Distributors Onboarded",
    image:
      "https://images.unsplash.com/photo-1611073615452-04dba8af1d35?w=1200&q=80",
    challenge:
      "The brand needed to expand distribution while creating a structured outbound sales operation to support market development.",
    approach:
      "Distributor development and tele-sales were combined into one coordinated growth model.",
    execution:
      "A dedicated tele-sales operation supported distributor outreach, follow-up and network development across multiple states.",
    outcome:
      "The engagement built a reported network of 140 distributors across 11 states within six months.",
  },
];

const normaliseCaseStudies = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.case_studies)) {
    return data.case_studies;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const enrichCaseStudy = (cs, index) => ({
  id: cs?.id || `case-study-${index}`,
  client:
    cs?.client ||
    cs?.title ||
    cs?.name ||
    "Client engagement",
  industry:
    cs?.industry ||
    cs?.vertical ||
    "Business Operations",
  service:
    cs?.service ||
    cs?.services ||
    "Business Support",
  result:
    cs?.result ||
    cs?.outcome ||
    cs?.summary ||
    "",
  metric:
    cs?.metric ||
    "",
  metric_label:
    cs?.metric_label ||
    cs?.metricLabel ||
    "",
  image:
    cs?.image ||
    cs?.cover_image ||
    cs?.coverImage ||
    "",
  challenge:
    cs?.challenge ||
    "The engagement required a structured delivery model aligned to the client's operational goals.",
  approach:
    cs?.approach ||
    cs?.solution ||
    "A focused delivery model was designed around the required outcomes, workflows and operating priorities.",
  execution:
    cs?.execution ||
    cs?.implementation ||
    "The solution was executed through dedicated resources, defined processes and ongoing performance management.",
  outcome:
    cs?.outcome ||
    cs?.result ||
    cs?.summary ||
    "",
});

const CaseStudies = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCaseStudies = async () => {
      try {
        const response = await api.get("/case-studies");

        const data = normaliseCaseStudies(response?.data);

        if (mounted) {
          setItems(
            data.length > 0
              ? data.map(enrichCaseStudy)
              : FALLBACK_CASE_STUDIES.map(enrichCaseStudy)
          );
        }
      } catch (error) {
        console.error("Case studies API error:", error);

        if (mounted) {
          setItems(FALLBACK_CASE_STUDIES.map(enrichCaseStudy));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCaseStudies();

    return () => {
      mounted = false;
    };
  }, []);

  const caseStudies =
    Array.isArray(items) && items.length > 0
      ? items
      : !loading
      ? FALLBACK_CASE_STUDIES.map(enrichCaseStudy)
      : [];

  return (
    <div
      data-testid="case-studies-page"
      className="bg-white text-[#0A192F]"
    >
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="pt-36 pb-16 bg-white">
        <div className="nx-container">
          <div className="max-w-5xl">
            <p className="nx-pill">Case Studies</p>

            <h1 className="font-display text-5xl md:text-7xl mt-6 tracking-tight leading-[0.98]">
              Outcomes,
              <br />
              <span className="text-[#0A58CA]">not promises.</span>
            </h1>

            <p className="text-[#0A192F]/70 text-lg md:text-xl leading-8 mt-7 max-w-3xl">
              Real engagements, practical execution and measurable business
              outcomes — presented with the clarity decision-makers expect.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0A192F]/10 bg-white px-4 py-2.5 text-sm text-[#0A192F]/75">
                <Target size={15} className="text-[#0A58CA]" />
                Business-focused execution
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#0A192F]/10 bg-white px-4 py-2.5 text-sm text-[#0A192F]/75">
                <BarChart3 size={15} className="text-[#0A58CA]" />
                Measurable outcomes
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#0A192F]/10 bg-white px-4 py-2.5 text-sm text-[#0A192F]/75">
                <CheckCircle2 size={15} className="text-[#0A58CA]" />
                Delivery-led approach
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CASE STUDIES
      ========================================================= */}
      <section className="pb-28">
        <div className="nx-container">
          {loading ? (
            <div className="rounded-2xl border border-[#0A192F]/10 bg-[#F7F9FC] p-12 md:p-20 text-center">
              <div className="mx-auto w-12 h-12 rounded-full border-2 border-[#0A58CA]/20 border-t-[#0A58CA] animate-spin" />

              <p className="mt-6 text-sm text-[#0A192F]/60">
                Loading selected engagements…
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {caseStudies.map((cs, index) => (
                <article
                  key={cs.id}
                  data-testid={`case-study-${cs.id}`}
                  className="group overflow-hidden rounded-2xl border border-[#0A192F]/10 bg-white shadow-[0_10px_40px_rgba(10,25,47,0.04)]"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* IMAGE */}
                    <div
                      className={`lg:col-span-5 min-h-[300px] lg:min-h-[520px] overflow-hidden bg-[#EEF2F7] ${
                        index % 2 === 1
                          ? "lg:order-2"
                          : "lg:order-1"
                      }`}
                    >
                      {cs.image ? (
                        <img
                          src={cs.image}
                          alt={`${cs.client} case study`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Layers3
                            size={48}
                            strokeWidth={1.3}
                            className="text-[#0A58CA]/50"
                          />
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div
                      className={`lg:col-span-7 p-7 md:p-10 lg:p-12 ${
                        index % 2 === 1
                          ? "lg:order-1"
                          : "lg:order-2"
                      }`}
                    >
                      {/* META */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#0A192F]/50">
                        <span>{cs.industry}</span>
                        <span className="text-[#0A58CA]/40">•</span>
                        <span>{cs.service}</span>
                      </div>

                      {/* TITLE */}
                      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight mt-4">
                        {cs.client}
                      </h2>

                      {/* RESULT */}
                      {cs.result && (
                        <p className="text-[#0A192F]/75 text-base md:text-lg leading-7 mt-5 max-w-2xl">
                          {cs.result}
                        </p>
                      )}

                      {/* METRIC */}
                      {cs.metric && (
                        <div className="mt-8 flex items-end gap-4">
                          <div className="text-5xl md:text-6xl font-display font-medium tracking-tight text-[#0A58CA]">
                            {cs.metric}
                          </div>

                          {cs.metric_label && (
                            <div className="pb-2">
                              <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#0A192F]/50">
                                {cs.metric_label}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* DETAIL GRID */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 pt-8 border-t border-[#0A192F]/10">
                        <div>
                          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-semibold text-[#0A58CA]">
                            <Target size={14} />
                            Challenge
                          </div>

                          <p className="text-sm leading-6 text-[#0A192F]/65 mt-3">
                            {cs.challenge}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-semibold text-[#0A58CA]">
                            <Layers3 size={14} />
                            Approach
                          </div>

                          <p className="text-sm leading-6 text-[#0A192F]/65 mt-3">
                            {cs.approach}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-semibold text-[#0A58CA]">
                            <TrendingUp size={14} />
                            Execution
                          </div>

                          <p className="text-sm leading-6 text-[#0A192F]/65 mt-3">
                            {cs.execution}
                          </p>
                        </div>
                      </div>

                      {/* OUTCOME */}
                      {cs.outcome && (
                        <div className="mt-7 rounded-xl bg-[#F5F8FC] border border-[#0A192F]/7 p-5">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-semibold text-[#0A58CA]">
                            <ShieldCheck size={14} />
                            Outcome
                          </div>

                          <p className="text-sm md:text-base leading-6 text-[#0A192F]/70 mt-2">
                            {cs.outcome}
                          </p>
                        </div>
                      )}

                      {/* CTA */}
                      <Link
                        to={`/contact?form=proposal&industry=${encodeURIComponent(
                          cs.industry
                        )}`}
                        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#0A58CA] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#084AAB] hover:gap-3"
                      >
                        Discuss a similar requirement
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* =====================================================
              BOTTOM CTA
          ===================================================== */}
          {!loading && (
            <div className="mt-14 rounded-2xl bg-[#F5F8FC] border border-[#0A192F]/10 p-8 md:p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-white border border-[#0A192F]/10 flex items-center justify-center">
                <BarChart3 size={21} className="text-[#0A58CA]" />
              </div>

              <h2 className="font-display text-3xl md:text-4xl mt-6 tracking-tight">
                Have a similar challenge?
              </h2>

              <p className="text-[#0A192F]/65 max-w-2xl mx-auto mt-4 leading-7">
                Tell us what you are trying to improve, scale or build. We
                will map the requirement to an appropriate delivery model.
              </p>

              <Link
                to="/contact?form=proposal"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#0A58CA] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#084AAB] transition-colors"
              >
                Discuss your requirement
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;