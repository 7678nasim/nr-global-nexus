import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Layers3,
  Target,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { api } from "@/lib/site";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1400&q=85";

const getFirst = (...values) => {
  for (const value of values) {
    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return value;
    }
  }
  return "";
};

const normalizeCaseStudies = (payload) => {
  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.case_studies)) return payload.case_studies;
  if (Array.isArray(payload?.caseStudies)) return payload.caseStudies;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
};

const normalizeCaseStudy = (item, index) => {
  const client = getFirst(
    item?.client,
    item?.client_name,
    item?.clientName,
    item?.title,
    item?.name,
    "Client engagement"
  );

  const industry = getFirst(
    item?.industry,
    item?.vertical,
    item?.sector,
    item?.category,
    "Business Operations"
  );

  const service = getFirst(
    item?.service,
    item?.services,
    item?.service_name,
    item?.serviceName,
    "Business Support"
  );

  const challenge = getFirst(
    item?.challenge,
    item?.problem,
    item?.pain_point,
    item?.painPoint,
    item?.brief
  );

  const approach = getFirst(
    item?.approach,
    item?.solution,
    item?.methodology,
    item?.strategy
  );

  const execution = getFirst(
    item?.execution,
    item?.implementation,
    item?.delivery,
    item?.implementation_details
  );

  const outcome = getFirst(
    item?.outcome,
    item?.result,
    item?.summary,
    item?.description
  );

  const metric = getFirst(
    item?.metric,
    item?.value,
    item?.metric_value,
    item?.metricValue
  );

  const metricLabel = getFirst(
    item?.metric_label,
    item?.metricLabel,
    item?.metric_name,
    item?.metricName
  );

  const image = getFirst(
    item?.image,
    item?.cover_image,
    item?.coverImage,
    item?.image_url,
    item?.imageUrl,
    FALLBACK_IMAGE
  );

  return {
    id: getFirst(item?.id, item?._id, item?.slug, `case-${index}`),
    client,
    industry,
    service,
    challenge,
    approach,
    execution,
    outcome,
    metric,
    metricLabel,
    image,
  };
};

const DetailBlock = ({ icon: Icon, label, text }) => {
  if (!text) return null;

  return (
    <div className="mt-7">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0A58CA]">
        <Icon size={15} strokeWidth={2} />
        <span>{label}</span>
      </div>

      <p className="mt-2 text-[15px] leading-7 text-[#0A192F]/70">
        {text}
      </p>
    </div>
  );
};

