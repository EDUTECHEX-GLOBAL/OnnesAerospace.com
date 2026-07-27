import {
  Activity,
  Boxes,
  CheckCircle2,
  CircleGauge,
  Cpu,
  Feather,
  Globe2,
  LayoutDashboard,
  Network,
  Orbit,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../styles/technology.css";
import heroBg from "../assets/OrionTakeOff1.webp";
import platformBg from "../assets/InfraPlatform2.webp";
import systemsDashboard from "../assets/IntelligentSystems.webp";
import engineeringOne from "../assets/AdvMaterials.webp";
import engineeringTwo from "../assets/PrecisionEngineering.webp";
import engineeringThree from "../assets/RigorousTesting.webp";
import engineeringFour from "../assets/DigitalInnovation2.png";
import ctaBg from "../assets/journey-bg.webp";

const advantages = [
  ["Mission Critical", "Built for reliability and resilience in the harshest environments.", <CircleGauge />],
  ["Mass Optimized", "Lightweight architectures that maximize payload and efficiency.", <Feather />],
  ["Intelligent By Design", "Embedded intelligence for autonomous operations and decision-making.", <Cpu />],
  ["Modular & Scalable", "Adaptable systems engineered to scale across missions.", <ShieldCheck />],
  ["Interoperable", "Open architectures for seamless integration across ecosystems.", <Globe2 />],
];

const platformBullets = [
  "Modular architecture for maximum flexibility",
  "High-efficiency structural and thermal systems",
  "Advanced materials and components",
  "Rapid integration and mission adaptability",
];

const callouts = [
  ["Structural Modules", "Lightweight, high-strength composite structures"],
  ["Thermal Systems", "Intelligent thermal control and environmental stability."],
  ["Power & Distribution", "High-efficiency power management systems"],
  ["Fluid & Transfer Systems", "Precision fluid management and logistics systems"],
  ["Avionics & Control", "Embedded computing and autonomous control systems"],
];

const systemCards = [
  ["System Health", "98%", "Nominal", <Activity />],
  ["Power Management", "94%", "Optimal", <Zap />],
  ["Thermal Status", "-45°C", "Stable", <CircleGauge />],
  ["Propulsion", "100%", "Ready", <Orbit />],
];

const engineeringCards = [
  ["Advanced Materials", "Next-generation composites and materials for superior strength-to-weight ratios.", engineeringOne, "center center", "scale(1.08)"],
  ["Precision Engineering", "High-precision manufacturing and assembly for mission-critical components.", engineeringTwo, "center top"],
  ["Rigorous Testing", "Validated through extreme environment testing and mission qualification.", engineeringThree, "center 20%"],
  ["Digital Innovation", "Modeling, simulation, and digital engineering for optimal mission performance.", engineeringFour, "20% center"],
];

function Advantage({ item }) {
  const [title, body, icon] = item;
  return (
    <article className="technology-advantage">
      <span>{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}

function CheckList({ items }) {
  return (
    <ul className="technology-check-list">
      {items.map((item) => (
        <li key={item}>
          <CheckCircle2 />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function TechnologyPage() {
  return (
    <>
      <Helmet>
        <title>Our Technology | Onnes Aerospace</title>
        <meta
          name="description"
          content="Intelligent technology for extreme environments — advanced infrastructure platforms, intelligent systems, and advanced engineering powering humanity's future beyond Earth."
        />
      </Helmet>
      <main className="site-shell technology-page">
        <Header />

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="technology-hero" id="technology-top">
          <div
            className="technology-hero-bg"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="technology-hero-copy">
            <p className="technology-eyebrow">Our Technology</p>
            <h1>
              Intelligent Technology.
              <br />
              Extreme Environments.
              <br />
              Endless Possibilities.
            </h1>
            <p>
              Onnes Aerospace combines advanced engineering, intelligent systems, and mission-proven architectures
              to build the infrastructure that powers humanity's future beyond Earth.
            </p>
            <a className="solid-button" href="#infrastructure-platform">
              Explore Our Technology <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        {/* ── Advantage band ───────────────────────────────────────── */}
        <section className="technology-advantage-band">
          <p className="technology-eyebrow">Our Technology Advantage</p>
          <div className="technology-advantages">
            {advantages.map((item) => (
              <Advantage item={item} key={item[0]} />
            ))}
          </div>
        </section>

        {/* ── 01 Infrastructure Platform ───────────────────────────── */}
        {/* ── 01 Infrastructure Platform ───────────────────────────── */}
    <section className="technology-platform-panel" id="infrastructure-platform">
      <div className="technology-platform-row">
        <div className="technology-section-copy">
          <p className="technology-number">01</p>
          <h2>Infrastructure Platform</h2>
          <p>
            A modular, high-performance infrastructure platform engineered for persistent operations across orbit,
            the Moon, and deep space.
          </p>
          <CheckList items={platformBullets} />
          <a href="#infrastructure-platform">Learn More <span aria-hidden="true">→</span></a>
        </div>
        <div
          className="technology-platform-visual"
          style={{ backgroundImage: `url(${platformBg})` }}
        >
          <img src={platformBg} alt="" className="technology-platform-img" />
        </div>
      </div>
      
      {/* Callouts moved below the image */}
      <div className="technology-callouts-grid">
        {callouts.map(([title, body]) => (
          <div className="technology-callout-item" key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>

        {/* ── 02 Intelligent Systems ───────────────────────────────── */}
        <section className="technology-systems-panel" id="intelligent-systems">
          <div className="technology-section-copy">
            <p className="technology-number">02</p>
            <h2>Intelligent Systems</h2>
            <p>
              Intelligent systems that sense, decide, and act, enabling autonomous operations in complex and dynamic
              environments.
            </p>
            <CheckList items={["Autonomous operations & decision-making", "Real-time health monitoring & diagnostics", "Predictive analytics & anomaly detection", "Secure communications & data fusion"]} />
            <a href="#intelligent-systems">Learn More <span aria-hidden="true">→</span></a>
          </div>
          <div className="technology-dashboard">
            <img src={systemsDashboard} alt="" />
          </div>
        </section>

        {/* ── 03 Advanced Engineering ──────────────────────────────── */}
        <section className="technology-engineering-panel" id="advanced-engineering">
          <div className="technology-section-copy">
            <p className="technology-number">03</p>
            <h2>Advanced Engineering</h2>
            <p>Pushing the boundaries of engineering to solve the toughest challenges of space and beyond.</p>
            <CheckList items={["Advanced composites & materials", "Precision manufacturing & testing", "Extreme environment qualification", "Digital engineering & simulation"]} />
            <a href="#advanced-engineering">Learn More <span aria-hidden="true">→</span></a>
          </div>
          <div className="engineering-card-grid">
            {engineeringCards.map(([title, body, image, objPos, transform]) => (
              <article className="engineering-card" key={title}>
                <img
                  src={image}
                  alt={title}
                  className="engineering-card-img"
                  style={{
                    objectPosition: objPos,
                    transform: transform || "none",
                  }}
                />
                <div className="engineering-card-body">
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="technology-cta" style={{ backgroundImage: `url(${ctaBg})` }}>
          <h2>Engineering The Future. Powering Humanity Beyond Earth.</h2>
          <p>Our technology is the foundation for a new era of space infrastructure and limitless exploration.</p>
          <Link className="solid-button" to="/contact#mission-brief">
            Partner With Us <span aria-hidden="true">→</span>
          </Link>
        </section>

        <Footer />
      </main>
    </>
  );
}