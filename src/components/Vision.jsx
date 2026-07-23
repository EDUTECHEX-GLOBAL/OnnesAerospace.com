const worlds = [
  ["Earth", "The world we build from."],
  ["Orbit", "Where economies begin."],
  ["Moon", "Where humanity grows."],
  ["Deep Space", "Where we become limitless."],
];

export default function Vision() {
  return (
    <section className="vision section-pad" id="vision">
      <div className="vision-copy">
        <p className="eyebrow">The Next Space Age</p>
        <h2>The Future Is Infrastructure</h2>
        <p>
          The next era of aerospace will not be defined by reaching space. It will be defined by
          staying there. Building. Operating. Expanding.
        </p>
        <p>This is the infrastructure layer that makes it possible.</p>
        <a className="text-link" href="#platforms">
          Our Vision <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="world-grid">
        {worlds.map(([title, body], index) => (
          <article className={`world-card world-${index + 1}`} key={title}>
            <div className={`world-image world-image-${index + 1}`} aria-hidden="true"></div>
            <div className="pin" aria-hidden="true"></div>

            <div className="world-content">
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </div>
      <a className="scroll-cue vision-cue" href="#platforms" aria-label="Scroll to platforms">
        <span></span> Scroll To Explore
      </a>
    </section>
  );
}