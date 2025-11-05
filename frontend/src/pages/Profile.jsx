import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import "./Profile.css";

export default function Profil() {
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const { t } = useTranslation();
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
      <h1>{t('profile.title')}</h1>

      <section className="card card-entete">
        <div className="entete-user">
          <img src="/profil.png" alt="avatar" className="avatar" />
          <div>
            <div className="nom">{[form.prenom, form.nom].filter(Boolean).join(" ") || "—"}</div>
            <div className="lieu">{form.lieu || "—"}</div>
          </div>
        </div>
        {!edition ? (
          <button className="btn sombre" onClick={() => setEdition(true)}>{t('profile.edit')}</button>
        ) : (
          <div className="actions">
            <button className="btn ghost" onClick={annuler}>{t('profile.cancel')}</button>
            <button className="btn primaire" onClick={enregistrer}>{t('profile.save')}</button>
          </div>
        )}
      </section>

      <section className="card card-details">
        <div className="colonnes">
          <div className="panneau">
            <h3>{t('profile.personalInfo')}</h3>
            <div className="grille">
              <Champ libelle={t('profile.firstName')} name="prenom" value={form.prenom} onChange={setChamp} disabled={!edition} />
              <Champ libelle={t('profile.lastName')} name="nom" value={form.nom} onChange={setChamp} disabled={!edition} />
              <Champ type="email" libelle={t('profile.email')} name="email" value={form.email} onChange={setChamp} disabled={!edition} />
              <Champ libelle={t('profile.phone')} name="telephone" value={form.telephone} onChange={setChamp} disabled={!edition} />
            </div>
          </div>
          <div className="panneau">
            <h3>{t('profile.address')}</h3>
            <div className="grille">
              <Champ libelle={t('profile.country')} name="pays" value={form.pays} onChange={setChamp} disabled={!edition} />
              <Champ libelle={t('profile.region')} name="region" value={form.region} onChange={setChamp} disabled={!edition} />
              <Champ libelle={t('profile.postalCode')} name="codePostal" value={form.codePostal} onChange={setChamp} disabled={!edition} />
              <Champ libelle={t('profile.addressLine')} name="adresse" value={form.adresse} onChange={setChamp} disabled={!edition} />
            </div>
          </div>
        </div>

        <div className="pied-actions">
          <button className="btn ghost" onClick={() => navigate("/orders")}>{t('nav.orders')}</button>
          <button className="btn ghost" onClick={() => { logout(); navigate("/"); }}>{t('nav.logout')}</button>
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
