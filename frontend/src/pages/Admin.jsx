import React, { useEffect, useMemo, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  BriefcaseBusiness,
  Newspaper,
  LogOut,
  Download,
  RefreshCw,
  Trash2,
  Plus,
  Save,
  ArrowLeft,
  Search,
  Users,
  FileText,
  MessageSquareText,
  Bot,
  Mail,
  Handshake,
  Menu,
  X,
  ChevronRight,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Activity,
  Sparkles,
  Eye,
  MessageCircle,
  UserRound,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import { api } from "@/lib/site";
import Logo from "@/components/Logo";
import { toast } from "sonner";

const ADMIN_TOKEN_KEY = "nx_admin_token";

/* =========================================================
   Helpers
========================================================= */

const adminHeaders = () => ({
  "X-Admin-Token": localStorage.getItem(ADMIN_TOKEN_KEY) || "",
});

const formatDate = (value, withTime = false) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  });
};

const titleCase = (value = "") =>
  value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const initials = (name = "Admin") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("");

/* =========================================================
   Auth
========================================================= */

const useAuth = () => {
  const [authed, setAuthed] = useState(
    !!localStorage.getItem(ADMIN_TOKEN_KEY)
  );

  return {
    authed,

    login: (token) => {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      setAuthed(true);
    },

    logout: () => {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      setAuthed(false);
    },
  };
};

/* =========================================================
   Premium Login
========================================================= */

const Login = ({ onLogin }) => {
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!pwd.trim()) return;

    setLoading(true);

    try {
      const r = await api.post("/admin/login", {
        password: pwd,
      });

      onLogin(r.data.token);

      toast.success("Welcome back.");
    } catch {
      toast.error("Invalid admin password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-[#07111F] flex items-center justify-center px-5 py-12"
      data-testid="admin-login"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[#0A58CA]/15 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-[#0A58CA]/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative w-full max-w-[460px]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/10 shadow-2xl mb-5">
            <ShieldCheck className="text-white" size={26} />
          </div>

          <p className="text-[10px] uppercase tracking-[0.32em] text-white/45">
            NR Global Nexus
          </p>

          <h1 className="font-display text-4xl md:text-5xl text-white mt-3 tracking-tight">
            Command Center
          </h1>

          <p className="text-sm text-white/50 mt-3">
            Secure access to your business operations.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-[26px] border border-white/10 bg-white/[0.055] backdrop-blur-2xl p-7 md:p-9 shadow-[0_30px_100px_rgba(0,0,0,0.35)]"
        >
          <div className="mb-6">
            <label className="text-[11px] uppercase tracking-[0.18em] text-white/45">
              Administrator password
            </label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                data-testid="admin-password"
                className="w-full h-12 rounded-xl border border-white/10 bg-black/20 text-white placeholder:text-white/25 px-4 pr-20 text-sm outline-none transition focus:border-[#4D8DFF]/70 focus:ring-4 focus:ring-[#0A58CA]/15"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-wider text-white/40 hover:text-white transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#0A58CA] hover:bg-[#0B63E5] disabled:opacity-60 text-white text-sm font-semibold transition shadow-[0_12px_30px_rgba(10,88,202,0.25)] inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <ShieldCheck size={15} />
                Enter Command Center
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 mt-6 text-[11px] text-white/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Protected administrator area
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   CSV
========================================================= */

const toCsv = (rows) => {
  if (!rows.length) return "";

  const keys = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set())
  );

  const escapeValue = (value) => {
    if (value === null || value === undefined) return "";

    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);

    return /[",\n]/.test(stringValue)
      ? `"${stringValue.replace(/"/g, '""')}"`
      : stringValue;
  };

  return [
    keys.join(","),
    ...rows.map((row) =>
      keys.map((key) => escapeValue(row[key])).join(",")
    ),
  ].join("\n");
};

const downloadCsv = (rows, filename) => {
  const csv = toCsv(rows);

  if (!csv) {
    toast.info("Nothing to export.");
    return;
  }

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);

  toast.success("CSV exported.");
};

/* =========================================================
   Premium UI primitives
========================================================= */

