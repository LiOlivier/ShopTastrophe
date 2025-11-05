import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import { api } from "../api/client";
import PasswordInput from "../components/PasswordInput";
import "./Profile.css";

export default function Profil() {
  const { user, token, isAuthenticated, updateUser, logout } = useAuth();
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
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordEdition, setPasswordEdition] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  
  useEffect(() => setForm(initial), [initial]);

  // Fonctions de validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Permet seulement les chiffres, espaces, tirets, parenthèses et le signe +
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    return phoneRegex.test(phone);
  };

  const setChamp = (e) => {
    const { name, value } = e.target;
    
    // Validation spéciale pour le téléphone - ne permettre que les chiffres et certains caractères
    if (name === 'telephone') {
      const cleanValue = value.replace(/[^\d\s\-\(\)\+]/g, '');
      setForm((f) => ({ ...f, [name]: cleanValue }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };
  const setPasswordChamp = (e) => setPasswordForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  
  const annuler = () => { 
    setForm(initial); 
    setEdition(false); 
    setValidationMessage("");
  };
  const annulerPassword = () => { 
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); 
    setPasswordEdition(false); 
    setPasswordMessage("");
  };
  
  const enregistrer = () => {
    // Réinitialiser le message de validation
    setValidationMessage("");
    
    // Validation de l'email
    if (form.email && !validateEmail(form.email)) {
      setValidationMessage("❌ L'adresse email n'est pas valide. Veuillez saisir une adresse email complète (ex: nom@domaine.com)");
      return;
    }
    
    // Validation du téléphone
    if (form.telephone && !validatePhone(form.telephone)) {
      setValidationMessage("❌ Le numéro de téléphone ne peut contenir que des chiffres, espaces, tirets, parenthèses et le signe +");
      return;
    }
    
    // Si tout est valide, enregistrer
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
    setValidationMessage("✅ Profil mis à jour avec succès");
  };

  const changerMotDePasse = async () => {
    console.log("🔐 Début changement mot de passe");
    console.log("📋 Form data:", passwordForm);
    console.log("🔑 Token:", token);
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      console.log("🌐 Envoi requête API...");
      const response = await api.changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      }, token);

      console.log("📡 Réponse:", response.status, response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Succès:", data);
        setPasswordMessage("Mot de passe modifié avec succès ✅");
        annulerPassword();
      } else {
        const error = await response.json();
        console.log("❌ Erreur:", error);
        setPasswordMessage(error.detail || "Erreur lors du changement de mot de passe");
      }
    } catch (error) {
      console.log("💥 Exception:", error);
      setPasswordMessage("Erreur de connexion");
    }
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
          <button className="btn sombre" onClick={() => { setEdition(true); setValidationMessage(""); }}>{t('profile.edit')}</button>
        ) : (
          <div className="actions">
            <button className="btn ghost" onClick={annuler}>{t('profile.cancel')}</button>
            <button className="btn primaire" onClick={enregistrer}>{t('profile.save')}</button>
          </div>
        )}
        
        {/* Message de validation */}
        {validationMessage && (
          <div className={`validation-message ${validationMessage.includes('✅') ? 'success' : 'error'}`}>
            {validationMessage}
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
              <Champ type="email" libelle={t('profile.email')} name="email" value={form.email} onChange={setChamp} disabled={!edition} required />
              <Champ type="tel" libelle={t('profile.phone')} name="telephone" value={form.telephone} onChange={setChamp} disabled={!edition} placeholder="Ex: 01 23 45 67 89" />
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

      {/* Section changement de mot de passe */}
      <section className="card card-details">
        <div className="panneau">
          <h3>Changer le mot de passe</h3>
          {!passwordEdition ? (
            <button className="btn sombre" onClick={() => setPasswordEdition(true)}>
              Modifier mon mot de passe
            </button>
          ) : (
            <div className="grille">
              <PasswordInput
                label="Mot de passe actuel" 
                name="currentPassword" 
                value={passwordForm.currentPassword} 
                onChange={setPasswordChamp} 
              />
              <PasswordInput
                label="Nouveau mot de passe" 
                name="newPassword" 
                value={passwordForm.newPassword} 
                onChange={setPasswordChamp} 
              />
              <PasswordInput
                label="Confirmer le mot de passe" 
                name="confirmPassword" 
                value={passwordForm.confirmPassword} 
                onChange={setPasswordChamp} 
              />
              
              {passwordMessage && (
                <div className={`message ${passwordMessage.includes("✅") ? "success" : "error"}`}>
                  {passwordMessage}
                </div>
              )}
              
              <div className="actions" style={{gridColumn: "1 / -1"}}>
                <button className="btn ghost" onClick={annulerPassword}>Annuler</button>
                <button className="btn primaire" onClick={changerMotDePasse}>
                  Changer le mot de passe
                </button>
              </div>
            </div>
          )}
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
