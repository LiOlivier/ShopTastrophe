import "./CategoryGrid.css";

const items = [
  { label: "Jupes & Shorts", href: "/catalogue?cat=jupes-shorts" },
  { label: "Écharpes & Bonnets", href: "/catalogue?cat=echarpes-bonnets" },
  { label: "Denim", href: "/catalogue?cat=denim" },
  { label: "T‑Shirts & Sweats", href: "/catalogue?cat=tshirts-sweats" }
];

export default function CategoryGrid({ className = "" }) {
  return (
    <section className={`cat-grid-section ${className}`.trim()}>
      <div className="cat-grid">
        {items.map((it, i) => (
          <a key={i} className="cat-card" href={it.href}>
            <span className="cat-label">{it.label.toUpperCase()}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
