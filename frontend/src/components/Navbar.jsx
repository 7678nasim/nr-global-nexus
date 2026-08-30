import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/partnership", label: "Partnership" },
  { to: "/blog", label: "Blog" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "nx-glass" : "bg-white/40 backdrop-blur-md"}`}
    >
      <div className="nx-container flex items-center justify-between h-[84px]">
        <Logo size="lg" />
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`nav-${n.label.toLowerCase().replace(/\s/g, "-")}`}
              className={({ isActive }) =>
                `px-2.5 xl:px-3 py-2 text-[13px] xl:text-[14px] font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive ? "text-[#0A58CA]" : "text-[#0A192F]/80 hover:text-[#0A192F]"
                }`
              }
              end={n.to === "/"}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden xl:flex items-center gap-2">
          <Link
            to="/contact?form=consultation"
            data-testid="nav-book-consult"
            className="nx-btn-ghost px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap"
          >
            Book Consultation
          </Link>
          <Link
            to="/contact?form=proposal"
            data-testid="nav-request-proposal"
            className="nx-btn-primary px-4 py-2 rounded-md text-sm font-medium inline-flex items-center gap-1 whitespace-nowrap"
          >
            Request Proposal <ChevronDown size={14} className="-rotate-90" />
          </Link>
        </div>
        <Link
          to="/contact?form=proposal"
          className="hidden lg:inline-flex xl:hidden nx-btn-primary px-4 py-2 rounded-md text-sm font-medium items-center gap-1 whitespace-nowrap"
        >
          Get Started <ChevronDown size={14} className="-rotate-90" />
        </Link>
        <button
          className="lg:hidden p-2 -mr-2"
          aria-label="menu"
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-[var(--nx-line)] bg-white">
          <div className="nx-container py-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                data-testid={`nav-mobile-${n.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-md text-sm font-medium ${
                    isActive ? "bg-[#0A58CA]/8 text-[#0A58CA]" : "text-[#0A192F]"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Link to="/contact?form=consultation" className="nx-btn-ghost px-3 py-2.5 rounded-md text-sm text-center">Book Consultation</Link>
              <Link to="/contact?form=proposal" className="nx-btn-primary px-3 py-2.5 rounded-md text-sm text-center">Request Proposal</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
