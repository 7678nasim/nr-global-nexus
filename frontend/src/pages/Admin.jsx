import React, { useEffect, useState } from "react";
import { Link, NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { LayoutDashboard, Inbox, Briefcase, Newspaper, LogOut, Download, RefreshCw, Trash2, Plus, Save, ArrowLeft } from "lucide-react";
import { api } from "@/lib/site";
import { toast } from "sonner";

const ADMIN_TOKEN_KEY = "nx_admin_token";

const useAuth = () => {
  const [authed, setAuthed] = useState(!!localStorage.getItem(ADMIN_TOKEN_KEY));
  return {
    authed,
    login: (token) => { localStorage.setItem(ADMIN_TOKEN_KEY, token); setAuthed(true); },
    logout: () => { localStorage.removeItem(ADMIN_TOKEN_KEY); setAuthed(false); },
  };
};

const adminHeaders = () => ({ "X-Admin-Token": localStorage.getItem(ADMIN_TOKEN_KEY) || "" });

const Login = ({ onLogin }) => {
  const [pwd, setPwd] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post("/admin/login", { password: pwd });
      onLogin(r.data.token);
      toast.success("Welcome back.");
    } catch { toast.error("Invalid password."); }
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-32 pb-24 bg-[#F8F9FA]">
      <form onSubmit={submit} className="nx-card rounded-2xl p-8 w-full max-w-sm" data-testid="admin-login">
        <h1 className="font-display text-2xl text-[#0A192F]">Admin Sign-in</h1>
        <p className="text-sm text-[#0A192F]/60 mt-1">NR Global Nexus — internal dashboard</p>
        <input type="password" required value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Admin password" data-testid="admin-password" className="mt-6 w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm focus:border-[#0A58CA] outline-none" />
        <button type="submit" className="nx-btn-primary w-full mt-3 py-2.5 rounded-md text-sm">Sign in</button>
      </form>
    </div>
  );
};

const toCsv = (rows) => {
  if (!rows.length) return "";
  const keys = Array.from(rows.reduce((s, r) => { Object.keys(r).forEach(k => s.add(k)); return s; }, new Set()));
  const esc = (v) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "string" ? v : JSON.stringify(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(","), ...rows.map(r => keys.map(k => esc(r[k])).join(","))].join("\n");
};
const downloadCsv = (rows, name) => {
  const blob = new Blob([toCsv(rows)], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
};

const Leads = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const load = () => api.get("/admin/leads", { headers: adminHeaders() }).then(r => setItems(r.data)).catch(() => toast.error("Failed to load"));
  useEffect(() => { load(); }, []);
  const filtered = filter === "all" ? items : items.filter(i => i.form_type === filter);
  return (
    <div data-testid="admin-leads">
      <div className="flex flex-wrap items-center gap-3 justify-between mb-5">
        <h2 className="font-display text-2xl text-[#0A192F]">Leads <span className="text-sm text-[#0A192F]/50">({filtered.length})</span></h2>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={e => setFilter(e.target.value)} data-testid="leads-filter" className="border border-[var(--nx-line)] rounded-md px-2 py-1.5 text-sm">
            {["all", "proposal", "project_inquiry", "recruitment", "partnership", "consultation", "contact", "chatbot"].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <button onClick={load} className="nx-btn-ghost px-3 py-1.5 rounded-md text-xs inline-flex items-center gap-1"><RefreshCw size={12}/> Reload</button>
          <button onClick={() => downloadCsv(filtered, "leads.csv")} className="nx-btn-primary px-3 py-1.5 rounded-md text-xs inline-flex items-center gap-1"><Download size={12}/> Export CSV</button>
        </div>
      </div>
      <div className="overflow-x-auto nx-card rounded-xl">
        <table className="w-full text-xs">
          <thead className="bg-[#F8F9FA] text-[#0A192F]/60 uppercase tracking-widest">
            <tr>
              {["Date", "Type", "Name", "Company", "Email", "Phone", "Country", "Industry", "Service", "Budget", "Notes"].map(h => <th key={h} className="text-left px-3 py-2.5 whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-t border-[var(--nx-line)] hover:bg-[#F8FAFC]">
                <td className="px-3 py-2 whitespace-nowrap">{new Date(l.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-2 whitespace-nowrap"><span className="nx-pill">{l.form_type}</span></td>
                <td className="px-3 py-2 whitespace-nowrap font-medium">{l.name}</td>
                <td className="px-3 py-2 whitespace-nowrap">{l.company || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap"><a href={`mailto:${l.email}`} className="text-[#0A58CA]">{l.email}</a></td>
                <td className="px-3 py-2 whitespace-nowrap">{l.phone || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{l.country || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{l.industry || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{l.service || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{l.monthly_budget || "—"}</td>
                <td className="px-3 py-2 max-w-[300px] truncate" title={l.requirements}>{l.requirements || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <p className="text-center text-[#0A192F]/55 py-10 text-sm">No leads yet.</p>}
      </div>
    </div>
  );
};

const Careers = () => {
  const [items, setItems] = useState([]);
  const load = () => api.get("/admin/careers", { headers: adminHeaders() }).then(r => setItems(r.data)).catch(() => toast.error("Failed to load"));
  useEffect(() => { load(); }, []);
  const downloadResume = async (id) => {
    try {
      const r = await api.get(`/admin/careers/${id}/resume`, { headers: adminHeaders(), responseType: "blob" });
      const url = URL.createObjectURL(r.data);
      const a = document.createElement("a"); a.href = url;
      a.download = r.headers["content-disposition"]?.match(/filename="?([^"]+)"?/)?.[1] || "resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error("No resume on file."); }
  };
  return (
    <div data-testid="admin-careers">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl text-[#0A192F]">Careers Applications <span className="text-sm text-[#0A192F]/50">({items.length})</span></h2>
        <div className="flex gap-2">
          <button onClick={load} className="nx-btn-ghost px-3 py-1.5 rounded-md text-xs inline-flex items-center gap-1"><RefreshCw size={12}/> Reload</button>
          <button onClick={() => downloadCsv(items, "applications.csv")} className="nx-btn-primary px-3 py-1.5 rounded-md text-xs inline-flex items-center gap-1"><Download size={12}/> Export CSV</button>
        </div>
      </div>
      <div className="overflow-x-auto nx-card rounded-xl">
        <table className="w-full text-xs">
          <thead className="bg-[#F8F9FA] text-[#0A192F]/60 uppercase tracking-widest">
            <tr>{["Date", "Name", "Email", "Phone", "Position", "Location", "Qualification", "Experience", "Current", "Expected", "Resume"].map(h => <th key={h} className="text-left px-3 py-2.5 whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-t border-[var(--nx-line)] hover:bg-[#F8FAFC]">
                <td className="px-3 py-2 whitespace-nowrap">{new Date(a.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-2 whitespace-nowrap font-medium">{a.name}</td>
                <td className="px-3 py-2 whitespace-nowrap"><a href={`mailto:${a.email}`} className="text-[#0A58CA]">{a.email}</a></td>
                <td className="px-3 py-2 whitespace-nowrap">{a.phone || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{a.position}</td>
                <td className="px-3 py-2 whitespace-nowrap">{a.current_location || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{a.qualification || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{a.experience || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{a.current_salary || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{a.expected_salary || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {a.resume_filename ? <button onClick={() => downloadResume(a.id)} className="text-[#0A58CA] underline">Download</button> : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && <p className="text-center text-[#0A192F]/55 py-10 text-sm">No applications yet.</p>}
      </div>
    </div>
  );
};

const BlogEditor = ({ slug, onSaved, onCancel }) => {
  const [post, setPost] = useState({ title: "", slug: "", excerpt: "", content: "", category: "BPO Outsourcing", cover_image: "", tags: "", reading_time: 5, published: true, meta_title: "", meta_description: "" });
  useEffect(() => {
    if (slug && slug !== "new") {
      api.get(`/blog/${slug}`).then(r => {
        const p = r.data.post;
        setPost({ ...p, tags: (p.tags || []).join(", ") });
      });
    }
  }, [slug]);
  const save = async (e) => {
    e.preventDefault();
    const payload = { ...post, tags: typeof post.tags === "string" ? post.tags.split(",").map(t => t.trim()).filter(Boolean) : post.tags };
    try {
      if (slug && slug !== "new") {
        await api.put(`/blog/${slug}`, payload, { headers: adminHeaders() });
      } else {
        await api.post("/blog", payload, { headers: adminHeaders() });
      }
      toast.success("Saved.");
      onSaved();
    } catch { toast.error("Save failed."); }
  };
  return (
    <form onSubmit={save} className="nx-card rounded-xl p-6 space-y-3" data-testid="blog-editor">
      <button type="button" onClick={onCancel} className="text-xs text-[#0A192F]/60 inline-flex items-center gap-1"><ArrowLeft size={12}/> Back</button>
      <h3 className="font-display text-xl text-[#0A192F]">{slug && slug !== "new" ? "Edit Post" : "New Post"}</h3>
      <input required placeholder="Title *" value={post.title} onChange={e => setPost({...post, title: e.target.value})} className="w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm"/>
      <input placeholder="Category" value={post.category} onChange={e => setPost({...post, category: e.target.value})} className="w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm"/>
      <input placeholder="Cover image URL" value={post.cover_image || ""} onChange={e => setPost({...post, cover_image: e.target.value})} className="w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm"/>
      <input placeholder="Tags (comma-separated)" value={post.tags || ""} onChange={e => setPost({...post, tags: e.target.value})} className="w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm"/>
      <textarea rows={2} required placeholder="Excerpt *" value={post.excerpt} onChange={e => setPost({...post, excerpt: e.target.value})} className="w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm"/>
      <textarea rows={14} required placeholder="Content (markdown supported) *" value={post.content} onChange={e => setPost({...post, content: e.target.value})} className="w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm font-mono"/>
      <input placeholder="Meta title (SEO)" value={post.meta_title || ""} onChange={e => setPost({...post, meta_title: e.target.value})} className="w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm"/>
      <input placeholder="Meta description (SEO)" value={post.meta_description || ""} onChange={e => setPost({...post, meta_description: e.target.value})} className="w-full border border-[var(--nx-line)] rounded-md px-3 py-2.5 text-sm"/>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!post.published} onChange={e => setPost({...post, published: e.target.checked})}/> Published</label>
      <button type="submit" className="nx-btn-primary px-4 py-2 rounded-md text-sm inline-flex items-center gap-2"><Save size={13}/> Save</button>
    </form>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = () => api.get("/blog?limit=200").then(r => setPosts(r.data));
  useEffect(() => { load(); }, []);
  const del = async (slug) => {
    if (!window.confirm("Delete this post?")) return;
    await api.delete(`/blog/${slug}`, { headers: adminHeaders() });
    toast.success("Deleted.");
    load();
  };
  if (editing) return <BlogEditor slug={editing} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />;
  return (
    <div data-testid="admin-blog">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl text-[#0A192F]">Blog Posts <span className="text-sm text-[#0A192F]/50">({posts.length})</span></h2>
        <button onClick={() => setEditing("new")} className="nx-btn-primary px-3 py-1.5 rounded-md text-xs inline-flex items-center gap-1"><Plus size={12}/> New Post</button>
      </div>
      <div className="space-y-2">
        {posts.map(p => (
          <div key={p.slug} className="nx-card rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-[#0A192F]">{p.title}</h3>
              <p className="text-xs text-[#0A192F]/55">{p.category} · {p.reading_time} min · {new Date(p.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(p.slug)} className="nx-btn-ghost px-3 py-1.5 rounded-md text-xs">Edit</button>
              <button onClick={() => del(p.slug)} className="px-3 py-1.5 rounded-md text-xs border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center gap-1"><Trash2 size={12}/> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Overview = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/admin/stats", { headers: adminHeaders() }).then(r => setStats(r.data)).catch(() => {}); }, []);
  if (!stats) return <p className="text-sm text-[#0A192F]/55">Loading…</p>;
  const cards = [
    { label: "Total Leads", value: stats.leads_total },
    { label: "Proposals", value: stats.proposals },
    { label: "Consultations", value: stats.consultations },
    { label: "Partnership Inquiries", value: stats.partnerships },
    { label: "Chatbot Leads", value: stats.chatbot_leads },
    { label: "Career Applications", value: stats.career_apps },
    { label: "Newsletter Subscribers", value: stats.newsletter },
    { label: "Blog Posts", value: stats.blog_posts },
  ];
  return (
    <div data-testid="admin-overview">
      <h2 className="font-display text-2xl text-[#0A192F] mb-5">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="nx-card rounded-xl p-5">
            <p className="text-xs uppercase tracking-widest text-[#0A192F]/55">{c.label}</p>
            <p className="font-display text-3xl text-[#0A192F] mt-2">{c.value}</p>
          </div>
        ))}
      </div>
      <h3 className="font-display text-lg text-[#0A192F] mt-10 mb-3">Recent leads (last 10)</h3>
      <div className="space-y-2">
        {(stats.recent_leads || []).map(l => (
          <div key={l.id} className="nx-card rounded-md p-3 text-sm flex flex-wrap items-center justify-between gap-2">
            <div><strong>{l.name}</strong> · {l.email} · <span className="text-[#0A192F]/55">{l.form_type}</span></div>
            <div className="text-[#0A192F]/55 text-xs">{new Date(l.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Shell = ({ children, onLogout }) => (
  <div data-testid="admin-shell" className="pt-24 min-h-screen bg-[#F8F9FA]">
    <div className="nx-container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        <aside className="nx-card rounded-xl p-4 h-fit">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#0A192F]/50 px-2 mb-2">Admin</p>
          {[
            { to: "/admin", label: "Overview", Icon: LayoutDashboard, end: true },
            { to: "/admin/leads", label: "Leads", Icon: Inbox },
            { to: "/admin/careers", label: "Careers", Icon: Briefcase },
            { to: "/admin/blog", label: "Blog CMS", Icon: Newspaper },
          ].map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${isActive ? "bg-[#0A58CA]/8 text-[#0A58CA]" : "text-[#0A192F]/80 hover:bg-[#F8FAFC]"}`}>
              <Icon size={15}/> {label}
            </NavLink>
          ))}
          <button onClick={onLogout} className="w-full mt-3 flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#0A192F]/60 hover:text-[#0A192F]"><LogOut size={15}/> Sign out</button>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  </div>
);

const Admin = () => {
  const { authed, login, logout } = useAuth();
  if (!authed) return <Login onLogin={login} />;
  return (
    <Shell onLogout={logout}>
      <Routes>
        <Route index element={<Overview/>} />
        <Route path="leads" element={<Leads/>} />
        <Route path="careers" element={<Careers/>} />
        <Route path="blog" element={<Blog/>} />
      </Routes>
    </Shell>
  );
};

export default Admin;
