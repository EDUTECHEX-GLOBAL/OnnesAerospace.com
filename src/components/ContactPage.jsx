import { useState } from "react";
import {
  Banknote,
  BookOpen,
  Boxes,
  Building2,
  CalendarDays,
  Globe2,
  Landmark,
  Mail,
  RadioTower,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

import api from "../api";
import Header from "./Header.jsx";
import FinalCta from "./FinalCta.jsx";
import Footer from "./Footer.jsx";
import "../styles/contact.css";

import heroImage from "../assets/OrbitalINfra.webp";
import commercialImage from "../assets/CommercialSpace2.webp";
import securityImage from "../assets/NationalSecuritySpace.webp";
import partnersImage from "../assets/IndustryPartners.webp";
import investorsImage from "../assets/Investors.webp";
import missionEarth from "../assets/contact/generated-earth-sunrise.png";
import globalMap from "../assets/generated-global-map.webp";
import careersLab from "../assets/contactcareers1.webp";
import investorEarth from "../assets/contact/generated-earth-sunrise.png";
// import futureEarth from "../assets/hero-bg.png";

const capabilityItems = [
  ["Global Partnerships", <Globe2 />],
  ["Space & Defense Applications", <ShieldCheck />],
  ["Advanced Infrastructure Platforms", <Building2 />],
  ["Deep Space Mission Enablement", <RadioTower />],
];

const workCards = [
  [
    "Commercial Space",
    "Enabling persistent operations through orbital infrastructure, logistics systems, servicing capabilities, and future space economy platforms.",
    commercialImage,
    <Boxes />,
  ],
  [
    "National Security",
    "Mission-critical infrastructure supporting resilient communications, strategic awareness, and future operational architectures.",
    securityImage,
    <ShieldCheck />,
  ],
  [
    "Industry Partners",
    "Joint development, advanced manufacturing, technology integration, and strategic ecosystem partnerships.",
    partnersImage,
    <Users />,
  ],
  [
    "Investors & Institutions",
    "Partnering with visionary organizations committed to shaping humanity beyond Earth.",
    investorsImage,
    <Landmark />,
  ],
];

const mediaItems = [
  ["Press", "Media inquiries, interviews, and company announcements.", <Mail />],
  ["Events", "Conference participation, speaking opportunities, and strategic forums.", <CalendarDays />],
  ["Research", "Academic collaboration, publications, and future space studies.", <BookOpen />],
];

// ── Mission brief form config ────────────────────────────────────────────
const countryOptions = [
  "India",
  "United States",
  "United Kingdom",
  "France",
  "Germany",
  "Israel",
  "Japan",
  "Singapore",
  "United Arab Emirates",
  "Canada",
  "Australia",
  "Netherlands",
  "Italy",
  "Spain",
  "Sweden",
  "Norway",
  "South Korea",
  "Finland",
  "Belgium",
  "Switzerland",
  "Poland",
  "Denmark",
  "Brazil",
  "Malaysia",
  "New Zealand",
  "Czech Republic",
  "Austria",
  "Other Countries",
];

const areaOfInterestOptions = [
  "Space Infrastructure",
  "National Security & Defence",
  "Advanced Aerospace Systems",
  "Launch Vehicles",
  "Satellites",
  "Orbital Logistics",
  "Lunar Infrastructure & ISRU",
  "Hydrogen & Clean Energy",
  "Strategic Partnership",
  "Investment",
  "Media",
  "Careers",
  "Other",
];

const projectStageOptions = [
  "Concept / Early Research",
  "Technology Evaluation",
  "Prototype Development",
  "Qualification & Testing",
  "Production Program",
  "Partnership Discussion",
  "General Inquiry",
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const ACCEPTED_FILE_TYPES = ["application/pdf"];

const defaultForm = {
  fullName: "",
  organization: "",
  email: "",
  phone: "",
  country: "",
  areaOfInterest: "",
  projectStage: "",
  message: "",
};

const CONFIRMATION_MESSAGE =
  "Thank you for contacting Onnes Aerospace. Your inquiry has been received by our engineering and business development team. We typically respond within 2 business days. For mission-critical or time-sensitive requests, please mention it in your message.";

export default function ContactPage() {
  const [form, setForm] = useState(defaultForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      setFileError("");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File exceeds the 25 MB limit.");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setFileError("Only PDF files are accepted.");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    setFileError("");
    setSelectedFile(file);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    if (fileError) return;

    setSubmitting(true);
    setStatus("Transmitting...");

    try {
      const payload = new FormData();
      payload.append("fullName", form.fullName);
      payload.append("email", form.email);
      payload.append("organization", form.organization);
      payload.append("mobile", form.phone);
      payload.append("country", form.country);
      payload.append("product", form.areaOfInterest);
      payload.append("projectStage", form.projectStage);
      payload.append("message", form.message);
      if (selectedFile) payload.append("file", selectedFile);

      await api.post("/api/admin-contact", payload, {
        headers: { "Content-Type": undefined },
      });

      setForm(defaultForm);
      setSelectedFile(null);
      setStatus(CONFIRMATION_MESSAGE);
    } catch (error) {
      setStatus("Message ready. Please email info@onnes.in if transmission is unavailable.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Onnes Aerospace</title>
        <meta
          name="description"
          content="Let's build the future beyond Earth. Contact Onnes Aerospace for partnerships, investment, careers, and media inquiries."
        />
      </Helmet>
      <main className="site-shell contact-page">
        <Header />

        <section className="contact-hero" id="contact-top">
          <div className="contact-hero-bg" style={{ backgroundImage: `url(${heroImage})` }} />
          <div className="contact-hero-copy">
            <p className="contact-eyebrow">Contact Onnes Aerospace</p>
            <h1>
              Let's Build The Future <span>Beyond Earth.</span>
            </h1>
            <p>
              Whether you're a government agency, commercial space operator, strategic partner, investor,
              or world-class engineer, we're building the infrastructure that will enable humanity's next chapter
              beyond Earth.
            </p>
            <div className="actions">
              <a className="solid-button" href="#mission-brief">
                Partner With Us <span aria-hidden="true">→</span>
              </a>
              <a className="outline-button" href="#careers">
                Explore Careers <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="contact-capabilities" aria-label="Contact categories">
          {capabilityItems.map(([label, icon]) => (
            <article key={label}>
              <span>{icon}</span>
              <strong>{label}</strong>
            </article>
          ))}
        </section>

        <section className="contact-work-section">
          <h2>Who We Work With</h2>
          <div className="contact-work-grid">
            {workCards.map(([title, text, image, icon]) => (
              <article className="contact-work-card" key={title}>
                <div className="contact-work-image" style={{ backgroundImage: `url(${image})` }} />
                <span className="contact-card-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <a href="#mission-brief" aria-label={`${title} mission brief`}>
                  →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="mission-brief" id="mission-brief">
          <aside className="mission-intro" style={{ backgroundImage: `url(${missionEarth})` }}>
            <p className="contact-eyebrow">Start A Mission</p>
            <h2>Transmit Your Mission Brief</h2>
            <span className="contact-rule" />
            <p>
              Whether you're exploring partnership opportunities, technology collaboration, investment
              discussions, or mission concepts, we'd love to hear from you.
            </p>
          </aside>
          <form className="mission-form" onSubmit={submitForm}>
            <input
              name="fullName"
              value={form.fullName}
              onChange={updateField}
              placeholder="Full Name *"
              required
            />
            <input
              name="organization"
              value={form.organization}
              onChange={updateField}
              placeholder="Company / Organization *"
              required
            />
            <div className="field-row">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="Work Email *"
                required
              />
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={updateField}
                placeholder="Phone Number"
              />
            </div>
            <div className="field-row">
              <select name="country" value={form.country} onChange={updateField} aria-label="Country" required>
                <option value="">Country *</option>
                {countryOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select
                name="areaOfInterest"
                value={form.areaOfInterest}
                onChange={updateField}
                aria-label="Area of Interest"
                required
              >
                <option value="">Area of Interest *</option>
                {areaOfInterestOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <select
              name="projectStage"
              value={form.projectStage}
              onChange={updateField}
              aria-label="Project Stage"
            >
              <option value="">Project Stage</option>
              {projectStageOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <textarea
              name="message"
              value={form.message}
              onChange={updateField}
              placeholder="How Can We Help? * — Briefly describe your project, technical requirements, or collaboration opportunity."
              required
            />

            <div className="file-upload-field">
              <span className="file-upload-label">Upload Technical Brief / NDA / RFP (Optional)</span>
              <label className="file-input-wrap">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </label>
              <span className="file-hint">Accepted: PDF only</span>
              {fileError && <span className="file-error">{fileError}</span>}
              {selectedFile && !fileError && (
                <span className="file-hint">Selected: {selectedFile.name}</span>
              )}
            </div>

            <div className="form-action-row">
              <button className="solid-button" type="submit" disabled={submitting}>
                {submitting ? "Transmitting..." : (
                  <>Discuss Your Mission <span aria-hidden="true">→</span></>
                )}
              </button>
              {status && <p>{status}</p>}
            </div>

            <div className="mission-footer-note">
              <p>Looking for something specific?</p>
              <p>Email: <a href="mailto:info@onnes.in">info@onnes.in</a></p>
              <p>Serving customers across Space and Advanced Aerospace</p>
            </div>
          </form>
        </section>

        <section className="global-presence">
          <div className="global-copy">
            <p className="contact-eyebrow">Global Presence</p>
            <h2>Infrastructure Nodes Across The World</h2>
            <span className="contact-rule" />
            <p>
              Building the infrastructure layer for humanity's expansion beyond Earth requires global
              collaboration, world-class talent, and strategic partnerships.
            </p>
          </div>
          <div className="global-map" style={{ backgroundImage: `url(${globalMap})` }} aria-hidden="true" />
          <div className="global-locations">
            <h3>United States</h3>
            <p>El Segundo, CA<br />Washington, D.C.</p>
            <h3>India</h3>
            <p>Bengaluru<br />Hyderabad</p>
            <h3>Future Nodes</h3>
            <p>Tokyo, Japan</p>
          </div>
        </section>

        <section className="career-band" id="careers">
          <div className="career-image" style={{ backgroundImage: `url(${careersLab})` }} aria-hidden="true" />
          <div className="career-copy">
            <p className="contact-eyebrow">Careers</p>
            <h2>Build What Comes Next.</h2>
            <p>
              The future beyond Earth will not be built by a single company. It will be built by extraordinary
              people solving humanity's hardest engineering challenges.
            </p>
            <p className="career-email">
              Write to us at <a href="mailto:info@onnes.in">info@onnes.in</a>
            </p>
            <div className="career-actions">
              <a className="solid-button" href="mailto:info@onnes.in">
                View Open Roles <span aria-hidden="true">→</span>
              </a>
              <a className="outline-button" href="mailto:info@onnes.in">
                Meet The Team <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="media-speaking">
          <p className="contact-eyebrow">Media & Speaking</p>
          <div className="media-grid">
            {mediaItems.map(([title, text, icon]) => (
              <article key={title}>
                <span>{icon}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <a href="mailto:press@onnes.in" aria-label={`${title} inquiry`}>→</a>
              </article>
            ))}
          </div>
        </section>

        <FinalCta />
        <Footer />
      </main>
    </>
  );
}