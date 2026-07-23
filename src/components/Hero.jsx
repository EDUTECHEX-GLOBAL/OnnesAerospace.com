import heroBg from "../assets/Homepagevid3.mp4";

export default function Hero() {
  return (
    <section className="hero section-bg" id="home">
      <video
        className="hero-video"
        src={heroBg}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      />

      <div className="hero-video-mask" aria-hidden="true" />

      <div className="hero-copy">
        <h1 className="hero-title">
          <span className="hero-blue">
            The Next-Generation Deep Space Infrastructure Company
          </span>{" "}
          <span className="hero-white">
            Shaping Humanity Beyond Earth
          </span>
        </h1>

        <p>
          Onnes Aerospace is engineering the infrastructure systems that enable
          persistent orbital operations, lunar logistics, autonomous space
          ecosystems, and deep-space missions.
        </p>

        <div className="actions">
          <a className="solid-button" href="/vision">
            Explore Our Vision <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <a className="scroll-cue" href="#vision" aria-label="Scroll to explore">
        <span></span> Scroll To Explore
      </a>
    </section>
  );
}