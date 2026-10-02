import { Helmet } from "react-helmet-async";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../styles/legal.css";

// NOTE: text is taken from the supplied "Terms&Conditions-onnes.docx".
const restrictions = [
  "publishing any Website material in any other media;",
  "selling, sublicensing and/or otherwise commercializing any Website material;",
  "publicly performing and/or showing any Website material;",
  "using this Website in any way that is or may be damaging to this Website;",
  "using this Website in any way that impacts user access to this Website;",
  "using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;",
  "engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;",
  "using this Website to engage in any advertising or marketing.",
];

export default function TermsOfUsePage() {
  return (
    <>
      <Helmet>
        <title>Terms &amp; Conditions | Onnes Aerospace</title>
        <meta
          name="description"
          content="The terms and conditions that govern your use of the Onnes Aerospace website."
        />
      </Helmet>

      <main className="site-shell legal-page">
        <Header />
        <section className="legal-content">
          <div className="legal-inner">
            <h1 className="legal-title">Terms &amp; Conditions</h1>
            <hr className="legal-rule" />

            <section className="legal-section" id="intro">
              <h2 className="legal-heading">Intro</h2>
              <p className="legal-text">
                These Website Standard Terms and Conditions written on this
                webpage shall manage your use of our website
              </p>
              <p className="legal-text">
                These Terms will be applied fully and affect to your use of this
                Website. By using this Website, you agreed to accept all terms
                and conditions written in here. You must not use this Website if
                you disagree with any of these Website Standard Terms and
                Conditions. These Terms and Conditions have been generated with
                the help of the Terms And Conditions Template and the Terms and
                Conditions Generator.
              </p>
            </section>

            <section className="legal-section" id="intellectual-property-rights">
              <h2 className="legal-heading">Intellectual Property Rights</h2>
              <p className="legal-text">
                Other than the content you own, under these Terms, Onnes and/or
                its licensors own all the intellectual property rights and
                materials contained in this Website.
              </p>
              <p className="legal-text">
                You are granted limited license only for purposes of viewing the
                material contained on this Website.
              </p>
            </section>

            <section className="legal-section" id="restrictions">
              <h2 className="legal-heading">Restrictions</h2>
              <p className="legal-text">
                You are specifically restricted from all of the following:
              </p>
              <ul className="legal-lines">
                {restrictions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="legal-text">
                Certain areas of this Website are restricted from being access
                by you and Onnes may further restrict access by you to any areas
                of this Website, at any time, in absolute discretion. Any user
                ID and password you may have for this Website are confidential
                and you must maintain confidentiality as well.
              </p>
            </section>

            <section className="legal-section" id="your-content">
              <h2 className="legal-heading">Your Content</h2>
              <p className="legal-text">
                In these Website Standard Terms and Conditions, “Your Content”
                shall mean any audio, video text, images or other material you
                choose to display on this Website. By displaying Your Content,
                you grant Onnes a non-exclusive, worldwide irrevocable, sub
                licensable license to use, reproduce, adapt, publish, translate
                and distribute it in any and all media.
              </p>
              <p className="legal-text">
                Your Content must be your own and must not be invading any
                third-party’s rights. Onnes reserves the right to remove any of
                Your Content from this Website at any time without notice.
              </p>
            </section>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}