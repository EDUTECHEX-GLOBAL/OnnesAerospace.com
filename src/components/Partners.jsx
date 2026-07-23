import { useMemo } from "react";

import starburst from "../assets/PartnerLogos/STARBURST.png";
import iai from "../assets/PartnerLogos/IAI.png";
import astra from "../assets/PartnerLogos/ASTRA.png";
import iimaVentures from "../assets/PartnerLogos/IIMAVentures-04.png";
import pointOne from "../assets/PartnerLogos/PointOne.png";
import seedFund from "../assets/PartnerLogos/Partner_2.1.png";
import cse from "../assets/PartnerLogos/cropped_cse_logo.svg";
import paras from "../assets/PartnerLogos/PARAS.png";
import orbitAid from "../assets/PartnerLogos/Client_3.png";
import aws from "../assets/PartnerLogos/Partner_7.1.png";
import nvidia from "../assets/PartnerLogos/Partner_nvidia.png";
import tHub from "../assets/PartnerLogos/Partner_1.1.png";
import ventureCatalyst from "../assets/PartnerLogos/Partner_3.1.jpg";
import investSA from "../assets/PartnerLogos/Partner_4.4.png";

const partners = [
  { src: starburst, alt: "Starburst" },
  { src: iai, alt: "IAI" },
  { src: astra, alt: "Astra" },
  { src: iimaVentures, alt: "IIMA Ventures" },
  { src: pointOne, alt: "PointOne" },
  { src: seedFund, alt: "Startup India Seed Fund Scheme" },
  { src: cse, alt: "CSE" },
  { src: paras, alt: "Paras" },
  { src: orbitAid, alt: "Orbit Aid" },
  { src: aws, alt: "AWS" },
  { src: nvidia, alt: "Nvidia" },
  { src: tHub, alt: "T-Hub" },
  { src: ventureCatalyst, alt: "Venture Catalyst Space" },
  { src: investSA, alt: "Invest SA" },
];

const MARQUEE_TEXT =
  "Onnes thanks its partners, clients and investors for their continued support!";

export default function Partners() {
  const logos = useMemo(() => [...partners, ...partners], []);

  return (
    <section className="partners section-pad" id="partners">
      <div className="partners-marquee" aria-hidden="true">
        <div className="partners-marquee-track">
          <span>{MARQUEE_TEXT}</span>
          <span>{MARQUEE_TEXT}</span>
        </div>
      </div>

      <div className="partners-logo-viewport">
        <div className="partners-logo-track" aria-label="Onnes partners and investors">
          {logos.map((logo, index) => (
            <div className="partner-logo" key={`${logo.alt}-${index}`}>
              <img src={logo.src} alt={logo.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}