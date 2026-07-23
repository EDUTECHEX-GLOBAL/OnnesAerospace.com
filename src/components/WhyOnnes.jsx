import {
  Feather,
  ShieldPlus,
  Cpu,
  Globe2,
} from "lucide-react";

const reasons = [
  {
    title: "Mass Efficiency",
    body: "Lightweight structures and systems that unlock more payload and performance.",
    icon: Feather,
  },
  {
    title: "Mission Endurance",
    body: "Built for long-duration operations in the harshest environments.",
    icon: ShieldPlus,
  },
  {
    title: "Autonomous Intelligence",
    body: "Embedded intelligence for autonomous monitoring, control, and decision making.",
    icon: Cpu,
  },
  {
    title: "Built For The Future",
    body: "Infrastructure designed to scale with the future of the space economy.",
    icon: Globe2,
  },
];

export default function WhyOnnes() {
  return (
    <section className="why section-pad" id="applications">
      <div className="why-copy">
        <p className="eyebrow">Why Onnes</p>
        <h2>Engineered For What Comes Next</h2>
        <p>
          Onnes Aerospace is building the infrastructure that empowers humanity
          to thrive beyond Earth.
        </p>
      </div>

      <div className="reason-grid">
        {reasons.map(({ title, body, icon: Icon }) => (
          <article className="reason" key={title}>
            <div className="reason-icon">
              <Icon size={48} strokeWidth={1.8} />
            </div>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}