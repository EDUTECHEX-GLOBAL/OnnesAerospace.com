import { useState } from "react";
import axios from "axios";
import { ArrowUpRight, Play } from "lucide-react";
import { Helmet } from "react-helmet-async";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../styles/media.css";
import heroBg from "../assets/MediaPageMain.webp";
import featuredNews from "../assets/AerospaceWorkshop.webp";
import newsletterBg from "../assets/journey-bg.webp"; // ← swap filename if different

const API = process.env.REACT_APP_API_URL;

const newsItems = [
  [
    "Jun 17, 2026",
    "Advanced Health Research Continues Aboard the Space Station With AR and VR Tools",
    "https://www.nasa.gov/blogs/spacestation/2026/06/17/advanced-health-research-on-station-using-augmented-virtual-reality-tools/",
  ],
  [
    "Jun 17, 2026",
    "Ariane 6 Launches With More Powerful Boosters, Setting a New Record for Europe",
    "https://www.esa.int/Newsroom/Press_Releases/Ariane_6_launches_with_more_powerful_boosters_a_new_record_for_Europe",
  ],
  [
    "Jun 08, 2026",
    "ESA Signs an Agreement With Vast on Behalf of the Czech Republic",
    "https://www.esa.int/Newsroom/Press_Releases/ESA_signs_an_Agreement_with_Vast_on_behalf_of_the_Czech_Republic",
  ],
  [
    "Mar 27, 2026",
    "NASA Selects Intuitive Machines to Deliver Artemis Science and Tech to the Moon",
    "https://www.nasa.gov/missions/artemis/clps/nasa-selects-intuitive-machines-to-deliver-artemis-science-tech-to-moon/",
  ],
  [
    "Mar 24, 2026",
    "NASA's Water-Hunting Tool Will Help Scout the Moon's South Pole",
    "https://www.nasa.gov/solar-system/moon/nasas-water-hunting-tool-will-help-scout-moons-south-pole/",
  ],
];

const featuredArticle = {
  date: "Jun 18, 2026",
  title: "Key Outcomes of the 347th ESA Council Meeting",
  url: "https://www.esa.int/Newsroom/Press_Releases/Key_outcomes_of_the_347th_ESA_Council_meeting",
  blurb:
    "ESA's governing council met in Paris to confirm new leadership appointments, advance its crewed mission concept, and deepen international partnerships spanning Earth observation and human spaceflight.",
};

// videos array commented out — video section is not yet active
// const videos = [
//   ["02:18", "Lunar Infrastructure for a Sustainable Future", "Enabling long-term human presence and operations on the Moon.", videoThumb1],
//   ["02:55", "Deep Space Logistics Reimagined", "Autonomous systems that extend human reach to Mars and beyond.", videoThumb2],
//   ["02:31", "Autonomous Space Ecosystems: The Next Operational Paradigm", "Self-operating infrastructure for a resilient and adaptive space economy.", videoThumb3],
// ];

// insights array commented out — insights section is not yet active
// const insights = [
//   ["May 12, 2025", "The New Space Economy Requires a New Infrastructure Layer", "Why infrastructure is the next trillion-dollar opportunity in space.", insight1],
//   ["May 01, 2025", "Modular by Design: Building Systems for an Uncertain Future", "How modular architectures enable flexibility, resilience, and rapid adaptation.", insight2],
//   ["Apr 21, 2025", "Sustaining Life Beyond Earth: The Role of Intelligent Systems", "Intelligent, autonomous systems are the foundation of sustainable exploration.", insight3],
//   ["Apr 07, 2025", "Beyond Orbit: Preparing for Humanity's Next Great Leap", "Deep space missions demand a new era of engineering and endurance.", insight4],
// ];

function TextLink({ children, href }) {
  return (
    <a className="media-link" href={href} target="_blank" rel="noopener noreferrer">
      {children} <ArrowUpRight />
    </a>
  );
}

function PlayMark() {
  return (
    <span className="media-play" aria-hidden="true">
      <Play />
    </span>
  );
}

