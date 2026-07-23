import { Link, useLocation, Outlet } from "react-router-dom";
import {
  FaEnvelope, FaUserPlus, FaUsers,
  FaSignOutAlt, FaBars, FaBell, FaHome, FaTimes,
} from "react-icons/fa";
import onnesWordmark from "../../assets/onnes-wordmark.png";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminStyles.css";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f0f4f8", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden" }}>

      {/* Mobile overlay backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: isMobile ? "fixed" : "relative",
        top: 0, left: 0, bottom: 0,
        zIndex: isMobile ? 50 : "auto",
        width: 230,
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease",
        backgroundColor: "#fff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Link to="/admin-dashboard/admin-home" style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1, textDecoration: "none" }}>
            <img src={onnesWordmark} alt="Onnes" style={{ width: 108, height: "auto", display: "block" }} />
            <span style={{ color: "#1a365d", fontSize: 11, letterSpacing: "8px", marginLeft: 4, marginTop: 5 }}>
              AEROSPACE
            </span>
          </Link>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}>
              <FaTimes size={16} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 12px 0", overflowY: "auto" }}>
          <NavItem icon={FaHome}     label="Home"       path="/admin-dashboard/admin-home"      onNavigate={() => isMobile && setSidebarOpen(false)} />
          <NavItem icon={FaEnvelope} label="Contact Us" path="/admin-dashboard/admin-contact"   onNavigate={() => isMobile && setSidebarOpen(false)} />
          <NavItem icon={FaUserPlus} label="Subscribe"  path="/admin-dashboard/admin-subscribe" onNavigate={() => isMobile && setSidebarOpen(false)} />
          <NavItem icon={FaUsers}    label="Visitors"   path="/admin-dashboard/admin-visitors"  onNavigate={() => isMobile && setSidebarOpen(false)} />
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 12px 24px" }}>
          <div
            onClick={() => { localStorage.removeItem("adminToken"); window.location.href = "/admin-login"; }}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, cursor: "pointer", color: "#ef4444", fontSize: 14, fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fef2f2"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <FaSignOutAlt size={14} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Top Bar */}
        <div style={{
          height: 56,
          backgroundColor: "#fff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          flexShrink: 0,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 4, display: isMobile ? "flex" : "none", alignItems: "center" }}
          >
            <FaBars size={18} />
          </button>

          {/* Bell icon pinned to the right */}
          <div style={{
            marginLeft: "auto",
            width: 34, height: 34, borderRadius: "50%",
            backgroundColor: "#e0f2fe",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <FaBell size={15} color="#00B5F9" />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, path, onNavigate }) {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      onClick={onNavigate}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", borderRadius: 8, marginBottom: 4,
        fontSize: 14, fontWeight: isActive ? 600 : 400,
        color: isActive ? "#00B5F9" : "#475569",
        backgroundColor: isActive ? "#e0f7ff" : "transparent",
        textDecoration: "none",
        transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; } }}
      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#475569"; } }}
    >
      <Icon size={14} />
      <span>{label}</span>
    </Link>
  );
}