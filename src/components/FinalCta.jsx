import { Link } from "react-router-dom";

export default function FinalCta() {
  return (
    <section className="final-cta" id="contact">
      <div>
        <p className="eyebrow">Onnes Aerospace</p>
        <h2>Building The Operational Backbone Of Humanity's Future In Space</h2>
        <p>
          From orbit to the Moon and beyond, we build the infrastructure that makes the impossible,
          possible.
        </p>
      </div>
      <div className="cta-actions">
        <Link className="solid-button" to="/contact#mission-brief">
          Partner With Us <span aria-hidden="true">↗</span>
        </Link>
        <a className="outline-button" href="/contact#careers">
          Explore Careers <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}