const SectionHeading = ({
  eyebrow,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-7">
    <div>
      {eyebrow && (
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#0A58CA] font-semibold mb-2">
          {eyebrow}
        </p>
      )}

      <h2 className="font-display text-3xl md:text-4xl tracking-tight text-[#0A192F]">
        {title}
      </h2>

      {description && (
        <p className="text-sm text-[#0A192F]/55 mt-2 max-w-2xl">
          {description}
        </p>
      )}
    </div>

    {action}
  </div>
);

const StatCard = ({
  label,
  value,
  icon: Icon,
  accent = "blue",
  description,
}) => {
  const accentClasses = {
    blue: "bg-[#0A58CA]/10 text-[#0A58CA]",
    emerald: "bg-emerald-500/10 text-emerald-600",
    amber: "bg-amber-500/10 text-amber-600",
    violet: "bg-violet-500/10 text-violet-600",
  };

  return (
    <div className="group rounded-2xl border border-[#0A192F]/[0.07] bg-white p-5 shadow-[0_8px_30px_rgba(10,25,47,0.035)] hover:shadow-[0_14px_38px_rgba(10,25,47,0.07)] transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#0A192F]/45 font-semibold">
            {label}
          </p>

          <p className="font-display text-3xl md:text-4xl text-[#0A192F] mt-2 tracking-tight">
            {value ?? "—"}
          </p>

          {description && (
            <p className="text-[11px] text-[#0A192F]/40 mt-1">
              {description}
            </p>
          )}
        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            accentClasses[accent] || accentClasses.blue
          }`}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
}) => (
  <div className="rounded-2xl border border-dashed border-[#0A192F]/10 bg-white p-12 text-center">
    <div className="mx-auto w-12 h-12 rounded-2xl bg-[#0A58CA]/[0.07] text-[#0A58CA] flex items-center justify-center">
      <Icon size={21} />
    </div>

    <h3 className="font-display text-lg text-[#0A192F] mt-4">
      {title}
    </h3>

    <p className="text-sm text-[#0A192F]/45 mt-1 max-w-md mx-auto">
      {description}
    </p>
  </div>
);

const ToolbarButton = ({
  children,
  primary = false,
  onClick,
  disabled,
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`h-9 px-3 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 transition disabled:opacity-50 ${
      primary
        ? "bg-[#0A58CA] text-white hover:bg-[#0B63E5]"
        : "border border-[#0A192F]/10 bg-white text-[#0A192F]/70 hover:bg-[#F7F9FC]"
    }`}
  >
    {children}
  </button>
);

/* =========================================================
   Leads
========================================================= */

const Leads = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/admin/leads/${id}/status`, { status }, { headers: adminHeaders() });
      setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
      toast.success("Lead status updated.");
    } catch {
      toast.error("Could not update lead status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const load = async () => {
    setLoading(true);

    try {
      const r = await api.get("/admin/leads", {
        headers: adminHeaders(),
      });

      setItems(Array.isArray(r.data) ? r.data : []);
    } catch {
      toast.error("Failed to load leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesFilter =
        filter === "all" || item.form_type === filter;

      if (!query) return matchesFilter;

      const searchable = [
        item.name,
        item.email,
        item.company,
        item.phone,
        item.country,
        item.industry,
        item.service,
        item.requirements,
        item.form_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesFilter && searchable.includes(query);
    });
  }, [items, filter, search]);

  return (
    <div data-testid="admin-leads">
      <SectionHeading
        eyebrow="Business pipeline"
        title="Leads"
        description="Every proposal, consultation, inquiry and chatbot lead in one controlled workspace."
        action={
          <div className="flex flex-wrap gap-2">
            <ToolbarButton onClick={load} disabled={loading}>
              <RefreshCw
                size={13}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </ToolbarButton>

            <ToolbarButton
              primary
              onClick={() => downloadCsv(filtered, "nr-global-nexus-leads.csv")}
            >
              <Download size={13} />
              Export CSV
            </ToolbarButton>
          </div>
        }
      />

      <div className="rounded-2xl border border-[#0A192F]/[0.07] bg-white p-4 mb-5 shadow-[0_8px_30px_rgba(10,25,47,0.03)]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A192F]/35"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, company, service..."
              className="w-full h-10 rounded-lg border border-[#0A192F]/10 bg-[#F9FAFC] pl-9 pr-3 text-sm outline-none focus:border-[#0A58CA]/50"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            data-testid="leads-filter"
            className="h-10 rounded-lg border border-[#0A192F]/10 bg-[#F9FAFC] px-3 text-sm text-[#0A192F] outline-none"
          >
            {[
              "all",
              "proposal",
              "project_inquiry",
              "recruitment",
              "partnership",
              "consultation",
              "contact",
              "chatbot",
            ].map((value) => (
              <option key={value} value={value}>
                {titleCase(value)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-[#0A192F]/[0.07] bg-white overflow-hidden shadow-[0_8px_30px_rgba(10,25,47,0.03)]">
        {loading ? (
          <div className="p-14 text-center text-sm text-[#0A192F]/45">
            Loading leads…
          </div>
        ) : !filtered.length ? (
          <div className="p-5">
            <EmptyState
              icon={Inbox}
              title="No leads found"
              description="New website inquiries will appear here automatically."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#F7F9FC] border-b border-[#0A192F]/[0.06]">
                <tr>
                  {[
                    "Date",
                    "Type",
                    "Name",
                    "Company",
                    "Email",
                    "Phone",
                    "Industry",
                    "Service",
                    "Budget",
                    "Requirements",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="text-left px-4 py-3 whitespace-nowrap text-[9px] uppercase tracking-[0.16em] text-[#0A192F]/45 font-semibold"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-[#0A192F]/[0.05] last:border-0 hover:bg-[#FAFBFD] transition"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-[#0A192F]/55">
                      {formatDate(lead.created_at, true)}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-[#0A58CA]/[0.07] px-2.5 py-1 text-[10px] font-semibold text-[#0A58CA]">
                        {titleCase(lead.form_type || "contact")}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-[#0A192F]">
                      {lead.name || "—"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-[#0A192F]/65">
                      {lead.company || "—"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.email ? (
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-[#0A58CA] hover:underline"
                        >
                          {lead.email}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-[#0A192F]/65">
                      {lead.phone || "—"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-[#0A192F]/65">
                      {lead.industry || "—"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-[#0A192F]/65">
                      {lead.service || "—"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-[#0A192F]/65">
                      {lead.monthly_budget || "—"}
                    </td>

                    <td
                      className="px-4 py-3 min-w-[260px] max-w-[360px] text-[#0A192F]/60"
                      title={lead.requirements || ""}
                    >
                      <div className="truncate">
                        {lead.requirements || "—"}
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={lead.status || "new"}
                        disabled={updatingId === lead.id}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className="h-8 rounded-lg border border-[#0A192F]/10 bg-white px-2.5 text-[11px] font-medium text-[#0A192F] outline-none focus:border-[#0A58CA]/50"
                      >
                        {[["new", "New"], ["contacted", "Contacted"], ["qualified", "Qualified"], ["closed", "Closed"]].map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   Careers
========================================================= */

const Careers = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/admin/careers/${id}/status`, { status }, { headers: adminHeaders() });
      setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
      toast.success("Candidate status updated.");
    } catch {
      toast.error("Could not update candidate status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const load = async () => {
    setLoading(true);

    try {
      const r = await api.get("/admin/careers", {
        headers: adminHeaders(),
      });

      setItems(Array.isArray(r.data) ? r.data : []);
    } catch {
      toast.error("Failed to load career applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const downloadResume = async (id) => {
    try {
      const response = await api.get(
        `/admin/careers/${id}/resume`,
        {
          headers: adminHeaders(),
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(response.data);

      const contentDisposition =
        response.headers["content-disposition"] || "";

      const filename =
        contentDisposition.match(
          /filename="?([^"]+)"?/i
        )?.[1] || "resume.pdf";

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);

      toast.success("Resume downloaded.");
    } catch {
      toast.error("No resume could be downloaded.");
    }
  };

  const previewDocument = async (id, type, filename) => {
    // Open synchronously while the click is still a trusted user gesture.
    const previewWindow = window.open("", "_blank");

    if (!previewWindow) {
      toast.error("Preview was blocked by the browser. Please allow pop-ups for this site.");
      return;
    }

    try {
      previewWindow.document.title = "NR Global Nexus — Document Preview";
      previewWindow.document.body.innerHTML = `
        <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px;color:#0A192F">
          Loading preview…
        </div>
      `;

      const response = await api.get(
        `/admin/careers/${id}/${type}`,
        {
          headers: adminHeaders(),
          responseType: "blob",
        }
      );

      const extension = (filename || "").split(".").pop()?.toLowerCase();

      const mimeTypes = {
        pdf: "application/pdf",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
      };

      const mimeType = mimeTypes[extension];

      if (!mimeType) {
        previewWindow.close();
        toast.info("This file type cannot be previewed in the browser. Please download it.");
        return;
      }

      const blob = new Blob([response.data], { type: mimeType });
      const url = URL.createObjectURL(blob);

      previewWindow.location.href = url;

      // Keep the blob alive long enough for the browser viewer to load it.
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      previewWindow.close();
      toast.error(`Could not preview ${type}.`);
    }
  };

  const downloadInvoice = async (id) => {
    try {
      const response = await api.get(
        `/admin/careers/${id}/invoice`,
        {
          headers: adminHeaders(),
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(response.data);

      const contentDisposition =
        response.headers["content-disposition"] || "";

      const filename =
        contentDisposition.match(
          /filename="?([^"]+)"?/i
        )?.[1] || "invoice.pdf";

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);

      toast.success("Invoice downloaded.");
    } catch {
      toast.error("No invoice could be downloaded.");
    }
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) =>
      [
        item.name,
        item.email,
        item.phone,
        item.position,
        item.current_location,
        item.qualification,
        item.experience,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [items, search]);

  return (
    <div data-testid="admin-careers">
      <SectionHeading
        eyebrow="Talent & recruitment"
        title="Career Applications"
        description="Review candidates, access resumes and manage incoming recruitment applications."
        action={
          <div className="flex gap-2">
            <ToolbarButton onClick={load} disabled={loading}>
              <RefreshCw
                size={13}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </ToolbarButton>

            <ToolbarButton
              primary
              onClick={() =>
                downloadCsv(
                  filtered,
                  "nr-global-nexus-career-applications.csv"
                )
              }
            >
              <Download size={13} />
              Export CSV
            </ToolbarButton>
          </div>
        }
      />

      <div className="rounded-2xl border border-[#0A192F]/[0.07] bg-white p-4 mb-5">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A192F]/35"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate, position, email..."
            className="w-full h-10 rounded-lg border border-[#0A192F]/10 bg-[#F9FAFC] pl-9 pr-3 text-sm outline-none focus:border-[#0A58CA]/50"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#0A192F]/[0.07] bg-white overflow-hidden shadow-[0_8px_30px_rgba(10,25,47,0.03)]">
        {loading ? (
          <div className="p-14 text-center text-sm text-[#0A192F]/45">
            Loading applications…
          </div>
        ) : !filtered.length ? (
          <div className="p-5">
            <EmptyState
              icon={BriefcaseBusiness}
              title="No applications found"
              description="New candidate applications will appear here with their submitted information and resume."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#F7F9FC] border-b border-[#0A192F]/[0.06]">
                <tr>
                  {[
                    "Date",
                    "Candidate",
                    "Email",
                    "Phone",
                    "Position",
                    "Location",
                    "Qualification",
                    "Experience",
                    "Current Salary",
                    "Expected Salary",
                    "Resume",
                    "Invoice",
                    "Stage",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="text-left px-4 py-3 whitespace-nowrap text-[9px] uppercase tracking-[0.15em] text-[#0A192F]/45 font-semibold"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((application) => (
                  <tr
                    key={application.id}
                    className="border-b border-[#0A192F]/[0.05] last:border-0 hover:bg-[#FAFBFD]"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-[#0A192F]/55">
                      {formatDate(application.created_at, true)}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0A58CA]/10 text-[#0A58CA] flex items-center justify-center font-semibold text-[10px]">
                          {initials(application.name)}
                        </div>

                        <div>
                          <p className="font-semibold text-[#0A192F]">
                            {application.name}
                          </p>

                          <p className="text-[10px] text-[#0A192F]/40">
                            Applicant
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <a
                        href={`mailto:${application.email}`}
                        className="text-[#0A58CA] hover:underline"
                      >
                        {application.email}
                      </a>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-[#0A192F]/60">
                      {application.phone || "—"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-medium text-[#0A192F]">
                      {application.position || "—"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-[#0A192F]/60">
                      {application.current_location || "—"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-[#0A192F]/60">
                      {application.qualification || "—"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-[#0A192F]/60">
                      {application.experience || "—"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-[#0A192F]/60">
                      {application.current_salary || "—"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-[#0A192F]/60">
                      {application.expected_salary || "—"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
  {application.resume_filename ? (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() =>
          previewDocument(
            application.id,
            "resume",
            application.resume_filename
          )
        }
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A192F]/[0.06] text-[#0A192F] px-2.5 py-1.5 font-semibold hover:bg-[#0A192F]/[0.10] transition"
      >
        <Eye size={12} />
        Preview
      </button>

      <button
        type="button"
        onClick={() => downloadResume(application.id)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A58CA]/[0.07] text-[#0A58CA] px-2.5 py-1.5 font-semibold hover:bg-[#0A58CA]/[0.12] transition"
      >
        <Download size={12} />
        Download
      </button>
    </div>
  ) : (
    <span className="text-[#0A192F]/35">
      Not attached
    </span>
  )}
</td>

<td className="px-4 py-3 whitespace-nowrap">
                      {application.invoice_filename ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              previewDocument(
                                application.id,
                                "invoice",
                                application.invoice_filename
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/[0.07] text-emerald-700 px-2.5 py-1.5 font-semibold hover:bg-emerald-500/[0.12] transition"
                          >
                            <Eye size={12} />
                            Preview
                          </button>

                          <button
                            type="button"
                            onClick={() => downloadInvoice(application.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/[0.07] text-emerald-700 px-2.5 py-1.5 font-semibold hover:bg-emerald-500/[0.12] transition"
                          >
                            <Download size={12} />
                            Download
                          </button>
                        </div>
                      ) : (
                        <span className="text-[#0A192F]/35">
                          Not attached
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={application.status || "new"}
                        disabled={updatingId === application.id}
                        onChange={(e) => updateStatus(application.id, e.target.value)}
                        className="h-8 rounded-lg border border-[#0A192F]/10 bg-white px-2.5 text-[11px] font-medium text-[#0A192F] outline-none focus:border-[#0A58CA]/50"
                      >
                        {[["new", "New"], ["reviewing", "Reviewing"], ["shortlisted", "Shortlisted"], ["interview", "Interview"], ["rejected", "Rejected"], ["hired", "Hired"]].map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   Newsletter Inbox
========================================================= */

const Newsletter = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/admin/newsletter", { headers: adminHeaders() });
      setItems(Array.isArray(r.data) ? r.data : []);
    } catch {
      toast.error("Failed to load subscribers.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);
  return (
    <div data-testid="admin-newsletter">
      <SectionHeading eyebrow="Audience" title="Newsletter Subscribers" description="Every newsletter signup, with a clean export-ready list for your marketing workflow." action={<div className="flex gap-2"><ToolbarButton onClick={load} disabled={loading}><RefreshCw size={13} className={loading ? "animate-spin" : ""}/> Refresh</ToolbarButton><ToolbarButton primary onClick={() => downloadCsv(items, "nr-global-nexus-newsletter.csv")}><Download size={13}/> Export CSV</ToolbarButton></div>} />
      <div className="rounded-2xl border border-[#0A192F]/[0.07] bg-white overflow-hidden shadow-[0_8px_30px_rgba(10,25,47,0.03)]">
        {loading ? <div className="p-14 text-center text-sm text-[#0A192F]/45">Loading subscribers…</div> : !items.length ? <div className="p-5"><EmptyState icon={Mail} title="No subscribers yet" description="Newsletter signups from the website will appear here automatically."/></div> : <div className="overflow-x-auto"><table className="w-full text-xs"><thead className="bg-[#F7F9FC] border-b border-[#0A192F]/[0.06]"><tr><th className="text-left px-4 py-3 text-[9px] uppercase tracking-[0.16em] text-[#0A192F]/45">Email</th><th className="text-left px-4 py-3 text-[9px] uppercase tracking-[0.16em] text-[#0A192F]/45">Subscribed</th></tr></thead><tbody>{items.map((item) => <tr key={item.id || item.email} className="border-b border-[#0A192F]/[0.05] last:border-0 hover:bg-[#FAFBFD]"><td className="px-4 py-3"><a className="text-[#0A58CA] hover:underline" href={`mailto:${item.email}`}>{item.email}</a></td><td className="px-4 py-3 text-[#0A192F]/55">{formatDate(item.created_at, true)}</td></tr>)}</tbody></table></div>}
      </div>
    </div>
  );
};

/* =========================================================
   Chat Inbox
========================================================= */

const ChatInbox = () => {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/admin/chat/sessions", { headers: adminHeaders() });
      setSessions(Array.isArray(r.data) ? r.data : []);
    } catch {
      toast.error("Failed to load chatbot sessions.");
    } finally { setLoading(false); }
  };

  const openSession = async (sessionId) => {
    setSelected(sessionId);
    setDetailLoading(true);
    try {
      const r = await api.get(`/chat/${sessionId}`, { headers: adminHeaders() });
      setMessages(Array.isArray(r.data) ? r.data : []);
    } catch {
      toast.error("Could not load conversation.");
      setMessages([]);
    } finally { setDetailLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div data-testid="admin-chat">
      <SectionHeading eyebrow="AI conversations" title="NexusAI Inbox" description="Review chatbot conversations and the sessions that generated inbound business interest." action={<ToolbarButton onClick={load} disabled={loading}><RefreshCw size={13} className={loading ? "animate-spin" : ""}/> Refresh</ToolbarButton>} />
      <div className="grid grid-cols-1 xl:grid-cols-[.8fr_1.2fr] gap-5">
        <div className="rounded-2xl border border-[#0A192F]/[0.07] bg-white overflow-hidden shadow-[0_8px_30px_rgba(10,25,47,0.03)]">
          <div className="p-4 border-b border-[#0A192F]/[0.06] flex items-center justify-between"><p className="text-[10px] uppercase tracking-[0.2em] text-[#0A58CA] font-semibold">Sessions</p><span className="text-[10px] text-[#0A192F]/35">{sessions.length} shown</span></div>
          {loading ? <div className="p-10 text-center text-sm text-[#0A192F]/45">Loading conversations…</div> : !sessions.length ? <div className="p-5"><EmptyState icon={MessageCircle} title="No conversations yet" description="Chatbot sessions will appear here after visitors interact with NexusAI."/></div> : <div className="divide-y divide-[#0A192F]/[0.06] max-h-[620px] overflow-y-auto">{sessions.map((session) => <button type="button" key={session.session_id} onClick={() => openSession(session.session_id)} className={`w-full text-left p-4 transition ${selected === session.session_id ? "bg-[#0A58CA]/[0.05]" : "hover:bg-[#FAFBFD]"}`}><div className="flex items-start gap-3"><div className="w-9 h-9 rounded-xl bg-[#0A58CA]/[0.08] text-[#0A58CA] flex items-center justify-center shrink-0"><Bot size={15}/></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-[#0A192F] truncate">{session.session_id}</p><span className="text-[9px] text-[#0A192F]/35 whitespace-nowrap">{formatDate(session.last_at)}</span></div><p className="text-[11px] text-[#0A192F]/50 mt-1 line-clamp-2">{session.last_message || "No message"}</p><p className="text-[9px] uppercase tracking-wider text-[#0A192F]/30 mt-2">{session.message_count} messages</p></div></div></button>)}</div>}
        </div>
        <div className="rounded-2xl border border-[#0A192F]/[0.07] bg-white overflow-hidden shadow-[0_8px_30px_rgba(10,25,47,0.03)] min-h-[420px]">
          {!selected ? <div className="h-full min-h-[420px] flex items-center justify-center p-10"><EmptyState icon={MessageCircle} title="Select a conversation" description="Choose a session to inspect the full NexusAI exchange."/></div> : detailLoading ? <div className="p-14 text-center text-sm text-[#0A192F]/45">Loading conversation…</div> : <div><div className="p-5 border-b border-[#0A192F]/[0.06]"><p className="text-[10px] uppercase tracking-[0.2em] text-[#0A58CA] font-semibold">Conversation</p><p className="font-display text-xl text-[#0A192F] mt-1">{selected}</p></div><div className="p-5 space-y-3 max-h-[620px] overflow-y-auto bg-[#F8FAFC]">{messages.map((m, i) => <div key={`${m.created_at}-${i}`} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-[#0A58CA] text-white rounded-br-md" : "bg-white border border-[#0A192F]/[0.07] text-[#0A192F]/75 rounded-bl-md"}`}><p className="text-[9px] uppercase tracking-wider opacity-50 mb-1">{m.role === "user" ? "Visitor" : "NexusAI"}</p><p className="whitespace-pre-wrap leading-6">{m.content}</p><p className="text-[9px] opacity-40 mt-2">{formatDate(m.created_at, true)}</p></div></div>)}</div></div>}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   Blog Editor
========================================================= */

const BlogEditor = ({
  slug,
  onSaved,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);

  const [post, setPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "BPO Outsourcing",
    cover_image: "",
    tags: "",
    reading_time: 5,
    published: true,
    meta_title: "",
    meta_description: "",
  });

  useEffect(() => {
    if (!slug || slug === "new") return;

    api
      .get(`/admin/blog/${slug}`, { headers: adminHeaders() })
      .then((response) => {
        const p = response.data.post;

        setPost({
          ...p,
          tags: (p.tags || []).join(", "),
        });
      })
      .catch(() => {
        toast.error("Failed to load post.");
      });
  }, [slug]);

  const update = (field, value) => {
    setPost((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const save = async (e) => {
    e.preventDefault();

    if (!post.title.trim() || !post.excerpt.trim() || !post.content.trim()) {
      toast.error("Please complete the required fields.");
      return;
    }

    setLoading(true);

    const payload = {
      ...post,
      tags:
        typeof post.tags === "string"
          ? post.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : post.tags,
    };

    try {
      if (slug && slug !== "new") {
        await api.put(`/blog/${slug}`, payload, {
          headers: adminHeaders(),
        });
      } else {
        await api.post("/blog", payload, {
          headers: adminHeaders(),
        });
      }

      toast.success("Blog post saved.");
      onSaved();
    } catch {
      toast.error("Unable to save blog post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={save}
      className="rounded-2xl border border-[#0A192F]/[0.07] bg-white p-5 md:p-7 shadow-[0_8px_30px_rgba(10,25,47,0.035)]"
      data-testid="blog-editor"
    >
      <button
        type="button"
        onClick={onCancel}
        className="text-xs text-[#0A192F]/50 hover:text-[#0A58CA] inline-flex items-center gap-1.5 mb-5"
      >
        <ArrowLeft size={13} />
        Back to posts
      </button>

      <div className="mb-7">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#0A58CA] font-semibold">
          Content management
        </p>

        <h2 className="font-display text-3xl text-[#0A192F] mt-2">
          {slug && slug !== "new"
            ? "Edit Article"
            : "Create New Article"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <input
          required
          placeholder="Article title *"
          value={post.title}
          onChange={(e) => update("title", e.target.value)}
          className="lg:col-span-2 h-11 border border-[#0A192F]/10 rounded-lg px-3 text-sm outline-none focus:border-[#0A58CA]/50"
        />

        <input
          placeholder="Category"
          value={post.category || ""}
          onChange={(e) => update("category", e.target.value)}
          className="h-11 border border-[#0A192F]/10 rounded-lg px-3 text-sm outline-none focus:border-[#0A58CA]/50"
        />

        <input
          placeholder="Reading time in minutes"
          type="number"
          min="1"
          value={post.reading_time || 5}
          onChange={(e) =>
            update("reading_time", Number(e.target.value))
          }
          className="h-11 border border-[#0A192F]/10 rounded-lg px-3 text-sm outline-none focus:border-[#0A58CA]/50"
        />

        <input
          placeholder="Cover image URL"
          value={post.cover_image || ""}
          onChange={(e) => update("cover_image", e.target.value)}
          className="lg:col-span-2 h-11 border border-[#0A192F]/10 rounded-lg px-3 text-sm outline-none focus:border-[#0A58CA]/50"
        />

        <input
          placeholder="Tags — comma separated"
          value={post.tags || ""}
          onChange={(e) => update("tags", e.target.value)}
          className="lg:col-span-2 h-11 border border-[#0A192F]/10 rounded-lg px-3 text-sm outline-none focus:border-[#0A58CA]/50"
        />

        <textarea
          required
          rows={4}
          placeholder="Short excerpt *"
          value={post.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          className="lg:col-span-2 border border-[#0A192F]/10 rounded-lg px-3 py-3 text-sm outline-none focus:border-[#0A58CA]/50 resize-y"
        />

        <textarea
          required
          rows={18}
          placeholder="Article content — Markdown supported *"
          value={post.content}
          onChange={(e) => update("content", e.target.value)}
          className="lg:col-span-2 border border-[#0A192F]/10 rounded-lg px-3 py-3 text-sm outline-none focus:border-[#0A58CA]/50 resize-y font-mono"
        />

        <input
          placeholder="SEO meta title"
          value={post.meta_title || ""}
          onChange={(e) => update("meta_title", e.target.value)}
          className="h-11 border border-[#0A192F]/10 rounded-lg px-3 text-sm outline-none focus:border-[#0A58CA]/50"
        />

        <input
          placeholder="SEO meta description"
          value={post.meta_description || ""}
          onChange={(e) =>
            update("meta_description", e.target.value)
          }
          className="h-11 border border-[#0A192F]/10 rounded-lg px-3 text-sm outline-none focus:border-[#0A58CA]/50"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-[#0A192F]/[0.07]">
        <label className="inline-flex items-center gap-2 text-sm text-[#0A192F]/70">
          <input
            type="checkbox"
            checked={!!post.published}
            onChange={(e) =>
              update("published", e.target.checked)
            }
          />
          Published
        </label>

        <button
          type="submit"
          disabled={loading}
          className="h-10 px-4 rounded-lg bg-[#0A58CA] text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#0B63E5] disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}

          {loading ? "Saving…" : "Save Article"}
        </button>
      </div>
    </form>
  );
};

/* =========================================================
   Blog
========================================================= */

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    try {
      const response = await api.get("/admin/blog?limit=200", { headers: adminHeaders() });

      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch {
      toast.error("Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const del = async (slug) => {
    if (!window.confirm("Delete this article permanently?")) return;

    try {
      await api.delete(`/blog/${slug}`, {
        headers: adminHeaders(),
      });

      toast.success("Article deleted.");
      load();
    } catch {
      toast.error("Unable to delete article.");
    }
  };

  if (editing) {
    return (
      <BlogEditor
        slug={editing}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          load();
        }}
      />
    );
  }

  return (
    <div data-testid="admin-blog">
      <SectionHeading
        eyebrow="Content studio"
        title="Blog CMS"
        description="Create, edit and publish thought-leadership content from one place."
        action={
          <ToolbarButton
            primary
            onClick={() => setEditing("new")}
          >
            <Plus size={13} />
            New Article
          </ToolbarButton>
        }
      />

      {loading ? (
        <div className="rounded-2xl border border-[#0A192F]/[0.07] bg-white p-14 text-center text-sm text-[#0A192F]/45">
          Loading articles…
        </div>
      ) : !posts.length ? (
        <EmptyState
          icon={Newspaper}
          title="No articles yet"
          description="Create your first professional article from the CMS."
        />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="rounded-2xl border border-[#0A192F]/[0.07] bg-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_8px_30px_rgba(10,25,47,0.03)] hover:shadow-[0_14px_38px_rgba(10,25,47,0.06)] transition"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex rounded-full bg-[#0A58CA]/[0.07] text-[#0A58CA] px-2 py-1 text-[9px] uppercase tracking-wider font-semibold">
                    {post.category || "Article"}
                  </span>

                  {post.published ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600">
                      <CheckCircle2 size={11} />
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-600">
                      <Clock3 size={11} />
                      Draft
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl text-[#0A192F] truncate">
                  {post.title}
                </h3>

                <p className="text-xs text-[#0A192F]/45 mt-1">
                  {post.reading_time || 5} min read ·{" "}
                  {formatDate(post.created_at)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditing(post.slug)}
                  className="h-9 px-3 rounded-lg border border-[#0A192F]/10 text-xs font-medium text-[#0A192F]/70 hover:bg-[#F7F9FC]"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => del(post.slug)}
                  className="h-9 px-3 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 inline-flex items-center gap-1.5"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   Overview
========================================================= */

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    try {
      const response = await api.get("/admin/stats", {
        headers: adminHeaders(),
      });

      setStats(response.data);
    } catch {
      toast.error("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading && !stats) {
    return (
      <div className="rounded-2xl border border-[#0A192F]/[0.07] bg-white p-16 text-center text-sm text-[#0A192F]/45">
        Loading command center…
      </div>
    );
  }

  if (!stats) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Dashboard unavailable"
        description="We could not retrieve the latest dashboard statistics."
      />
    );
  }

  const cards = [
    {
      label: "Total Leads",
      value: stats.leads_total,
      icon: Users,
      accent: "blue",
      description: "All inbound opportunities",
    },
    {
      label: "Proposals",
      value: stats.proposals,
      icon: FileText,
      accent: "violet",
      description: "Proposal requests",
    },
    {
      label: "Consultations",
      value: stats.consultations,
      icon: MessageSquareText,
      accent: "emerald",
      description: "Consultation requests",
    },
    {
      label: "Chatbot Leads",
      value: stats.chatbot_leads,
      icon: Bot,
      accent: "amber",
      description: "AI captured leads",
    },
    {
      label: "Career Applications",
      value: stats.career_apps,
      icon: BriefcaseBusiness,
      accent: "blue",
      description: "Candidates received",
    },
    {
      label: "AI Conversations",
      value: stats.chat_sessions,
      icon: MessageCircle,
      accent: "amber",
      description: "Chat sessions captured",
    },
    {
      label: "Subscribers",
      value: stats.newsletter,
      icon: Mail,
      accent: "violet",
      description: "Newsletter subscribers",
    },
    {
      label: "Partnerships",
      value: stats.partnerships,
      icon: Handshake,
      accent: "emerald",
      description: "Partnership inquiries",
    },
    {
      label: "Blog Posts",
      value: stats.blog_posts,
      icon: Newspaper,
      accent: "amber",
      description: "Published/content records",
    },
  ];

  return (
    <div data-testid="admin-overview">
      <div className="rounded-[24px] bg-[#07111F] text-white p-6 md:p-8 mb-6 overflow-hidden relative">
        <div className="absolute -right-20 -top-28 w-80 h-80 rounded-full bg-[#0A58CA]/20 blur-[80px]" />
        <div className="absolute -left-20 -bottom-40 w-80 h-80 rounded-full bg-[#0A58CA]/10 blur-[80px]" />

        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/45">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live command center
            </div>

            <h1 className="font-display text-3xl md:text-4xl mt-3 tracking-tight">
              Business Overview
            </h1>

            <p className="text-sm text-white/45 mt-2 max-w-xl">
              Monitor leads, recruitment, content and inbound activity from
              one secure workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="h-10 px-4 rounded-lg border border-white/10 bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium inline-flex items-center gap-2 transition"
          >
            <RefreshCw
              size={13}
              className={loading ? "animate-spin" : ""}
            />
            Refresh data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            {...card}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_.65fr] gap-5 mt-6">
        <div className="rounded-2xl border border-[#0A192F]/[0.07] bg-white p-5 shadow-[0_8px_30px_rgba(10,25,47,0.03)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#0A58CA] font-semibold">
                Activity
              </p>

              <h2 className="font-display text-xl text-[#0A192F] mt-1">
                Recent Leads
              </h2>
            </div>

            <Activity
              size={17}
              className="text-[#0A192F]/25"
            />
          </div>

          {(stats.recent_leads || []).length ? (
            <div className="divide-y divide-[#0A192F]/[0.06]">
              {stats.recent_leads.map((lead) => (
                <div
                  key={lead.id}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#0A58CA]/[0.07] text-[#0A58CA] flex items-center justify-center shrink-0">
                      {lead.form_type === "chatbot" ? (
                        <Bot size={15} />
                      ) : lead.form_type === "proposal" ? (
                        <FileText size={15} />
                      ) : lead.form_type === "consultation" ? (
                        <MessageSquareText size={15} />
                      ) : (
                        <Inbox size={15} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0A192F] truncate">
                        {lead.name || "Unknown lead"}
                      </p>

                      <p className="text-[11px] text-[#0A192F]/45 truncate mt-0.5">
                        {lead.email || "No email"} ·{" "}
                        {titleCase(lead.form_type || "contact")}
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#0A192F]/35 whitespace-nowrap">
                    {formatDate(lead.created_at)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Inbox}
              title="No recent activity"
              description="New business inquiries will appear here."
            />
          )}
        </div>

        <div className="rounded-2xl border border-[#0A192F]/[0.07] bg-[#F7F9FC] p-5">
          <div className="flex items-center gap-2 text-[#0A58CA]">
            <Sparkles size={16} />
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold">
              Workspace status
            </p>
          </div>

          <h3 className="font-display text-2xl text-[#0A192F] mt-3">
            Operations at a glance.
          </h3>

          <p className="text-sm text-[#0A192F]/50 mt-2 leading-relaxed">
            Your admin center is connected to the website's existing
            business data layer. New inbound activity can be surfaced here
            without exposing the admin area publicly.
          </p>

          <div className="mt-6 space-y-2.5">
            {[
              ["Admin authentication", "Protected"],
              ["Lead data", "Connected"],
              ["Career applications", "Connected"],
              ["Resume access", "Protected"],
              ["Blog CMS", "Available"],
            ].map(([label, status]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 rounded-xl bg-white border border-[#0A192F]/[0.06] px-3.5 py-3"
              >
                <span className="text-xs text-[#0A192F]/60">
                  {label}
                </span>

                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
                  <CheckCircle2 size={12} />
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   Premium Shell
========================================================= */

const Shell = ({ children, onLogout }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    {
      to: "/admin",
      label: "Overview",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/admin/leads",
      label: "Leads",
      icon: Inbox,
    },
    {
      to: "/admin/careers",
      label: "Careers",
      icon: BriefcaseBusiness,
    },
    {
      to: "/admin/newsletter",
      label: "Newsletter",
      icon: Mail,
    },
    {
      to: "/admin/chat",
      label: "NexusAI Inbox",
      icon: MessageCircle,
    },
    {
      to: "/admin/blog",
      label: "Blog CMS",
      icon: Newspaper,
    },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const current = navigation.find((item) =>
    item.end
      ? location.pathname === item.to
      : location.pathname.startsWith(item.to)
  );

  return (
    <div
      data-testid="admin-shell"
      className="min-h-screen bg-[#F5F7FA] text-[#0A192F]"
    >
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[252px] bg-[#07111F] text-white z-40 flex-col">
        <div className="h-[84px] px-6 flex items-center border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <Logo variant="light" size="sm" className="shrink-0" />
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/35 mt-1">
                Admin Command Center
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6">
          <p className="px-3 text-[9px] uppercase tracking-[0.22em] text-white/30 mb-3">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map(
              ({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm transition ${
                      isActive
                        ? "bg-white/[0.09] text-white shadow-inner"
                        : "text-white/50 hover:text-white hover:bg-white/[0.045]"
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} />
                    {label}
                  </span>

                  <ChevronRight
                    size={13}
                    className="opacity-0 group-hover:opacity-50 transition"
                  />
                </NavLink>
              )
            )}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-xs font-semibold">
                AD
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">
                  Administrator
                </p>

                <p className="text-[10px] text-white/35 mt-0.5">
                  Secure session
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm text-white/45 hover:text-white hover:bg-white/[0.045] transition"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-[68px] bg-[#07111F] text-white z-50 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo variant="light" size="sm" className="scale-75 origin-left" />
          <p className="text-[8px] uppercase tracking-[0.22em] text-white/35">
            Admin
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="w-10 h-10 rounded-xl bg-white/[0.07] flex items-center justify-center"
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed top-[68px] inset-x-0 z-40 bg-[#07111F] border-t border-white/[0.07] px-4 py-4 shadow-2xl">
          <nav className="space-y-1">
            {navigation.map(
              ({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm ${
                      isActive
                        ? "bg-white/[0.09] text-white"
                        : "text-white/50"
                    }`
                  }
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              )
            )}

            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm text-white/50"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </nav>
        </div>
      )}

      {/* Main */}
      <div className="lg:ml-[252px] min-h-screen">
        <header className="hidden lg:flex h-[84px] bg-white border-b border-[#0A192F]/[0.06] items-center justify-between px-8 sticky top-0 z-30">
          <div>
            <p className="text-[9px] uppercase tracking-[0.22em] text-[#0A192F]/35">
              Command Center
            </p>

            <p className="text-sm font-semibold text-[#0A192F] mt-1">
              {current?.label || "Admin"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/[0.07] text-emerald-600 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Secure session
            </div>

            <div className="w-9 h-9 rounded-xl bg-[#07111F] text-white flex items-center justify-center text-[10px] font-semibold">
              AD
            </div>
          </div>
        </header>

        <main className="pt-[92px] lg:pt-0">
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-9">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

/* =========================================================
   Admin
========================================================= */

const Admin = () => {
  const { authed, login, logout } = useAuth();
  const navigate = useNavigate();

  if (!authed) {
    return <Login onLogin={login} />;
  }

  const handleLogout = () => {
    logout();
    navigate("/admin");
    toast.success("Signed out securely.");
  };

  return (
    <Shell onLogout={handleLogout}>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="leads" element={<Leads />} />
        <Route path="careers" element={<Careers />} />
        <Route path="newsletter" element={<Newsletter />} />
        <Route path="chat" element={<ChatInbox />} />
        <Route path="blog" element={<Blog />} />
      </Routes>
    </Shell>
  );
};

export default Admin;