import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Calendar, Share2, Twitter, Linkedin, Facebook, ArrowLeft, ArrowRight } from "lucide-react";
import { api } from "@/lib/site";

const renderMarkdown = (md) => {
  // Light markdown-to-html — just for our seeded content
  const lines = md.split(/\r?\n/);
  let html = "";
  let inList = false;
  let inOl = false;
  for (let raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (inList) { html += "</ul>"; inList = false; }
      if (inOl) { html += "</ol>"; inOl = false; }
      html += "";
      continue;
    }
    const closeLists = () => {
      if (inList) { html += "</ul>"; inList = false; }
      if (inOl) { html += "</ol>"; inOl = false; }
    };
    if (line.startsWith("### ")) { closeLists(); html += `<h3>${line.slice(4)}</h3>`; continue; }
    if (line.startsWith("## ")) { closeLists(); html += `<h2>${line.slice(3)}</h2>`; continue; }
    if (/^\d+\.\s/.test(line)) {
      if (!inOl) { closeLists(); html += "<ol>"; inOl = true; }
      html += `<li>${formatInline(line.replace(/^\d+\.\s/, ""))}</li>`;
      continue;
    }
    if (line.startsWith("- ")) {
      if (!inList) { closeLists(); html += "<ul>"; inList = true; }
      html += `<li>${formatInline(line.slice(2))}</li>`;
      continue;
    }
    closeLists();
    html += `<p>${formatInline(line)}</p>`;
  }
  if (inList) html += "</ul>";
  if (inOl) html += "</ol>";
  return html;
};
const formatInline = (s) =>
  s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

const BlogDetail = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => {
    setData(null);
    window.scrollTo(0, 0);
    api.get(`/blog/${slug}`).then(r => setData(r.data)).catch(() => {});
  }, [slug]);

  if (!data) return <div className="pt-40 pb-32 text-center text-[#0A192F]/55">Loading…</div>;
  const { post, related } = data;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div data-testid="blog-detail-page">
      <article className="pt-32 pb-12 bg-white">
        <div className="nx-container max-w-4xl">
          <Link to="/blog" className="text-sm text-[#0A58CA] inline-flex items-center gap-1 mb-6"><ArrowLeft size={14}/> Back to Blog</Link>
          <span className="nx-pill">{post.category}</span>
          <h1 className="font-display text-4xl md:text-6xl mt-5 tracking-tight text-[#0A192F]">{post.title}</h1>
          <div className="flex flex-wrap gap-x-5 gap-y-2 items-center text-xs text-[#0A192F]/55 mt-5">
            <span className="inline-flex items-center gap-1"><Calendar size={12}/>{new Date(post.created_at).toLocaleDateString()}</span>
            <span className="inline-flex items-center gap-1"><Clock size={12}/>{post.reading_time} min read</span>
            <span>By {post.author}</span>
          </div>
          {post.cover_image && (
            <img src={post.cover_image} alt={post.title} className="w-full aspect-[16/8] object-cover rounded-2xl mt-8"/>
          )}
          <div className="nx-prose mt-10 text-base" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />

          <div className="flex items-center gap-3 mt-12 pt-6 border-t border-[var(--nx-line)]">
            <span className="text-xs uppercase tracking-widest text-[#0A192F]/60 inline-flex items-center gap-1"><Share2 size={13}/> Share</span>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-[var(--nx-line)] flex items-center justify-center hover:bg-[#0A192F] hover:text-white"><Twitter size={13}/></a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-[var(--nx-line)] flex items-center justify-center hover:bg-[#0A192F] hover:text-white"><Linkedin size={13}/></a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-[var(--nx-line)] flex items-center justify-center hover:bg-[#0A192F] hover:text-white"><Facebook size={13}/></a>
          </div>
        </div>
      </article>

      {related?.length > 0 && (
        <section className="py-20 bg-[#F8F9FA]">
          <div className="nx-container max-w-5xl">
            <h2 className="font-display text-3xl text-[#0A192F]">Related reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {related.map(r => (
                <Link to={`/blog/${r.slug}`} key={r.slug} className="nx-card rounded-xl overflow-hidden block">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={r.cover_image} alt={r.title} className="w-full h-full object-cover"/>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-widest text-[#0A192F]/55">{r.category}</p>
                    <h3 className="font-display text-lg mt-2 text-[#0A192F]">{r.title}</h3>
                    <span className="mt-3 text-xs text-[#0A58CA] inline-flex items-center gap-1">Read <ArrowRight size={12}/></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
export default BlogDetail;
