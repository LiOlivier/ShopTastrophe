import "./HomeCategoryGrid.css";

const items = [
  { label: "Ironique", img: "/merch/img/ironique.png", href: "/products?tag=ironique" },
  { label: "Sarcastique", img: "/merch/img/sarcastique.png", href: "/products?tag=sarcastique" },
  { label: "Casquette", img: "/merch/img/casquette.png", href: "/products?tag=casquette" },
  { label: "Tasse", img: "/merch/img/tasse.png", href: "/products?tag=tasse" },
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
