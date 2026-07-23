import {
  Box,
  Boxes,
  Bot,
  CircuitBoard,
  Cuboid,
  Globe2,
  Network,
  Orbit,
  Radar,
  Rocket,
  Satellite,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../styles/platforms.css";
import heroBg from "../assets/OrbitalInfrastructure.webp";
import orbitalImg from "../assets/OrbitalInfra3.webp";
import lunarImg from "../assets/LunarInfra1.webp";
import deepImg from "../assets/DeepSpace2.webp";
import ecosystemImg from "../assets//SpaceEcosystems.webp";
import ctaBg from "../assets/journey-bg.webp";

const platformSections = [
  {
    id: "orbital-infrastructure",
    number: "01",
    title: "Orbital Infrastructure",
    body: "Robust, scalable infrastructure enabling persistent operations in Earth orbit and beyond. From orbital depots and logistics hubs to in-space servicing platforms, our systems provide the backbone for a thriving orbital economy.",
    image: orbitalImg,
    imageSide: "left",
    cta: "Explore Our Platforms",
    features: [
      ["Orbital\nDepots", "Modular depots for storage, staging, and distribution in orbit.", <Box />],
      ["In-Space Logistics", "Autonomous transfer and servicing vehicles for seamless operations.", <Network />],
      ["Persistent Operations", "Built for long-duration missions with maximum reliability.", <Rocket />],
      ["Commercial Stations Support", "Infrastructure that powers the next generation of space stations.", <Users />],
    ],
  },
  {
    id: "lunar-infrastructure",
    number: "02",
    title: "Lunar Infrastructure",
    body: "End-to-end infrastructure for sustained lunar presence. Our systems support logistics, surface operations, habitats, resource utilization, and energy solutions to build the foundation of a lunar economy.",
    image: lunarImg,
    imageSide: "right",
    features: [
      ["Lunar Logistics", "Reliable transport and delivery systems across the lunar surface.", <Truck />],
      ["Surface Operations", "Infrastructure for mobility, power, and mission support.", <Radar />],
      ["Resource Utilization", "Systems designed for in-situ resources and real-world applications.", <Cuboid />],
      ["Habitats & Life\nSupport Infra", "Enabling safe, sustainable human presence on the Moon.", <Orbit />],
    ],
  },
  {
    id: "deep-space-systems",
    number: "03",
    title: "Deep Space Systems",
    body: "Engineered for the challenges of the unknown. Our deep space systems provide the reliability, autonomy, and endurance required for missions far beyond Earth.",
    image: deepImg,
    imageSide: "left",
    features: [
      ["Long-Duration Missions", "Systems built for extreme distance and extended mission timelines.", <Rocket />],
      ["Deep Space Logistics", "Autonomous transport and supply systems for deep space missions.", <Boxes />],
      ["Interplanetary Platforms", "Scalable platforms for lunar, Mars and planetary exploration.", <Satellite />],
      ["Mission\nEnablement", "Critical systems that ensure mission success in the harshest environments.", <Settings />],
    ],
  },
  {
    id: "autonomous-space-ecosystems",
    number: "04",
    title: "Autonomous Space Ecosystems",
    body: "Intelligent, self-operating ecosystems that sense, decide, and act. Our autonomous platforms enable resilient, adaptive, and scalable operations across all domains.",
    image: ecosystemImg,
    imageSide: "right",
    features: [
      ["Autonomous Platforms", "Self-operating systems that adapt and evolve in dynamic missions.", <Bot />],
      ["AI-Powered Operations", "Advanced AI for decision-making, optimization, and anomaly resolution.", <CircuitBoard />],
      ["Networked Systems", "Secure, resilient networks that connect and coordinate assets.", <ShieldCheck />],
      ["Space\nAwareness", "Real-time awareness and predictive response across the space domain.", <Globe2 />],
    ],
  },
];

function PlatformFeature({ title, body, icon }) {
  return (
    <article className="platform-page-feature">
      <span>{icon}</span>
      <h4>
        {title.split("\n").map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
      </h4>
      <p>{body}</p>
    </article>
  );
}

function PlatformSection({ section }) {
  const media = (
    <div
      className={`platform-page-media ${section.imageSide === "left" ? "media-left" : "media-right"}`}
      style={{
        "--platform-image": `url(${section.image})`,
        "--platform-mobile-image": `url(${section.mobileImage || section.image})`,
      }}
      aria-hidden="true"
    />
  );

  const content = (
    <div className="platform-page-copy">
      <p className="platform-page-kicker">{section.number}</p>
      <h2>{section.title}</h2>
      <span className="platform-title-rule" />
      <p>{section.body}</p>
      <div className="platform-page-features">
        {section.features.map(([title, body, icon]) => (
          <PlatformFeature title={title} body={body} icon={icon} key={title} />
        ))}
      </div>
      <a href={`#${section.id}`} className="platform-learn-link">
        {section.cta || "Learn More"} <span aria-hidden="true">→</span>
      </a>
    </div>
  );

  return (
    <section className="platform-page-section" id={section.id}>
      {section.imageSide === "left" ? media : content}
      {section.imageSide === "left" ? content : media}
    </section>
  );
}

export default function PlatformsPage() {
  return (
    <main className="site-shell platforms-page">
      <Header />
      <section className="platform-page-hero" id="platforms-top">
        <div className="platform-page-hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="platform-page-hero-copy">
          <p className="platform-page-eyebrow">Our Platforms</p>
          <h1>
            Infrastructure
            <br />
            That Powers The
            <br />
            Future Of Space
          </h1>
          <span className="platform-title-rule" />
          <p>
            Onnes Aerospace develops and integrates advanced infrastructure platforms that enable persistent
            operations across orbit, the Moon, and deep space.
          </p>
          <p>Modular. Intelligent. Autonomous. Built for the toughest environments and the longest missions.</p>
          <a className="solid-button platform-hero-button" href="#orbital-infrastructure">
            Explore Our Platforms <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
      {platformSections.map((section) => (
        <PlatformSection section={section} key={section.id} />
      ))}
      <section className="platform-page-cta" style={{ backgroundImage: `url(${ctaBg})` }}>
        <div>
          <h2>Building The Infrastructure That Takes Humanity Further.</h2>
          <p>From orbit to deep space, our platforms are built to enable the missions of today and the civilizations of tomorrow.</p>
        </div>
        <div className="cta-actions">
          <Link className="solid-button" to="/contact#mission-brief">
            Partner With Us <span aria-hidden="true">→</span>
          </Link>
          <a className="outline-button" href="/applications">
            Explore Applications <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}