export default function MediaPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [feedback, setFeedback] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setFeedback("Please enter your email address.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const res = await axios.post(`${API}/api/admin-subscribe`, { email });
      setStatus("success");
      setFeedback(res.data?.message || "Subscribed successfully!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setFeedback(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>Media | Onnes Aerospace</title>
        <meta
          name="description"
          content="Stories from the frontier of humanity's next era — news, mission updates, and perspectives from Onnes Aerospace and the industries shaping the future beyond Earth."
        />
      </Helmet>
      <main className="site-shell media-page">
        <Header />

        <section className="media-hero" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="media-hero-copy">
            <p className="media-eyebrow">Media</p>
            <h1>Stories From The Frontier Of Humanity's Next Era</h1>
            <p>
              The latest news, mission updates, expert insights, and perspectives from Onnes Aerospace and the
              industries shaping the future beyond Earth.
            </p>
          </div>
        </section>

        <section className="media-tabs" id="news">
          <nav aria-label="Media sections">
            <a className="active" href="#news">News</a>
            {/* <a href="#videos">Videos</a>
            <a href="#insights">Insights</a> */}
          </nav>
          {/* <TextLink href="#news">View All News</TextLink> */}
        </section>

        <section className="media-news-grid">
          <article className="media-feature-card">
            <div className="media-card-image" style={{ backgroundImage: `url(${featuredNews})` }}>
              <span>Featured</span>
            </div>
            <div className="media-card-copy">
              <p className="media-date">{featuredArticle.date}</p>
              <h2>{featuredArticle.title}</h2>
              <p>{featuredArticle.blurb}</p>
              <TextLink href={featuredArticle.url}>Read More</TextLink>
            </div>
          </article>

          <div className="media-news-list">
            {newsItems.map(([date, title, url]) => (
              <article className="media-list-item" key={title}>
                <div>
                  <p className="media-date">{date}</p>
                  <h3>{title}</h3>
                  <TextLink href={url}>Read More</TextLink>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* <section className="media-video-section" id="videos">
          <div className="media-section-head">
            <p className="media-eyebrow">Featured Video</p>
            <TextLink href="#videos">View All Videos</TextLink>
          </div>
          <div className="media-video-grid">
            <article className="media-video-feature" style={{ backgroundImage: `url(${featuredVideo})` }}>
              <PlayMark />
              <div>
                <p className="media-date">03:42 min</p>
                <h2>The Infrastructure that Powers Humanity Beyond Earth</h2>
                <p>A vision for the future of persistent operations across orbit, the Moon, and deep space.</p>
              </div>
            </article>
            <div className="media-video-list">
              {videos.map(([time, title, body, image]) => (
                <article className="media-video-item" key={title}>
                  <div style={{ backgroundImage: `url(${image})` }}>
                    <PlayMark />
                  </div>
                  <div>
                    <p className="media-date">{time}</p>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section> */}

        {/* <section className="media-insights" id="insights">
          <div className="media-section-head">
            <p className="media-eyebrow">Latest Insights</p>
            <TextLink href="#insights">View All Insights</TextLink>
          </div>
          <div className="media-insight-grid">
            {insights.map(([date, title, body, image]) => (
              <article className="media-insight-card" key={title}>
                <div style={{ backgroundImage: `url(${image})` }} />
                <p className="media-date">{date}</p>
                <h3>{title}</h3>
                <p>{body}</p>
                <TextLink href="#insights">Read Insight</TextLink>
              </article>
            ))}
          </div>
        </section> */}

        <section id="subscribe" className="media-newsletter" style={{ backgroundImage: `url(${newsletterBg})` }}>
          <div>
            <p className="media-eyebrow">Stay Connected</p>
            <h2>Get The Latest News And Insights</h2>
            <p>Delivered to your inbox.</p>
          </div>

          <div className="media-newsletter-right">
            <form onSubmit={handleSubscribe} noValidate>
              <input
                aria-label="Email address"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
              />
              <button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Subscribing..." : "Subscribe"} <ArrowUpRight />
              </button>
            </form>
            {feedback && (
              <p
                className={`media-newsletter-feedback ${
                  status === "success" ? "is-success" : "is-error"
                }`}
                role="status"
              >
                {feedback}
              </p>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}