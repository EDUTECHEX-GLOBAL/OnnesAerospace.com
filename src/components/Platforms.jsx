const OrbitalIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="5" stroke="#008CFF" strokeWidth="1.8"/>
    <line x1="14" y1="0" x2="14" y2="8" stroke="#008CFF" strokeWidth="1.8"/>
    <line x1="14" y1="20" x2="14" y2="28" stroke="#008CFF" strokeWidth="1.8"/>
    <line x1="0" y1="14" x2="8" y2="14" stroke="#008CFF" strokeWidth="1.8"/>
    <line x1="20" y1="14" x2="28" y2="14" stroke="#008CFF" strokeWidth="1.8"/>
    <circle cx="14" cy="14" r="11" stroke="#008CFF" strokeWidth="1.2" strokeDasharray="3 2"/>
  </svg>
);

const LunarIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Rover body */}
    <rect x="8" y="12" width="14" height="7" rx="1.5" stroke="#008CFF" strokeWidth="1.7"/>
    {/* Antenna mast */}
    <line x1="15" y1="12" x2="15" y2="7" stroke="#008CFF" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Antenna dish */}
    <line x1="12.5" y1="7" x2="17.5" y2="7" stroke="#008CFF" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12.5" y1="7" x2="14" y2="9" stroke="#008CFF" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="17.5" y1="7" x2="16" y2="9" stroke="#008CFF" strokeWidth="1.2" strokeLinecap="round"/>
    {/* Left solar panel */}
    <rect x="3" y="11" width="5" height="3" rx="0.5" stroke="#008CFF" strokeWidth="1.4"/>
    <line x1="5.5" y1="11" x2="5.5" y2="14" stroke="#008CFF" strokeWidth="0.8"/>
    {/* Right solar panel */}
    <rect x="22" y="11" width="5" height="3" rx="0.5" stroke="#008CFF" strokeWidth="1.4"/>
    <line x1="24.5" y1="11" x2="24.5" y2="14" stroke="#008CFF" strokeWidth="0.8"/>
    {/* Left wheel */}
    <circle cx="11" cy="21" r="2.8" stroke="#008CFF" strokeWidth="1.6"/>
    <circle cx="11" cy="21" r="0.8" fill="#008CFF"/>
    {/* Right wheel */}
    <circle cx="19" cy="21" r="2.8" stroke="#008CFF" strokeWidth="1.6"/>
    <circle cx="19" cy="21" r="0.8" fill="#008CFF"/>
  </svg>
);

const DeepSpaceIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Central node */}
    <circle cx="14" cy="14" r="3" fill="#008CFF"/>
    {/* Outer nodes */}
    <circle cx="4" cy="8" r="2" stroke="#008CFF" strokeWidth="1.6"/>
    <circle cx="24" cy="8" r="2" stroke="#008CFF" strokeWidth="1.6"/>
    <circle cx="4" cy="20" r="2" stroke="#008CFF" strokeWidth="1.6"/>
    <circle cx="24" cy="20" r="2" stroke="#008CFF" strokeWidth="1.6"/>
    <circle cx="14" cy="3" r="2" stroke="#008CFF" strokeWidth="1.6"/>
    <circle cx="14" cy="25" r="2" stroke="#008CFF" strokeWidth="1.6"/>
    {/* Connection lines */}
    <line x1="14" y1="11" x2="14" y2="5" stroke="#008CFF" strokeWidth="1.2"/>
    <line x1="14" y1="17" x2="14" y2="23" stroke="#008CFF" strokeWidth="1.2"/>
    <line x1="11.4" y1="12.3" x2="5.8" y2="9.4" stroke="#008CFF" strokeWidth="1.2"/>
    <line x1="16.6" y1="12.3" x2="22.2" y2="9.4" stroke="#008CFF" strokeWidth="1.2"/>
    <line x1="11.4" y1="15.7" x2="5.8" y2="18.6" stroke="#008CFF" strokeWidth="1.2"/>
    <line x1="16.6" y1="15.7" x2="22.2" y2="18.6" stroke="#008CFF" strokeWidth="1.2"/>
  </svg>
);

const AutonomousIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Central hub */}
    <circle cx="14" cy="14" r="3.5" stroke="#008CFF" strokeWidth="1.8"/>
    {/* Inner ring */}
    <circle cx="14" cy="14" r="7.5" stroke="#008CFF" strokeWidth="1.2" strokeDasharray="2.5 2"/>
    {/* Outer ring */}
    <circle cx="14" cy="14" r="12" stroke="#008CFF" strokeWidth="1" strokeDasharray="2 2.5"/>
    {/* Orbital dots */}
    <circle cx="14" cy="6.5" r="1.8" fill="#008CFF"/>
    <circle cx="21.5" cy="14" r="1.8" fill="#008CFF"/>
    <circle cx="14" cy="21.5" r="1.8" fill="#008CFF"/>
    <circle cx="6.5" cy="14" r="1.8" fill="#008CFF"/>
  </svg>
);

const platforms = [
  {
    title: "Orbital Infrastructure",
    body: "Enabling persistent operations, in-space logistics, and orbital servicing at scale.",
    Icon: OrbitalIcon,
  },
  {
    title: "Lunar Infrastructure",
    body: "Logistics, habitats, and surface systems for long-duration lunar operations.",
    Icon: LunarIcon,
  },
  {
    title: "Deep Space Systems",
    body: "Infrastructure for deep-space logistics, long-duration missions, and interplanetary travel.",
    Icon: DeepSpaceIcon,
  },
  {
    title: "Autonomous Space Ecosystems",
    body: "Intelligent, self-operating systems that power the future space economy.",
    Icon: AutonomousIcon,
  },
];

export default function Platforms() {
  return (
    <section className="platforms section-pad" id="platforms">
      <div className="platforms-head">
        <div>
          <p className="eyebrow">Our Platforms</p>
          <h2>Infrastructure For Every Frontier</h2>
        </div>
        <p>
          Modular. Intelligent. Autonomous.
          Built for the harshest environments.
          Designed for the longest missions.
        </p>
      </div>
      <div className="platform-grid">
        {platforms.map(({ title, body, Icon }, index) => (
          <article className={`platform-card platform-${index + 1}`} key={title}>
            <div className="platform-image"></div>
            <div className="icon-ring">
              <Icon />
            </div>
            <h3>{title}</h3>
            <p>{body}</p>
            <a className="text-link" href="#applications">
              Explore <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}