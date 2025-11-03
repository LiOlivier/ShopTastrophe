import { useState } from "react";
import "./FAQ.css";

const faqs = [
  {
    q: "Quelle est la coupe de vos produits ?",
    a: "Des coupes modernes et confortables. Si vous hésitez entre deux tailles, prenez la plus grande pour un tombé plus loose."
  },
  {
    q: "Comment choisir ma taille ?",
    a: "Consultez le guide des tailles sur chaque fiche produit. Mesures à plat et conseils de fit y sont indiqués."
  },
  {
    q: "Quels sont vos modes de paiement ?",
    a: "Vous pouvez payer par Apple Pay, Visa, Mastercard et PayPal. Les transactions sont sécurisées."
  },
  {
    q: "Puis‑je modifier ou annuler ma commande ?",
    a: "Tant que la commande n'est pas expédiée, c'est possible. Contactez le support au plus vite depuis votre espace commandes."
  },
  {
    q: "Quel est le délai moyen de livraison ?",
    a: "En France métropolitaine, 2 à 4 jours ouvrés selon le transporteur et la période."
  },
  {
    q: "Comment suivre ma livraison ?",
    a: "Un lien de suivi est envoyé par e‑mail dès l'expédition et reste disponible dans votre espace commandes."
  },
  {
    q: "Proposez‑vous des e‑cartes cadeaux ?",
    a: "Oui, de 10€ à 200€. La carte est envoyée par e‑mail avec un code utilisable en une ou plusieurs fois."
  },
  {
    q: "Comment contacter le support ?",
    a: "Depuis la page Contact ou votre espace profil/commandes. Réponse sous 24 à 48h ouvrées."
  }
];

export default function FAQ() {
  const [open, setOpen] = useState(() => faqs.map(() => false));
  const toggle = (i) => setOpen((s) => s.map((v, idx) => (idx === i ? !v : v)));

  return (
    <section className="faq-container">
      <h1 className="faq-title">FAQ</h1>
      <div className="faq-list" role="list">
        {faqs.map((item, i) => {
          const panelId = `faq-panel-${i}`;
          const btnId = `faq-btn-${i}`;
          const isOpen = open[i];
          return (
            <div className={`faq-item${isOpen ? " open" : ""}`} key={i} role="listitem">
              <button
                id={btnId}
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
              >
                <span className="q-text">{item.q}</span>
                <span className="chev" aria-hidden>▾</span>
              </button>
              <div
                id={panelId}
                className="faq-a"
                role="region"
                aria-labelledby={btnId}
              >
                <p>{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