const CaseStudies = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadCaseStudies = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await api.get("/case-studies");

        if (!active) return;

        const payload = response?.data;
        const records = normalizeCaseStudies(payload);
        const normalized = records.map(normalizeCaseStudy);

        setItems(normalized);
      } catch (err) {
        if (!active) return;

        console.error("Case studies could not be loaded:", err);
        setItems([]);
        setError(true);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCaseStudies();

    return () => {
      active = false;
    };
  }, []);

  const caseStudies = useMemo(() => items, [items]);

  return (
    <div
      data-testid="case-studies-page"
      className="min-h-screen bg-white"
    >
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-white pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="pointer-events-none absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-[#0A58CA]/[0.035] blur-3xl" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[300px] w-[300px] rounded-full bg-[#0A58CA]/[0.025] blur-3xl" />

        <div className="nx-container relative">
          <div className="max-w-5xl">
            <p className="nx-pill">Case Studies</p>

            <h1 className="font-display mt-6 max-w-5xl text-5xl leading-[0.98] tracking-[-0.04em] text-[#0A192F] md:text-7xl lg:text-[82px]">
              Outcomes that show{" "}
              <span className="text-[#0A58CA]">how we work.</span>
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-7 text-[#0A192F]/65 md:text-lg md:leading-8">
              Real engagements, practical execution and measurable business
              outcomes. Explore how NR Global Nexus supports teams across
              different industries and operating environments.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0A192F]/10 bg-white px-4 py-2.5 text-sm text-[#0A192F]/70 shadow-sm">
                <Target size={15} className="text-[#0A58CA]" />
                Business-focused execution
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#0A192F]/10 bg-white px-4 py-2.5 text-sm text-[#0A192F]/70 shadow-sm">
                <BarChart3 size={15} className="text-[#0A58CA]" />
                Measurable outcomes
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#0A192F]/10 bg-white px-4 py-2.5 text-sm text-[#0A192F]/70 shadow-sm">
                <Workflow size={15} className="text-[#0A58CA]" />
                Delivery-led approach
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CASE STUDIES
      ========================================================= */}
      <section className="pb-24 md:pb-28">
        <div className="nx-container">
          {/* TOP LABEL */}
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0A58CA]">
                Selected engagements
              </p>

              <h2 className="font-display mt-2 text-3xl tracking-tight text-[#0A192F] md:text-4xl">
                Work built around business reality.
              </h2>
            </div>

            {!loading && caseStudies.length > 0 && (
              <div className="hidden items-center gap-2 text-sm text-[#0A192F]/45 md:flex">
                <CheckCircle2 size={15} />
                {caseStudies.length} published engagement
                {caseStudies.length === 1 ? "" : "s"}
              </div>
            )}
          </div>

          {/* LOADING */}
          {loading && (
            <div
              data-testid="case-studies-loading"
              className="overflow-hidden rounded-2xl border border-[#0A192F]/10 bg-[#F7F9FC]"
            >
              <div className="grid min-h-[480px] grid-cols-1 lg:grid-cols-12">
                <div className="animate-pulse bg-[#EAF0F7] lg:col-span-5" />

                <div className="flex flex-col justify-center p-8 md:p-12 lg:col-span-7">
                  <div className="h-4 w-36 animate-pulse rounded bg-[#E2E8F0]" />
                  <div className="mt-5 h-10 w-3/4 animate-pulse rounded bg-[#E2E8F0]" />
                  <div className="mt-8 h-4 w-full animate-pulse rounded bg-[#E2E8F0]" />
                  <div className="mt-3 h-4 w-5/6 animate-pulse rounded bg-[#E2E8F0]" />
                  <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-[#E2E8F0]" />

                  <div className="mt-10 h-16 w-44 animate-pulse rounded bg-[#E2E8F0]" />
                </div>
              </div>
            </div>
          )}

          {/* ERROR / EMPTY */}
          {!loading && caseStudies.length === 0 && (
            <div
              data-testid="case-studies-empty"
              className="relative overflow-hidden rounded-2xl border border-[#0A192F]/10 bg-[#F7F9FC]"
            >
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#0A58CA]/5 blur-3xl" />

              <div className="relative mx-auto max-w-3xl px-6 py-20 text-center md:px-10 md:py-24">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#0A58CA]/15 bg-white text-[#0A58CA] shadow-sm">
                  <Layers3 size={27} strokeWidth={1.7} />
                </div>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-[#0A58CA]">
                  Selected engagements
                </p>

                <h2 className="font-display mt-3 text-3xl tracking-tight text-[#0A192F] md:text-4xl">
                  {error
                    ? "Case studies are temporarily unavailable."
                    : "Published case studies are coming soon."}
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[#0A192F]/60">
                  {error
                    ? "We could not retrieve the engagement records right now. You can still share your requirement with our team and we will discuss the right delivery model."
                    : "We publish engagement details only when the underlying records are ready and appropriate to present. No unverified client names, claims or performance figures are used."}
                </p>

                <Link
                  to="/contact?form=proposal"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#0A58CA] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(10,88,202,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#084AAB]"
                >
                  Discuss your requirement
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}

          {/* CASE STUDY LIST */}
          {!loading && caseStudies.length > 0 && (
            <div className="space-y-8">
              {caseStudies.map((cs, index) => (
                <article
                  key={cs.id}
                  data-testid={`case-study-${cs.id}`}
                  className="group overflow-hidden rounded-2xl border border-[#0A192F]/10 bg-white shadow-[0_12px_50px_rgba(10,25,47,0.045)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(10,25,47,0.09)]"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* IMAGE */}
                    <div
                      className={`relative min-h-[300px] overflow-hidden bg-[#EAF0F7] lg:col-span-5 lg:min-h-[560px] ${
                        index % 2 === 1 ? "lg:order-2" : ""
                      }`}
                    >
                      <img
                        src={cs.image || FALLBACK_IMAGE}
                        alt={cs.client}
                        loading={index > 1 ? "lazy" : "eager"}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/45 via-transparent to-transparent opacity-80" />

                      <div className="absolute left-6 top-6 rounded-full border border-white/25 bg-[#071426]/65 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div
                      className={`flex flex-col justify-center p-7 md:p-10 lg:col-span-7 lg:p-14 ${
                        index % 2 === 1 ? "lg:order-1" : ""
                      }`}
                    >
                      {/* META */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-[0.13em] text-[#0A192F]/45">
                        {cs.industry && <span>{cs.industry}</span>}

                        {cs.industry && cs.service && (
                          <span className="h-1 w-1 rounded-full bg-[#0A192F]/25" />
                        )}

                        {cs.service && <span>{cs.service}</span>}
                      </div>

                      {/* TITLE */}
                      <h2 className="font-display mt-4 max-w-2xl text-3xl leading-tight tracking-[-0.025em] text-[#0A192F] md:text-4xl">
                        {cs.client}
                      </h2>

                      {/* OUTCOME */}
                      {cs.outcome && (
                        <p className="mt-5 max-w-2xl text-base leading-7 text-[#0A192F]/70 md:text-[17px] md:leading-8">
                          {cs.outcome}
                        </p>
                      )}

                      {/* METRIC */}
                      {cs.metric && (
                        <div className="mt-8 flex items-end gap-4 border-y border-[#0A192F]/10 py-6">
                          <div className="font-display text-5xl leading-none tracking-tight text-[#0A58CA] md:text-6xl">
                            {cs.metric}
                          </div>

                          {cs.metricLabel && (
                            <div className="max-w-[180px] pb-1 text-xs font-semibold uppercase leading-5 tracking-[0.15em] text-[#0A192F]/45">
                              {cs.metricLabel}
                            </div>
                          )}

                          {!cs.metricLabel && (
                            <TrendingUp
                              size={22}
                              className="mb-1 text-[#0A58CA]"
                            />
                          )}
                        </div>
                      )}

                      {/* DETAILS */}
                      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                        <DetailBlock
                          icon={Target}
                          label="Challenge"
                          text={cs.challenge}
                        />

                        <DetailBlock
                          icon={Layers3}
                          label="Approach"
                          text={cs.approach}
                        />

                        <DetailBlock
                          icon={Workflow}
                          label="Execution"
                          text={cs.execution}
                        />

                        <DetailBlock
                          icon={CheckCircle2}
                          label="Outcome"
                          text={cs.outcome}
                        />
                      </div>

                      {/* CTA */}
                      <div className="mt-9">
                        <Link
                          to="/contact?form=proposal"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A58CA] transition-all duration-300 hover:gap-3"
                        >
                          Discuss a similar requirement
                          <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="pb-24 md:pb-28">
        <div className="nx-container">
          <div className="relative overflow-hidden rounded-2xl bg-[#081A33] px-7 py-12 md:px-12 md:py-16 lg:px-16">
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/[0.08]" />
            <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/[0.07]" />

            <div className="relative max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                Your next engagement
              </p>

              <h2 className="font-display mt-5 text-4xl leading-tight tracking-tight text-white md:text-5xl">
                Have a business challenge worth solving?
              </h2>

              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/60 md:text-base">
                Tell us what you are trying to improve, scale or operationalise.
                We will help define a practical delivery path around your
                requirements.
              </p>

              <Link
                to="/contact?form=proposal"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3.5 text-sm font-semibold text-[#081A33] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/95"
              >
                Request a proposal
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;