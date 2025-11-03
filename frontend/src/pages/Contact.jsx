import "./Contact.css";

export default function Contact() {
  return (
    <section className="contact">
      <div className="contact-container">
        <h1 className="contact-title">Contact</h1>
        <p className="contact-intro">
          Une question, un retour, ou envie de collaborer ? Écris‑nous avec le formulaire ci‑dessous.
        </p>
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <label htmlFor="name">Nom</label>
            <input id="name" name="name" type="text" placeholder="Votre nom" required />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="vous@exemple.com" required />
          </div>
          <div className="form-row">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} placeholder="Votre message" required />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Envoyer</button>
          </div>
        </form>
        <div className="contact-alt">
          <p>
            Tu peux aussi nous écrire à <a href="mailto:contact@shoptastrophe.test">contact@shoptastrophe.test</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
