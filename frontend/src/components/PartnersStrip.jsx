import "./PartnersStrip.css";

const partners = [
  "Michelin",
  "Logitech",
  "Orange",
  "Charal",
  "Celio",
  "CIC"
];

export default function PartnersStrip() {
  return (
    <section className="partners-strip" aria-label="Partenaires">
      <div className="partners-inner">
        <ul className="partners-list">
          {partners.map((name, i) => (
            <li key={i} className="partner">
              <span className="partner-mark" aria-hidden />
              <span className="partner-name">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
