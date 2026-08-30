import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Target,
  Layers3,
  BarChart3,
} from "lucide-react";
import { api } from "@/lib/site";

const CaseStudies = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api
      .get("/case-studies")
      .then((response) => {
        if (!mounted) return;

        const data = response?.data;

        /*
         * The API may return:
         * 1. An array
         * 2. { caseStudies: [] }
         * 3. { items: [] }
         * 4. { data: [] }
         * 5. { results: [] }
         */

        let normalized = [];

        if (Array.isArray(data)) {
          normalized = data;
        } else if (Array.isArray(data?.caseStudies)) {
          normalized = data.caseStudies;
        } else if (Array.isArray(data?.items)) {
          normalized = data.items;
        } else if (Array.isArray(data?.data)) {
          normalized = data.data;
        } else if (Array.isArray(data?.results)) {
          normalized = data.results;
        }

        setItems(normalized);
      })
      .catch(() => {
        if (!mounted) return;
        setItems([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const getValue = (item, keys, fallback = "") => {
    for (const key of keys) {
      if (
        item &&
        item[key] !== undefined &&
        item[key] !== null &&
        String(item[key]).trim() !== ""
      ) {
        return item[key];
      }
    }

    return fallback;
  };

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
          <p className="nx-pill">Case Studies</p>

          <h1 className="font-display text-5xl md:text-7xl mt-5 max-w-5xl tracking-tight text-[#0A192F]">
            Outcomes that show{" "}
            <span className="text-[#0A58CA]">how we work.</span>
          </h1>

          <p className="text-[#0A192F]/70 mt-6 max-w-2xl text-base md:text-lg leading-8">
            Real engagements, practical execution and measurable business
            outcomes. Explore how NR Global Nexus supports teams across
            different industries and operating environments.
          </p>
        </div>
      </section>

      {/* =========================================================
          CASE STUDIES
      ========================================================= */}
      <section className="pb-24">
        <div className="nx-container">

          {/* LOADING */}
          {loading && (
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#0A192F]/10 overflow-hidden animate-pulse"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-5 min-h-[300px] bg-[#0A192F]/5" />

                    <div className="lg:col-span-7 p-8 md:p-12">
                      <div className="h-4 w-32 bg-[#0A192F]/10 rounded mb-5" />
                      <div className="h-10 w-2/3 bg-[#0A192F]/10 rounded mb-5" />
                      <div className="h-4 w-full bg-[#0A192F]/10 rounded mb-3" />
                      <div className="h-4 w-5/6 bg-[#0A192F]/10 rounded mb-8" />
                      <div className="h-16 w-32 bg-[#0A58CA]/10 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && items.length === 0 && (
            <div className="rounded-2xl border border-[#0A192F]/10 bg-[#F8FAFC] px-6 py-16 md:px-12 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#0A58CA]/10 text-[#0A58CA] flex items-center justify-center">
                <Layers3 size={24} />
              </div>

              <h2 className="font-display text-3xl md:text-4xl mt-6 text-[#0A192F]">
                Case studies are being prepared.
              </h2>

              <p className="text-[#0A192F]/65 max-w-xl mx-auto mt-4 leading-7">
                We are preparing verified engagement details and outcome
                records for publication. This section will display client
                work once the underlying case-study records are available.
              </p>

              <Link
                to="/contact?form=proposal"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#0A58CA] px-5 py-3 text-sm font-medium text-white hover:bg-[#084AAB] transition-colors"
              >
                Discuss your requirement
                <ArrowRight size={15} />
              </Link>
            </div>
          )}

          {/* CASE STUDY LIST */}
          {!loading && items.length > 0 && (
            <div className="space-y-8">
              {items.map((cs, index) => {
                const id = getValue(
                  cs,
                  ["id", "_id", "slug"],
                  `case-${index + 1}`
                );

                const client = getValue(
                  cs,
                  ["client", "title", "name", "company"],
                  "Client engagement"
                );

                const industry = getValue(
                  cs,
                  ["industry", "vertical", "sector"],
                  "Business Operations"
                );

                const service = getValue(
                  cs,
                  ["service", "services", "service_name"],
                  "Business Support"
                );

                const image = getValue(
                  cs,
                  ["image", "cover_image", "coverImage", "image_url"],
                  ""
                );

                const result = getValue(
                  cs,
                  ["result", "outcome", "summary", "description"],
                  ""
                );

                const metric = getValue(
                  cs,
                  ["metric", "value", "headline_metric"],
                  ""
                );

                const metricLabel = getValue(
                  cs,
                  ["metric_label", "metricLabel", "metric_description"],
                  ""
                );

                const challenge = getValue(
                  cs,
                  ["challenge", "problem", "pain_point"],
                  ""
                );

                const approach = getValue(
                  cs,
                  ["approach", "solution", "our_approach"],
                  ""
                );

                const execution = getValue(
                  cs,
                  ["execution", "implementation", "delivery"],
                  ""
                );

                const outcome = getValue(
                  cs,
                  ["outcome", "result", "impact"],
                  result
                );

                const isReversed = index % 2 === 1;

                return (
                  <article
                    key={id}
                    data-testid={`case-study-${id}`}
                    className="group overflow-hidden rounded-2xl border border-[#0A192F]/10 bg-white shadow-[0_10px_40px_rgba(10,25,47,0.04)] hover:shadow-[0_18px_55px_rgba(10,25,47,0.08)] transition-shadow duration-500"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12">

                      {/* IMAGE */}
                      <div
                        className={`lg:col-span-5 min-h-[300px] lg:min-h-[480px] overflow-hidden bg-[#F3F6FA] ${
                          isReversed ? "lg:order-2" : ""
                        }`}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={client}
                            className="w-full h-full min-h-[300px] lg:min-h-[480px] object-cover group-hover:scale-[1.03] transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full min-h-[300px] lg:min-h-[480px] flex items-center justify-center bg-gradient-to-br from-[#F1F5F9] to-[#E8EEF6]">
                            <BarChart3
                              size={54}
                              strokeWidth={1.2}
                              className="text-[#0A58CA]/35"
                            />
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}
                      <div
                        className={`lg:col-span-7 p-7 md:p-10 lg:p-12 flex flex-col justify-center ${
                          isReversed ? "lg:order-1" : ""
                        }`}
                      >
                        {/* CATEGORY */}
                        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#0A192F]/50">
                          <span>{industry}</span>

                          <span className="text-[#0A192F]/25">•</span>

                          <span>{service}</span>
                        </div>

                        {/* CLIENT */}
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-4 text-[#0A192F] tracking-tight">
                          {client}
                        </h2>

                        {/* RESULT */}
                        {result && (
                          <p className="text-[#0A192F]/70 mt-5 text-base md:text-lg leading-8 max-w-2xl">
                            {result}
                          </p>
                        )}

                        {/* METRIC */}
                        {(metric || metricLabel) && (
                          <div className="mt-7 inline-flex items-end gap-4">
                            {metric && (
                              <div className="font-display text-5xl md:text-6xl tracking-tight text-[#0A58CA]">
                                {metric}
                              </div>
                            )}

                            {metricLabel && (
                              <p className="text-xs uppercase tracking-[0.16em] text-[#0A192F]/50 pb-2 max-w-[180px]">
                                {metricLabel}
                              </p>
                            )}
                          </div>
                        )}

                        {/* DETAIL GRID */}
                        {(challenge ||
                          approach ||
                          execution ||
                          outcome) && (
                          <div className="mt-9 grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* CHALLENGE */}
                            {challenge && (
                              <div className="rounded-xl border border-[#0A192F]/8 bg-[#F8FAFC] p-5">
                                <div className="flex items-center gap-2 text-[#0A58CA]">
                                  <Target size={17} />
                                  <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                                    Challenge
                                  </span>
                                </div>

                                <p className="text-sm text-[#0A192F]/65 mt-3 leading-6">
                                  {challenge}
                                </p>
                              </div>
                            )}

                            {/* APPROACH */}
                            {approach && (
                              <div className="rounded-xl border border-[#0A192F]/8 bg-[#F8FAFC] p-5">
                                <div className="flex items-center gap-2 text-[#0A58CA]">
                                  <Layers3 size={17} />
                                  <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                                    Our Approach
                                  </span>
                                </div>

                                <p className="text-sm text-[#0A192F]/65 mt-3 leading-6">
                                  {approach}
                                </p>
                              </div>
                            )}

                            {/* EXECUTION */}
                            {execution && (
                              <div className="rounded-xl border border-[#0A192F]/8 bg-[#F8FAFC] p-5">
                                <div className="flex items-center gap-2 text-[#0A58CA]">
                                  <CheckCircle2 size={17} />
                                  <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                                    Execution
                                  </span>
                                </div>

                                <p className="text-sm text-[#0A192F]/65 mt-3 leading-6">
                                  {execution}
                                </p>
                              </div>
                            )}

                            {/* OUTCOME */}
                            {outcome && (
                              <div className="rounded-xl border border-[#0A58CA]/15 bg-[#0A58CA]/[0.035] p-5">
                                <div className="flex items-center gap-2 text-[#0A58CA]">
                                  <BarChart3 size={17} />
                                  <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                                    Outcome
                                  </span>
                                </div>

                                <p className="text-sm text-[#0A192F]/70 mt-3 leading-6">
                                  {outcome}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* CTA */}
                        <Link
                          to="/contact?form=proposal"
                          className="mt-8 inline-flex w-fit items-center gap-2 text-sm text-[#0A58CA] font-semibold group/link"
                        >
                          Discuss a similar requirement
                          <ArrowUpRight
                            size={16}
                            className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                          />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          BOTTOM CTA
      ========================================================= */}
      <section className="pb-24">
        <div className="nx-container">
          <div className="rounded-2xl bg-[#0A192F] px-7 py-12 md:px-12 md:py-14 text-white overflow-hidden relative">
            <div className="relative z-10 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Your next engagement
              </p>

              <h2 className="font-display text-3xl md:text-5xl mt-4 tracking-tight">
                Have a business challenge worth solving?
              </h2>

              <p className="text-white/65 mt-5 max-w-2xl leading-7">
                Tell us what you are trying to improve, scale or operationalise.
                We will help define a practical delivery path around your
                requirements.
              </p>

              <Link
                to="/contact?form=proposal"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#0A192F] hover:bg-white/90 transition-colors"
              >
                Request a proposal
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="absolute -right-24 -bottom-32 w-80 h-80 rounded-full border border-white/10" />
            <div className="absolute -right-10 -bottom-20 w-56 h-56 rounded-full border border-white/10" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;