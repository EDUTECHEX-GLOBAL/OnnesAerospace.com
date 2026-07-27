import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Header from "./components/Header.jsx";
import "./styles/home.css";
import Hero from "./components/Hero.jsx";
import Vision from "./components/Vision.jsx";
import Platforms from "./components/Platforms.jsx";
// import Journey from "./components/Journey.jsx";
import WhyOnnes from "./components/WhyOnnes.jsx";
import FinalCta from "./components/FinalCta.jsx";
import Footer from "./components/Footer.jsx";
import Partners from "./components/Partners.jsx";
import api from "./api";

// Lazy-load all page routes
const VisionPage = lazy(() => import("./components/VisionPage.jsx"));
const PlatformsPage = lazy(() => import("./components/PlatformsPage.jsx"));
const ApplicationsPage = lazy(() => import("./components/ApplicationsPage.jsx"));
const TechnologyPage = lazy(() => import("./components/TechnologyPage.jsx"));
const MediaPage = lazy(() => import("./components/MediaPage.jsx"));
const ContactPage = lazy(() => import("./components/ContactPage.jsx"));

// Lazy admin imports
const AdminLogin = lazy(() => import("./AdminDashboard/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./AdminDashboard/pages/AdminDashboard"));
const PrivateRoute = lazy(() => import("./AdminDashboard/components/PrivateRoute"));
const HomeDashboard = lazy(() => import("./AdminDashboard/components/Home"));
const ContactList = lazy(() => import("./AdminDashboard/components/ContactList"));
const SubscriptionList = lazy(() => import("./AdminDashboard/components/SubscriptionList"));
const VisitorsList = lazy(() => import("./AdminDashboard/components/VisitorsList"));


function HomePage() {
  return (
    <>
      <Helmet>
        <title>Onnes Aerospace | Next-Generation Deep Space Infrastructure</title>
        <meta
          name="description"
          content="Onnes Aerospace is engineering the infrastructure systems that enable persistent orbital operations, lunar logistics, autonomous space ecosystems, and deep-space missions."
        />
      </Helmet>
      <main className="site-shell">
        <Header />
        <Hero />
        <Vision />
        <Platforms />
        {/* <Journey /> */}
        <WhyOnnes />
        {/* <Partners /> */}
        <FinalCta />
        <Footer />
      </main>
    </>
  );
}

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    window.setTimeout(() => {
      const target = document.querySelector(location.hash);
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }, 80);
  }, [location.pathname, location.hash]);

  return null;
}

const VISIT_TRACK_KEY = "onnes_visit_logged";

export default function App() {
  const location = useLocation();

  // Track real visitors once per browser session (skips /admin routes)
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    if (sessionStorage.getItem(VISIT_TRACK_KEY)) return;

    sessionStorage.setItem(VISIT_TRACK_KEY, "1");

    api.post("/api/admin-visitors/admin-visitor").catch((err) => {
      console.error("Visitor tracking failed:", err.message);
    });
  }, [location.pathname]);

  return (
    <Suspense fallback={null}>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vision" element={<VisionPage />} />
        <Route path="/platforms" element={<PlatformsPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/technology" element={<TechnologyPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/admin-dashboard" element={<PrivateRoute />}>
          <Route element={<AdminDashboard />}>
            <Route index element={<HomeDashboard />} />
            <Route path="admin-home" element={<HomeDashboard />} />
            <Route path="admin-contact" element={<ContactList />} />
            <Route path="admin-subscribe" element={<SubscriptionList />} />
            <Route path="admin-visitors" element={<VisitorsList />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}