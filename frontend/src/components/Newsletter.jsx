import React from "react";
import "./Newsletter.css";

export default function Newsletter() {
  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = data.get("email");
    alert(`Merci ! Nous vous tiendrons informé(e) à: ${email}`);
    form.reset();
  };

  return (
    <section className="newsletter-section" aria-labelledby="newsletter-title">
      <div className="newsletter-container">
        <h2 id="newsletter-title" className="newsletter-title">NOTRE NEWSLETTER</h2>
        <p className="newsletter-subtitle">Restez informé(e) de nos nouveautés & offres</p>
        <form className="newsletter-form" onSubmit={onSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Votre adresse e-mail"
            className="newsletter-input"
            required
          />
          <button type="submit" className="newsletter-btn">OK</button>
        </form>
      </div>
    </section>
  );
}
