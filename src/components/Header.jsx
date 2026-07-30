import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import onnesWordmark from "../assets/onnes-wordmark.png";
import "../styles/header.css";

const navItems = [["Contact", "/contact#mission-brief"]];

const visionItems = [
  ["Mission", "/vision#mission"],
  ["Future Beyond Earth", "/vision#future-beyond-earth"],
  ["Leadership", "/vision#leadership"],
];

const platformItems = [
  ["Orbital Infrastructure", "/platforms#orbital-infrastructure"],
  ["Lunar Infrastructure", "/platforms#lunar-infrastructure"],
  ["Deep Space Systems", "/platforms#deep-space-systems"],
  ["Autonomous Space Ecosystems", "/platforms#autonomous-space-ecosystems"],
];

const applicationItems = [
  ["Commercial Space", "/applications#commercial-space"],
  ["National Security Space", "/applications#national-security-space"],
  ["Space Enabled Air, Ground, Water Systems", "/applications#space-enabled-air-ground-water-systems"],
  ["Deep Space Exploration", "/applications#deep-space-exploration"],
];

const technologyItems = [
  ["Infrastructure Platform", "/technology#infrastructure-platform"],
  ["Intelligent Systems", "/technology#intelligent-systems"],
  ["Advanced Engineering", "/technology#advanced-engineering"],
];

const mediaItems = [
  ["News", "/media#news"],
  // ["Insights", "/media#subscribe"],
];

const dropdownNavs = [
  { label: "Vision", to: "/vision", items: visionItems, key: "vision" },
  { label: "Platforms", to: "/platforms", items: platformItems, key: "platforms" },
  { label: "Applications", to: "/applications", items: applicationItems, key: "applications" },
  { label: "Technology", to: "/technology", items: technologyItems, key: "technology" },
  { label: "Media", to: "/media", items: mediaItems, key: "media" },
];

export default function Header() {
  const location = useLocation();
  const [closedDropdown, setClosedDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  const isHome = location.pathname === "/";
  const isContact = location.pathname === "/contact";

  const pathMap = {
    vision: location.pathname === "/vision",
    platforms: location.pathname === "/platforms",
    applications: location.pathname === "/applications",
    technology: location.pathname === "/technology",
    media: location.pathname === "/media",
  };

  const closeDropdown = (name) => {
    setClosedDropdown(name);
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  const resetDropdown = (name) => {
    if (closedDropdown === name) setClosedDropdown(null);
  };

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setOpenAccordion(null);
  };

  return (
    <>
      <header className={`header${mobileOpen ? " mobile-menu-open" : ""}`}>
        <Link className="brand" to="/" aria-label="Onnes Aerospace home" onClick={closeMobileMenu}>
          <img className="brand-logo" src={onnesWordmark} alt="Onnes" />
          <span className="brand-sub">AEROSPACE</span>
        </Link>

        <nav className="nav" aria-label="Primary navigation">
          <Link className={isHome ? "active" : ""} to="/">Home</Link>

          {dropdownNavs.map(({ label, to, items, key }) => (
            <div
              key={key}
              className={`nav-dropdown ${key}-nav-dropdown${closedDropdown === key ? " dropdown-closed" : ""}`}
              onMouseLeave={() => resetDropdown(key)}
            >
              <Link className={pathMap[key] ? "active" : ""} to={to}>
                {label}
              </Link>

              <div className="nav-menu">
                {items.map(([itemLabel, itemTo]) => (
                  <Link to={itemTo} key={itemLabel} onClick={() => closeDropdown(key)}>
                    {itemLabel}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {navItems.map(([item, to]) => (
            <Link className={isContact ? "active" : ""} to={to} key={item}>
              {item}
            </Link>
          ))}
        </nav>

        <Link className="outline-button small desktop-cta" to="/contact#mission-brief">
          Partner With Us <span aria-hidden="true">↗</span>
        </Link>

        <button
          type="button"
          className="hamburger"
          onClick={() => (mobileOpen ? closeMobileMenu() : setMobileOpen(true))}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="24" y2="24" />
              <line x1="24" y1="4" x2="4" y2="24" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 28 20" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
              <line x1="0" y1="2" x2="28" y2="2" />
              <line x1="0" y1="10" x2="28" y2="10" />
              <line x1="0" y1="18" x2="28" y2="18" />
            </svg>
          )}
        </button>
      </header>

      <div className={`mobile-menu${mobileOpen ? " mobile-menu--open" : ""}`}>
        <nav className="mobile-menu-nav" aria-label="Mobile navigation">
          <Link className="mobile-menu-link mobile-menu-btn" to="/" onClick={closeMobileMenu}>
            Home
          </Link>

          {dropdownNavs.map(({ label, to, items, key }) => (
            <div key={key} className="mobile-menu-item">
              <div className={`mobile-menu-row${openAccordion === key ? " is-open" : ""}`}>
                <Link className="mobile-menu-link" to={to} onClick={closeMobileMenu}>
                  {label}
                </Link>

                <button
                  type="button"
                  className="mobile-menu-chevron"
                  onClick={() => toggleAccordion(key)}
                  aria-expanded={openAccordion === key}
                  aria-label={`Toggle ${label} menu`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>

              <div className={`mobile-submenu${openAccordion === key ? " is-open" : ""}`}>
                <div className="mobile-submenu-inner">
                  {items.map(([itemLabel, itemTo]) => (
                    <Link key={itemLabel} className="mobile-sub-link" to={itemTo} onClick={closeMobileMenu}>
                      {itemLabel}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <Link className="mobile-menu-link" to="/contact" onClick={closeMobileMenu}>
            Contact
          </Link>
        </nav>
      </div>
    </>
  );
}