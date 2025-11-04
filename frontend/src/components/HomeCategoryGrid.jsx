import "./HomeCategoryGrid.css";

const items = [
  { label: "T‑Shirt Ironique", img: "/merch/img/ironique.png", href: "/products/tee-noir" },
  { label: "Sweat Sarcastique", img: "/merch/img/sarcastique.png", href: "/products/sweat-blanc" },
  { label: "Casquette Vide tête", img: "/merch/img/casquette.png", href: "/products/casquette-blanche" },
  { label: "Tasse", img: "/merch/img/tasse.png", href: "/products/tasse-noire" },
];

export default function HomeCategoryGrid({ className = "" }) {
  return (
    <section className={`home-cat-grid-section ${className}`.trim()}>
      <div className="home-cat-grid">
        {items.map((it, i) => (
          <a key={i} className="home-cat-card" href={it.href} aria-label={it.label}>
            <img className="home-cat-bg" src={it.img} alt="" aria-hidden />
          </a>
        ))}
      </div>
    </section>
  );
}
