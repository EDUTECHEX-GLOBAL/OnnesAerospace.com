const milestones = [
  ["2025", "Foundation Technologies", "Building the core infrastructure capabilities."],
  ["2030", "Persistent Orbital Infrastructure", "Scaling orbital depots, servicing, and commercial space infrastructure."],
  ["2035", "Commercial Lunar Operations", "Enabling lunar logistics, habitats, and surface operations."],
  ["2040", "Deep Space Logistics Networks", "Supporting deep-space missions and autonomous logistics systems."],
  ["2050+", "Interplanetary Infrastructure", "Building the backbone for humanity's expansion across the solar system."],
];

export default function Journey() {
  return (
    <section className="journey section-pad" id="technology">
      <div className="journey-head">
        <div>
          <p className="eyebrow">Future Beyond Earth</p>
          <h2>Our Journey Ahead</h2>
        </div>
      </div>
      <div className="timeline">
        {milestones.map(([year, title, body]) => (
          <article className="milestone" key={year}>
            <div className="year"><span></span>{year}</div>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
