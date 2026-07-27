import {
  Building2,
  Crosshair,
  Eye,
  Globe2,
  Lock,
  Network,
  Orbit,
  RadioTower,
  Rocket,
  Satellite,
  Ship,
  Truck,
  Waves,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

import Header from "./Header.jsx";
import FinalCta from "./FinalCta.jsx";
import Footer from "./Footer.jsx";
import "../styles/applications.css";

import heroBg from "../assets/ApplicationsHeroBg.webp";
import commercialBg from "../assets/CommercialSpace1.webp";
import securityBg from "../assets/NationalSecuritySpace.webp";
import defenseBg from "../assets/Space_X_Air_Water_Ground.webp";
import explorationBg from "../assets/DeepSpaceExploration.webp";

const domains = [
  {
    id: "commercial-space",
    number: "01",
    title: "Commercial Space",
    body:
      "Powering the commercial space economy with scalable infrastructure for orbital operations, space stations, in-space logistics, and satellite servicing.",
    image: commercialBg,
    items: [
      ["Orbital Infrastructure", <Orbit />],
      ["In-space Logistics", <Truck />],
      ["Commercial Space Stations", <Building2 />],
      ["Satellite Servicing", <Satellite />],
    ],
  },
  {
    id: "national-security-space",
    number: "02",
    title: "National Security Space",
    body:
      "Delivering resilient, survivable, and mission-critical infrastructure for national security, ISR, strategic systems, and space domain awareness.",
    image: securityBg,
    items: [
      ["ISR & Reconnaissance", <RadioTower />],
      ["Space Domain Awareness", <Eye />],
      ["Protected Communications", <Lock />],
      ["Strategic Space Systems", <Network />],
    ],
  },
  {
    id: "space-enabled-air-ground-water-systems",
    number: "03",
    title: "Space Enabled Air, Ground, Water Systems",
    body:
      "Integrating space-based infrastructure with domain systems to deliver superior situational awareness, precision, and operational advantage.",
    image: defenseBg,
    items: [
      ["C4ISR Systems", <Network />],
      ["Precision Targeting", <Crosshair />],
      ["Maritime Domain Awareness", <Ship />],
      ["Joint All-Domain Operations", <Globe2 />],
    ],
  },
  {
    id: "deep-space-exploration",
    number: "04",
    title: "Deep Space Exploration",
    body:
      "Building the infrastructure for humanity's expansion beyond Earth, from lunar operations to missions to Mars and beyond.",
    image: explorationBg,
    items: [
      ["Lunar Infrastructure", <Rocket />],
      ["Deep Space Logistics", <Truck />],
      ["Sustainable Habitats", <Waves />],
      ["Mars & Beyond Missions", <Globe2 />],
    ],
  },
];

function ApplicationDomain({ domain }) {
  return (
    <article
      className="application-domain"
      id={domain.id}
      style={{ backgroundImage: `url(${domain.image})` }}
    >
      <div className="application-domain-copy">
        <p className="applications-number">{domain.number}</p>
        <h3>{domain.title}</h3>
        <span className="applications-rule" />
        <p>{domain.body}</p>

        <ul>
          {domain.items.map(([label, icon]) => (
            <li key={label}>
              <span>{icon}</span>
              {label}
            </li>
          ))}
        </ul>

        <a href={`#${domain.id}`}>
          Learn More <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

export default function ApplicationsPage() {
  return (
    <>
      <Helmet>
        <title>Our Applications | Onnes Aerospace</title>
        <meta
          name="description"
          content="Infrastructure enabling every mission that matters — commercial space, national security space, dual-use systems, and deep space exploration."
        />
      </Helmet>
      <main className="site-shell applications-page">
        <Header />

        <section className="applications-hero" id="applications-top">
          <div
            className="applications-hero-bg"
            style={{ backgroundImage: `url(${heroBg})` }}
          />

          <div className="applications-hero-copy">
            <p className="applications-eyebrow">Our Applications</p>
            <h1>
              Infrastructure
              <br />
              Enabling Every
              <br />
              Mission That Matters
            </h1>
            <p>
              From commercial space to national security and space-enabled dual usage systems
              Onnes Aerospace provides the critical infrastructure that
              empowers the world&apos;s most ambitious missions.
            </p>
            <a className="outline-button" href="/contact#careers">
              Explore Our Applications <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="application-domains-section" id="applications">
          <div className="application-domains-heading">
            <p className="applications-eyebrow">Application Domains</p>
            <h2>Built For Today. Engineered For Tomorrow.</h2>
            <p>Four domains. One purpose. Limitless potential.</p>
          </div>

          <div className="application-domains-grid">
            {domains.map((domain) => (
              <ApplicationDomain domain={domain} key={domain.number} />
            ))}
          </div>
        </section>

        <FinalCta />

        <Footer />
      </main>
    </>
  );
}