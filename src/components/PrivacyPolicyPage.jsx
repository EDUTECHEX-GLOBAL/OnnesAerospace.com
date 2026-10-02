import { Helmet } from "react-helmet-async";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../styles/legal.css";

// NOTE: text is taken from the supplied "Privacy Policy-onnes.docx".
// Company name / website were changed from Starburst to Onnes Aerospace.
// Review the effective date before publishing.
const paragraphs = [
  "Your privacy is important to us. It is Onnes Aerospace’s policy to respect your privacy regarding any information we may collect from you across our website, https://onnesaerospace.com, and other sites we own and operate.",
  "We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.",
  "We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.",
  "We don’t share any personally identifying information publicly or with third-parties, except when required to by law.",
  "Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.",
  "You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.",
  "Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.",
  "This policy is effective as of 18 August 2020.",
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Onnes Aerospace</title>
        <meta
          name="description"
          content="How Onnes Aerospace collects, uses and protects your personal information."
        />
      </Helmet>

      <main className="site-shell legal-page">
        <Header />
        <section className="legal-content">
          <div className="legal-inner">
            <h1 className="legal-title">Privacy Policy</h1>
            <hr className="legal-rule" />
            <section className="legal-section">
              {paragraphs.map((text) => (
                <p className="legal-text" key={text.slice(0, 40)}>
                  {text}
                </p>
              ))}
            </section>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}