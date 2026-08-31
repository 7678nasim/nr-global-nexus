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
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent the page from remaining locked if the mobile menu
  // was open and the viewport changes back to desktop.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Keep keyboard focus / accessibility behaviour clean when
  // the mobile navigation is open.
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <header
      data-testid="site-navbar"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "nx-glass shadow-[0_8px_30px_rgba(10,25,47,0.06)]"
          : "bg-white/40 backdrop-blur-md"
      }`}
    >
      <div className="nx-container flex h-[84px] items-center justify-between">
        {/* Logo */}
        <Logo size="lg" />

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-0.5"
          aria-label="Primary navigation"
        >
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              data-testid={`nav-${n.label
                .toLowerCase()
                .replace(/\s/g, "-")}`}
              className={({ isActive }) =>
                `px-2.5 xl:px-3 py-2 text-[13px] xl:text-[14px] font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-[#0A58CA]"
                    : "text-[#0A192F]/80 hover:text-[#0A192F]"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
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
            Request Proposal
            <ChevronDown size={14} className="-rotate-90" />
          </Link>
        </div>

        {/* Tablet CTA */}
        <Link
          to="/contact?form=proposal"
          className="hidden lg:inline-flex xl:hidden nx-btn-primary px-4 py-2 rounded-md text-sm font-medium items-center gap-1 whitespace-nowrap"
        >
          Get Started
          <ChevronDown size={14} className="-rotate-90" />
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2 -mr-2 rounded-md transition-colors hover:bg-[#0A192F]/5"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div
          id="mobile-navigation"
          className="lg:hidden border-t border-[var(--nx-line)] bg-white/95 backdrop-blur-xl shadow-[0_12px_30px_rgba(10,25,47,0.08)]"
        >
          <div className="nx-container py-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                data-testid={`nav-mobile-${n.label
                  .toLowerCase()
                  .replace(/\s/g, "-")}`}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#0A58CA]/8 text-[#0A58CA]"
                      : "text-[#0A192F] hover:bg-[#0A192F]/5"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}

            <div className="grid grid-cols-2 gap-2 mt-3">
              <Link
                to="/contact?form=consultation"
                className="nx-btn-ghost px-3 py-2.5 rounded-md text-sm text-center"
              >
                Book Consultation
              </Link>

              <Link
                to="/contact?form=proposal"
                className="nx-btn-primary px-3 py-2.5 rounded-md text-sm text-center"
              >
                Request Proposal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;