import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";
import QuickInquiry from "@/components/QuickInquiry";
import { useGlobalSchema } from "@/lib/seo";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Industries from "@/pages/Industries";
import CaseStudies from "@/pages/CaseStudies";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Partnership from "@/pages/Partnership";
import ThankYou from "@/pages/ThankYou";
import Admin from "@/pages/Admin";

import "@/App.css";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
};

const GlobalSchema = () => { useGlobalSchema(); return null; };

const RemoveSplash = () => {
  useEffect(() => {
    const el = document.getElementById("nx-splash");
    if (el) el.remove();
  }, []);
  return null;
};

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <GlobalSchema />
    <RemoveSplash />
    <Routes>
      {/* Admin app — no public navbar/footer */}
      <Route path="/admin/*" element={<Admin />} />
      <Route
        path="*"
        element={
          <>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/industries" element={<Industries />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/partnership" element={<Partnership />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
            <Chatbot />
            <QuickInquiry />
          </>
        }
      />
    </Routes>
    <Toaster position="top-right" richColors closeButton />
  </BrowserRouter>
);

export default App;
