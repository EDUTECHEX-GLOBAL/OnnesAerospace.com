import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import onnesWordmark from "../assets/onnes-wordmark.png";
import "../styles/footer.css";

const groups = [
  ["Company", "Vision", "Mission", "Leadership", "Careers", "Contact"],
  ["Platforms", "Orbital Infrastructure", "Lunar Infrastructure", "Deep Space Systems", "Autonomous Space Ecosystems"],
  ["Applications", "Commercial Space", "National Security Space", "Deep Space Exploration"],
  ["Technology", "Infrastructure Platform", "Intelligent Systems", "Advanced Engineering"],
  ["Media", "News", "Videos", "Insights"],
];

const footerLinks = {
  Vision: "/vision",
  Mission: "/vision#mission",
  Leadership: "/vision#leadership",
  Careers: "/contact#careers",
  Contact: "/contact",
  "Orbital Infrastructure": "/platforms#orbital-infrastructure",
  "Lunar Infrastructure": "/platforms#lunar-infrastructure",
  "Deep Space Systems": "/platforms#deep-space-systems",
  "Autonomous Space Ecosystems": "/platforms#autonomous-space-ecosystems",
  "Commercial Space": "/applications#commercial-space",
  "National Security Space": "/applications#national-security-space",
  "Deep Space Exploration": "/applications#deep-space-exploration",
  "Infrastructure Platform": "/technology#infrastructure-platform",
  "Intelligent Systems": "/technology#intelligent-systems",
  "Advanced Engineering": "/technology#advanced-engineering",
  News: "/media#news",
  Videos: "/media#videos",
  Insights: "/media#insights",
};

const socialLinks = [
  ["X", <FaXTwitter />, "https://x.com/OnnesAerospace"],
  ["LinkedIn", <FaLinkedinIn />, "https://www.linkedin.com/company/onnesaerospace/"],
];

export default function Footer() {
  return (
    <footer className="footer" id="media">
      <div className="footer-brand">
        <img className="brand-logo footer-logo" src={onnesWordmark} alt="Onnes" />
        <span className="brand-sub">AEROSPACE</span>
        <p>The next-generation deep space infrastructure company shaping humanity beyond Earth.</p>
        <div className="socials" aria-label="Social links">
          {socialLinks.map(([label, icon, url]) => (
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label} key={label}>
              {icon}
            </a>
          ))}
        </div>
      </div>
      {groups.map(([title, ...items]) => (
        <div className="footer-group" key={title}>
          <h3>{title}</h3>
          {items.map((item) => (
            <a href={footerLinks[item] || `#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>
              {item}
            </a>
          ))}
        </div>
      ))}
      <div className="legal">
        <span>© 2026 Onnes Aerospace. All rights reserved.</span>
        <span>Privacy Policy</span>
        <span>Terms of Use</span>
      </div>
    </footer>
  );
}