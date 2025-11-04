import "./Mentions.css";

export default function Mentions() {
  return (
    <section className="legal">
      <div className="legal-container">
        <h1 className="legal-title">Mentions légales (À ne pas prendre au sérieux ^^)</h1>

        <div className="legal-block">
          <p><strong>Éditeur du site</strong></p>
          <p>ShopTastrophe - Projet étudiant plein d’amour et de pixels.</p>
          <p>Adresse officielle : quelque part sur Internet.</p>
          <p>Contact : <a href="mailto:contact@shoptastrophe.test">contact@shoptastrophe.test</a></p>
        </div>

        <div className="legal-block">
          <p><strong>Statut / Immatriculation</strong></p>
          <p>Entité humoristique non cotée au CAC 40.</p>
          <p>RCS : 000 000 000 (celui de l’imagination)</p>
          <p>TVA : FR00 000000000</p>
          <p>SIRET : 000 000 000 00000</p>
        </div>

        <div className="legal-block">
          <p><strong>Directeur de la publication</strong></p>
          <p>L’équipe ShopTastrophe</p>
        </div>

        <div className="legal-block">
          <p><strong>Hébergeur</strong></p>
          <p>Actuellement en mode dev local. Bientôt: un hébergeur stylé (et stable), promis.</p>
        </div>

        <div className="legal-block">
          <p><strong>Cookies</strong></p>
          <p>
            Pas de cookies haha :D !
          </p>
        </div>
      </div>
    </section>
  );
}
