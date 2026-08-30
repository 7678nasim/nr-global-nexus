import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Target,
} from "lucide-react";
import { api } from "@/lib/site";

const CaseStudies = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  api.get("/case-studies")
    .then((r) => {
      const data = r?.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.case_studies)
        ? data.case_studies
        : Array.isArray(data?.caseStudies)
        ? data.caseStudies
        : [];

      setItems(list);
    })
    .catch(() => {
      setItems([]);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

  const caseStudies = useMemo(() => {
    return items.map((cs, index) => ({
      ...cs,
      _index: index,
      title: cs.client || cs.title || cs.name || "Client engagement",
      industry: cs.industry || cs.vertical || "Business Operations",
      service: cs.service || cs.services || "Business Support",
      image: cs.image || cs.cover_image || cs.coverImage || "",
      result: cs.result || cs.outcome || cs.summary || "",
      metric: cs.metric || "",
      metricLabel: cs.metric_label || cs.metricLabel || "",
      challenge: cs.challenge || cs.problem || "",
      approach: cs.approach || cs.solution || "",
      execution: cs.execution || cs.implementation || "",
      outcome: cs.outcome || cs.result || "",
    }));
  }, [items]);

  return (
    <div
      data-testid="case-studies-page"
      className="bg-white text-[#0A192F]"
    >
      {/* HERO */}
      <section className="pt-36 pb-20 bg-white">
        <div className="nx-container">
          <div className="max-w-5xl">
            <p className="nx-pill">Case Studies</p>

            <h1 className="font-display text-5xl md:text-7xl mt-6 tracking-tight leading-[1.02]">
              Outcomes,
              <br />
              <span className="text-[#0A58CA]">not promises.</span>
            </h1>

            <p className="text-[#0A192F]/70 mt-7 max-w-2xl text-base md:text-lg leading-7">
              Real engagements, practical execution and measurable business
              outcomes — presented with the clarity decision-makers expect.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0A192F]/10 bg-[#F8FAFC] px-4 py-2 text-sm text-[#0A192F]/70">
                <Target size={15} className="text-[#0A58CA]" />
                Business-focused execution
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#0A192F]/10 bg-[#F8FAFC] px-4 py-2 text-sm text-[#0A192F]/70">
                <BarChart3 size={15} className="text-[#0A58CA]" />
                Measurable outcomes
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#0A192F]/10 bg-[#F8FAFC] px-4 py-2 text-sm text-[#0A192F]/70">
                <CheckCircle2 size={15} className="text-[#0A58CA]" />
                Delivery-led approach
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="pb-28">
        <div className="nx-container">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#0A192F]/10 overflow-hidden animate-pulse"
                >
                  <div className="aspect-[16/9] bg-[#F1F5F9]" />
                  <div className="p-8">
                    <div className="h-3 w-24 bg-[#E2E8F0] rounded mb-5" />
                    <div className="h-7 w-2/3 bg-[#E2E8F0] rounded mb-4" />
                    <div className="h-4 w-full bg-[#E2E8F0] rounded mb-2" />
                    <div className="h-4 w-5/6 bg-[#E2E8F0] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : caseStudies.length > 0 ? (
            <div className="space-y-8">
              {caseStudies.map((cs, i) => (
                <article
                  key={cs.id || `${cs.title}-${i}`}
                  data-testid={`case-study-${cs.id || i}`}
                  className="group rounded-2xl border border-[#0A192F]/10 bg-white overflow-hidden shadow-[0_12px_40px_rgba(10,25,47,0.05)] hover:shadow-[0_20px_60px_rgba(10,25,47,0.09)] transition-all duration-500"
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 ${
                      i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
                    }`}
                  >
                    {/* IMAGE */}
                    <div className="lg:col-span-5 min-h-[280px] lg:min-h-[440px] bg-[#F1F5F9] overflow-hidden">
                      {cs.image ? (
                        <img
                          src={cs.image}
                          alt={cs.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-10">
                          <div className="text-center">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0A58CA]/10 text-[#0A58CA] flex items-center justify-center">
                              <BarChart3 size={24} />
                            </div>
                            <p className="mt-4 text-sm text-[#0A192F]/45">
                              Client engagement
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="lg:col-span-7 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#0A192F]/45">
                        <span>{cs.industry}</span>
                        <span>•</span>
                        <span>{cs.service}</span>
                      </div>

                      <h2 className="font-display text-3xl md:text-4xl mt-4 tracking-tight">
                        {cs.title}
                      </h2>

                      {cs.result && (
                        <p className="text-[#0A192F]/70 mt-5 text-base leading-7 max-w-2xl">
                          {cs.result}
                        </p>
                      )}

                      {/* METRIC — ONLY IF ACTUAL DATA EXISTS */}
                      {cs.metric && (
                        <div className="mt-7 pt-7 border-t border-[#0A192F]/10">
                          <div className="flex items-end gap-4">
                            <div className="font-display text-5xl md:text-6xl text-[#0A58CA] tracking-tight">
                              {cs.metric}
                            </div>

                            {cs.metricLabel && (
                              <div className="text-xs uppercase tracking-[0.15em] text-[#0A192F]/50 pb-2">
                                {cs.metricLabel}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* CHALLENGE / APPROACH / EXECUTION / OUTCOME */}
                      {(cs.challenge ||
                        cs.approach ||
                        cs.execution ||
                        cs.outcome) && (
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {cs.challenge && (
                            <div>
                              <p className="text-xs uppercase tracking-[0.15em] text-[#0A58CA] font-semibold">
                                Challenge
                              </p>
                              <p className="text-sm text-[#0A192F]/65 mt-2 leading-6">
                                {cs.challenge}
                              </p>
                            </div>
                          )}

                          {cs.approach && (
                            <div>
                              <p className="text-xs uppercase tracking-[0.15em] text-[#0A58CA] font-semibold">
                                Approach
                              </p>
                              <p className="text-sm text-[#0A192F]/65 mt-2 leading-6">
                                {cs.approach}
                              </p>
                            </div>
                          )}

                          {cs.execution && (
                            <div>
                              <p className="text-xs uppercase tracking-[0.15em] text-[#0A58CA] font-semibold">
                                Execution
                              </p>
                              <p className="text-sm text-[#0A192F]/65 mt-2 leading-6">
                                {cs.execution}
                              </p>
                            </div>
                          )}

                          {cs.outcome && (
                            <div>
                              <p className="text-xs uppercase tracking-[0.15em] text-[#0A58CA] font-semibold">
                                Outcome
                              </p>
                              <p className="text-sm text-[#0A192F]/65 mt-2 leading-6">
                                {cs.outcome}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <Link
                        to={`/contact?form=proposal${
                          cs.industry
                            ? `&industry=${encodeURIComponent(cs.industry)}`
                            : ""
                        }`}
                        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#0A58CA] group/link"
                      >
                        Discuss a similar engagement
                        <ArrowUpRight
                          size={15}
                          className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* PROFESSIONAL EMPTY STATE */
            <div className="rounded-2xl border border-[#0A192F]/10 bg-[#F8FAFC] px-6 py-16 md:px-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-[#0A192F]/10 flex items-center justify-center text-[#0A58CA]">
                <BarChart3 size={26} />
              </div>

              <p className="text-xs uppercase tracking-[0.18em] text-[#0A58CA] mt-6 font-semibold">
                Selected engagements
              </p>

              <h2 className="font-display text-3xl md:text-4xl mt-3 tracking-tight">
                Case studies are being curated.
              </h2>

              <p className="text-[#0A192F]/60 max-w-xl mx-auto mt-4 leading-7">
                We are preparing verified engagement details and outcomes for
                publication. This section will display client work once the
                underlying case-study records are available.
              </p>

              <Link
                to="/contact?form=proposal"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#0A58CA] text-white px-5 py-3 text-sm font-semibold hover:bg-[#084DAF] transition-colors"
              >
                Discuss your requirement
                <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;