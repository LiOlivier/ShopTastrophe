import "./Soutenir.css";

export default function Soutenir() {
  return (
    <section className="support">
      <div className="support-container">
        <h1 className="support-title">Nous soutenir</h1>
        <p className="support-intro">
          Si tu kiffes ce qu’on fait, tu peux soutenir le projet ici.
          Chaque participation nous aide à payer l’hébergement, les protos et à sortir de nouvelles pièces.
        </p>

        <div className="support-grid">
          <div className="support-card">
            <h2>Soutenir le projet</h2>
            <p>Ton aide sert notamment à&nbsp;:</p>
            <ul className="support-why">
              <li>hébergement du site et outils</li>
              <li>tests / prototypes / impressions</li>
              <li>petites dépenses liées à la création</li>
            </ul>
            <form className="donate" onSubmit={(e) => e.preventDefault()}>
              <div className="custom-amount">
                <label htmlFor="don-amount">Saisissez le montant :</label>
                <input id="don-amount" type="number" min="1" step="1" placeholder="€" />
              </div>
              <button className="btn-primary" type="submit">Soutenir</button>
            </form>
          </div>

          <div className="support-card feedback">
            <h2>Idées & retours</h2>
            <p>Une idée de design ? Un retour sur les produits ? On lit tout. Dis‑nous ce que tu en penses.</p>
            <a className="btn-primary" href="/contact">Écrire au projet</a>
          </div>
        </div>
      </div>
    </section>
  );
}
