import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Clock, ArrowRight } from "lucide-react";
import { api } from "@/lib/site";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [cats, setCats] = useState([]);
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    api.get("/blog/categories").then(r => setCats(["all", ...r.data])).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      api.get("/blog", { params: { category: cat === "all" ? undefined : cat, q: q || undefined } })
        .then(r => setPosts(r.data)).catch(() => {});
    }, 200);
    return () => clearTimeout(t);
  }, [cat, q]);

  return (
    <div data-testid="blog-page">
      <section className="pt-36 pb-12 bg-white">
        <div className="nx-container">
          <p className="nx-pill">Insights & Playbooks</p>
          <h1 className="font-display text-5xl md:text-7xl mt-5 max-w-4xl tracking-tight text-[#0A192F]">From the field — <span className="text-[#0A58CA]">straight to your inbox.</span></h1>
        </div>
      </section>
      <section className="pb-20">
        <div className="nx-container">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center mb-8">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A192F]/40"/>
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search articles…" data-testid="blog-search" className="w-full pl-9 pr-3 py-2.5 border border-[var(--nx-line)] rounded-md text-sm focus:border-[#0A58CA] outline-none"/>
            </div>
            <div className="flex flex-wrap gap-2">
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)} data-testid={`blog-cat-${c.toLowerCase().replace(/\s/g, "-")}`} className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${cat === c ? "bg-[#0A192F] text-white border-[#0A192F]" : "border-[var(--nx-line)] text-[#0A192F]"}`}>
                  {c === "all" ? "All" : c}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(p => (
              <Link to={`/blog/${p.slug}`} key={p.slug} data-testid={`blog-post-${p.slug}`} className="nx-card rounded-xl overflow-hidden block">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-[11px] text-[#0A192F]/55 uppercase tracking-widest">
                    <span>{p.category}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={11}/>{p.reading_time} min</span>
                  </div>
                  <h3 className="font-display text-xl mt-3 text-[#0A192F] leading-tight">{p.title}</h3>
                  <p className="text-sm text-[#0A192F]/65 mt-2 line-clamp-2">{p.excerpt}</p>
                  <span className="mt-4 text-sm text-[#0A58CA] inline-flex items-center gap-1 font-medium">Read article <ArrowRight size={13}/></span>
                </div>
              </Link>
            ))}
          </div>
          {posts.length === 0 && <p className="text-center text-[#0A192F]/55 py-20">No posts found.</p>}
        </div>
      </section>
    </div>
  );
};
export default Blog;
