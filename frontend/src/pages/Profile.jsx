import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

export default function Profil() {
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);
  if (!isAuthenticated) return null;

  const initial = useMemo(() => {
    const [prenom = "", ...rest] = (user?.name || "").trim().split(" ");
    return {
      prenom,
      nom: rest.join(" "),
      email: user?.email || "",
      telephone: user?.phone || "",
      pays: user?.country || "",
      region: user?.state || "",
      codePostal: user?.zip || "",
      adresse: user?.address || "",
      lieu: user?.location || "",
    };
  }, [user]);

  const [form, setForm] = useState(initial);
  const [edition, setEdition] = useState(false);
  useEffect(() => setForm(initial), [initial]);

  const setChamp = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const annuler = () => { setForm(initial); setEdition(false); };
  const enregistrer = () => {
    updateUser?.({
      name: [form.prenom, form.nom].filter(Boolean).join(" "),
      email: form.email,
      phone: form.telephone,
      country: form.pays,
      state: form.region,
      zip: form.codePostal,
      address: form.adresse,
      location: form.lieu,
    });
    setEdition(false);
  };

  return (
    <div className="profil">
      <h1>Mon profil</h1>

      <section className="card card-entete">
        <div className="entete-user">
          <img src="/profil.png" alt="avatar" className="avatar" />
          <div>
            <div className="nom">{[form.prenom, form.nom].filter(Boolean).join(" ") || "—"}</div>
            <div className="lieu">{form.lieu || "—"}</div>
          </div>
        </div>
        {!edition ? (
          <button className="btn sombre" onClick={() => setEdition(true)}>Éditer</button>
        ) : (
          <div className="actions">
            <button className="btn ghost" onClick={annuler}>Annuler</button>
            <button className="btn primaire" onClick={enregistrer}>Enregistrer</button>
          </div>
        )}
      </section>

      <section className="card card-details">
        <div className="colonnes">
          <div className="panneau">
            <h3>Informations personnelles</h3>
            <div className="grille">
              <Champ libelle="Prénom" name="prenom" value={form.prenom} onChange={setChamp} disabled={!edition} />
              <Champ libelle="Nom" name="nom" value={form.nom} onChange={setChamp} disabled={!edition} />
              <Champ type="email" libelle="Adresse e-mail" name="email" value={form.email} onChange={setChamp} disabled={!edition} />
              <Champ libelle="Numéro de téléphone" name="telephone" value={form.telephone} onChange={setChamp} disabled={!edition} />
            </div>
          </div>
          <div className="panneau">
            <h3>Adresse</h3>
            <div className="grille">
              <Champ libelle="Pays" name="pays" value={form.pays} onChange={setChamp} disabled={!edition} />
              <Champ libelle="Région / État" name="region" value={form.region} onChange={setChamp} disabled={!edition} />
              <Champ libelle="Code postal" name="codePostal" value={form.codePostal} onChange={setChamp} disabled={!edition} />
              <Champ libelle="Adresse" name="adresse" value={form.adresse} onChange={setChamp} disabled={!edition} />
            </div>
          </div>
        </div>

        <div className="pied-actions">
          <button className="btn ghost" onClick={() => navigate("/orders")}>Mes commandes</button>
          <button className="btn ghost" onClick={() => { logout(); navigate("/"); }}>Se déconnecter</button>
        </div>
      </section>
    </div>
  );
}

function Champ({ libelle, name, value, onChange, disabled, type = "text" }) {
  return (
    <label className="champ">
      <span className="libelle">{libelle}</span>
      <input className="saisie" type={type} name={name} value={value} onChange={onChange} disabled={disabled} />
    </label>
  );
}
