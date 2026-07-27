import { useLayoutEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaLinkedinIn } from "react-icons/fa";
import {
  Boxes,
  CircuitBoard,
  Crosshair,
  Cuboid,
  Gauge,
  Infinity,
  Rocket,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import Header from "./Header";
import FinalCta from "./FinalCta";
import Footer from "./Footer";
import "../styles/vision.css";

import futureEarth from "../assets/Orbital_Infra.webp";
import futureLunar from "../assets/LunarInfra2.webp";
import futureDeep from "../assets/DeepSpace3.webp";
import futureHumanity from "../assets/NationalSecuritySpace.webp";
import ramImage from "../assets/founder-ram.png";
import vikramImage from "../assets/founder-vikram3.png";
import rajeshImage from "../assets/founder-rajesh.jpeg";
import visionPanelImg from "../assets/Infrastructure_newspace.webp";
import missionPanelImg from "../assets/LunarInfra3.webp";

const heroPillars = [
  ["Persistent Operations", <Target />],
  ["Autonomous Systems", <Cuboid />],
  ["Humanity Beyond Earth", <Users />],
  ["Limitless Potential", <Infinity />],
];

const visionPoints = [
  ["Enable persistent operations across orbit and beyond", <Rocket />],
  ["Support a sustainable lunar and deep space economy", <Cuboid />],
  ["Build autonomous ecosystems that scale", <Gauge />],
  ["Unlock humanity's limitless potential in space", <Crosshair />],
];

const missionSteps = [
  ["Design", "Advanced infrastructure for the harshest environments.", <Boxes />],
  ["Develop", "Intelligent systems with autonomy at the core.", <CircuitBoard />],
  ["Deliver", "Mission-critical capabilities that create real-world impact.", <Cuboid />],
];

const futureCards = [
  ["Earth Orbit", "Persistent infrastructure and logistics networks powering a vibrant orbital economy and commercial space.", futureEarth, <CircuitBoard />],
  ["Lunar Frontier", "Enabling a sustainable human presence through logistics, habitats, and resource utilization.", futureLunar, <Gauge />],
  ["Deep Space", "Autonomous systems and logistics networks that extend human reach to Mars and beyond.", futureDeep, <Rocket />],
  ["Humanity's Future", "A multi-planetary civilization connected by intelligent infrastructure and limitless opportunity.", futureHumanity, <Users />],
];

const founders = [
  [
    "Ram K Aluru",
    ramImage,
    "https://www.linkedin.com/in/ram-k-aluru-ph-d-77608a3b",
  ],
  [
    "Vikram S Raghavan",
    vikramImage,
    "https://www.linkedin.com/in/vikram-s-raghavan-ph-d-5293481a3",
  ],
  [
    "Rajesh Adla",
    rajeshImage,
    "https://www.linkedin.com/in/rajeshkumaradla",
  ],
];

const values = [
  ["Courage To Build", "We take on the hardest problems in space and engineer solutions that create lasting impact.", <ShieldCheck />],
  ["Engineering Excellence", "We pursue perfection in design, testing, and execution to deliver unmatched performance.", <Target />],
  ["Mission First", "Every decision is guided by our mission to build infrastructure that enables humanity beyond Earth.", <Rocket />],
  ["One Team, One Future", "We collaborate with partners, customers, and each other to achieve extraordinary outcomes.", <Users />],
  ["Endless Exploration", "We are driven by curiosity and the belief that the universe holds infinite opportunities.", <Infinity />],
];

export default function VisionPage() {
  const visionCopyRef = useRef(null);
  const missionCopyRef = useRef(null);
  const [copyHeight, setCopyHeight] = useState(null);

  useLayoutEffect(() => {
    const measure = () => {
      if (window.innerWidth <= 1024) {
        setCopyHeight(null);
        return;
      }
      const visionH = visionCopyRef.current ? visionCopyRef.current.offsetHeight : 0;
      const missionH = missionCopyRef.current ? missionCopyRef.current.offsetHeight : 0;
      setCopyHeight(Math.max(visionH, missionH));
    };

    measure();
    window.addEventListener("resize", measure);
    return function cleanup() {
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Vision | Onnes Aerospace</title>
        <meta
          name="description"
          content="A future where humanity thrives beyond Earth. Onnes Aerospace is building the operational backbone for a multi-planetary civilization."
        />
      </Helmet>
      <main className="site-shell vision-page">
        <Header />

        <section className="vision-hero" id="vision">
          <div className="vision-hero-copy">
            <p className="eyebrow">Our Vision</p>
            <h1>A Future Where Humanity Thrives Beyond Earth</h1>
            <p>We envision a humanity that is multi-planetary, sustained by intelligent infrastructure spanning orbit, the Moon, and deep space.</p>
            <p>Onnes Aerospace is building the operational backbone that makes this future possible.</p>
            <div className="actions">
              <a className="outline-button" href="#mission">
                Explore Our Vision <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="hero-pillar-list">
            {heroPillars.map(function (pillar) {
              var label = pillar[0];
              var icon = pillar[1];
              return (
                <div className="hero-pillar" key={label}>
                  <span>{icon}</span>
                  <strong>{label}</strong>
                </div>
              );
            })}
          </div>
        </section>

        <section className="vision-mission-split" id="mission">
          <article className="panel vision-panel">
            <p className="eyebrow">Our Vision</p>

            <div
              className="panel-copy"
              ref={visionCopyRef}
              style={copyHeight ? { minHeight: copyHeight } : undefined}
            >
              <h2>
                Infrastructure For A New <span>Space Civilization</span>
              </h2>
              <p>We are building the foundation for a future where humanity lives, works, and explores across the cosmos. A future that is sustainable, autonomous, and driven by innovation.</p>
            </div>

            <div className="panel-image">
              <img src={visionPanelImg} alt="Infrastructure for a new space civilization" />
            </div>

            <div className="vision-point-list">
              {visionPoints.map(function (point) {
                var text = point[0];
                var icon = point[1];
                return (
                  <div className="vision-point" key={text}>
                    <span>{icon}</span>
                    <p>{text}</p>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="panel mission-panel">
            <p className="eyebrow">Our Mission</p>

            <div
              className="panel-copy"
              ref={missionCopyRef}
              style={copyHeight ? { minHeight: copyHeight } : undefined}
            >
              <h2>
                To Engineer The Infrastructure That Enables Humanity's Expansion <span>Beyond Earth</span>
              </h2>
              <p>Onnes Aerospace develops intelligent, resilient, and autonomous infrastructure systems that empower the world's most ambitious space and defense missions.</p>
            </div>

            <div className="panel-image">
              <img src={missionPanelImg} alt="Engineering infrastructure beyond Earth" />
            </div>

            <div className="mission-step-list">
              {missionSteps.map(function (step) {
                var title = step[0];
                var text = step[1];
                var icon = step[2];
                return (
                  <div className="mission-step" key={title}>
                    <span>{icon}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        <section className="future-section" id="future-beyond-earth">
          <div className="future-head">
            <p className="eyebrow">Our Future Beyond Earth</p>
            <h2>Building The Next Era Of Humanity</h2>
            <p>Earth orbit, lunar frontier, deep space, humanity's future.</p>
          </div>

          <div className="future-card-grid">
            {futureCards.map(function (card) {
              var title = card[0];
              var text = card[1];
              var image = card[2];
              var icon = card[3];
              return (
                <article className="future-card" key={title}>
                  <div className="future-card-image">
                    <img src={image} alt={title} />
                  </div>
                  <div className="future-card-body">
                    <span>{icon}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="leadership-section" id="leadership">
          <div className="leadership-intro">
            <h2>Founders</h2>
          </div>

          <div className="founder-grid">
            {founders.map(function (founder) {
              var name = founder[0];
              var image = founder[1];
              var linkedin = founder[2];
              return (
                <article className="founder-card" key={name}>
                  <div
                    className="founder-image"
                    style={{ backgroundImage: "url(" + image + ")" }}
                  />
                  <div className="founder-overlay">
                    <div className="founder-overlay-info">
                      <h3>{name}</h3>
                    </div>

                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name + " LinkedIn"}
                      className="founder-linkedin"
                    >
                      <FaLinkedinIn />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="values-section">
          <p className="eyebrow">Our Values</p>
          <div className="values-grid">
            {values.map(function (value) {
              var title = value[0];
              var text = value[1];
              var icon = value[2];
              return (
                <article className="value-item" key={title}>
                  <span>{icon}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <FinalCta />
        <Footer />
      </main>
    </>
  );
}