import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";

const TRACK_KEY = "onnes_visit_logged";

export default function useVisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    // Skip admin/login routes entirely — only track real public visitors
    if (location.pathname.startsWith("/admin")) return;

    // Only log once per browser session, not on every route change
    if (sessionStorage.getItem(TRACK_KEY)) return;

    sessionStorage.setItem(TRACK_KEY, "1");

    api.post("/api/admin-visitors/admin-visitor").catch((err) => {
      console.error("Visitor tracking failed:", err.message);
    });
  }, [location.pathname]);
}