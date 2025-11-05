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
    
    // Préfixer automatiquement le téléphone avec +33
    let telephone = user?.phone || "";
    
    // Si le téléphone est vide, on met +33 par défaut
    if (!telephone) {
      telephone = "+33 ";
    } else if (!telephone.startsWith('+33')) {
      // Si c'est un numéro français qui commence par 0, on remplace le 0 par +33
      if (telephone.startsWith('0')) {
        telephone = '+33 ' + telephone.substring(1);
      } else {
        telephone = '+33 ' + telephone;
      }
    }
    
    return {
      prenom,
      nom: rest.join(" "),
      email: user?.email || "",
      telephone,
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
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);
  
  useEffect(() => setForm(initial), [initial]);

  // Fonctions de validation
  const validateEmail = (email) => {
    // Vérification du format général
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    
    // Vérification des extensions de domaine valides (sans .co)
    const validExtensions = [
      'com', 'fr', 'org', 'net', 'edu', 'gov', 'mil', 'int',
      'eu', 'uk', 'de', 'it', 'es', 'ca', 'au', 'jp', 'cn',
      'ru', 'br', 'in', 'mx', 'ar', 'cl', 'pe', 've', 'ec', 
      'bo', 'py', 'uy', 'info', 'biz', 'name', 'pro', 'coop', 'museum'
    ];
    
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const domain = parts[1];
    const domainParts = domain.split('.');
    const extension = domainParts[domainParts.length - 1].toLowerCase();
    
    return validExtensions.includes(extension);
  };

  const validatePhone = (phone) => {
    // Si c'est juste "+33 " ou "+33", c'est valide (champ vide avec préfixe)
    if (phone.trim() === '+33' || phone.trim() === '+33 ') {
      return true;
    }
    
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    const isValidFormat = phoneRegex.test(phone);
    
    const startsWithFranceCode = phone.trim().startsWith('+33');
    
    if (startsWithFranceCode) {
      const phoneAfterCode = phone.replace('+33', '').replace(/[^\d]/g, '');
      const hasValidLength = phoneAfterCode.length <= 9;
      return isValidFormat && hasValidLength;
    }
    
    return false; // Doit commencer par +33
  };

  const setChamp = (e) => {
    const { name, value } = e.target;
    
    // Validation spéciale pour le téléphone
    if (name === 'telephone') {
      let newValue = value;
      
      // Si le champ est vide ou ne commence pas par +33, l'ajouter
      if (!newValue || !newValue.startsWith('+33')) {
        // Extraire seulement les chiffres de ce que l'utilisateur tape
        const userDigits = newValue.replace(/[^\d]/g, '');
        newValue = '+33' + (userDigits ? ' ' + userDigits : ' ');
      }
      
      // Si l'utilisateur essaie de supprimer "+33", on le remet
      if (newValue.length < 3 || !newValue.startsWith('+33')) {
        newValue = '+33 ';
      }
      
      // Nettoyer le format général
      const cleanValue = newValue.replace(/[^\d\s\-\(\)\+]/g, '');
      
      // Compter les chiffres après +33
      const digitsAfter33 = cleanValue.replace('+33', '').replace(/[^\d]/g, '');
      
      // Limiter à 9 chiffres maximum après +33
      if (digitsAfter33.length <= 9) {
        setForm((f) => ({ ...f, [name]: cleanValue }));
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };
  const setPasswordChamp = (e) => setPasswordForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  
  const annuler = () => { 
    setForm(initial); 
    setEdition(false); 
    setValidationMessage("");
    setProfileSuccess(false);
  };
  const annulerPassword = () => { 
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); 
    setPasswordEdition(false); 
    setPasswordMessage("");
    setPasswordSuccess(false);
  };
  
  const enregistrer = () => {
    // Réinitialiser le message de validation
    setValidationMessage("");
    
    // Validation de l'email
    if (form.email && !validateEmail(form.email)) {
      setValidationMessage("❌ L'adresse email n'est pas valide. Utilisez une extension connue (.com, .fr, .org, etc.)");
      return;
    }
    
    // Validation du téléphone
    if (form.telephone && form.telephone.trim() !== '+33' && form.telephone.trim() !== '+33 ') {
      const phoneRegex = /^[\d\s\-\(\)\+]+$/;
      const isValidFormat = phoneRegex.test(form.telephone);
      const startsWithFranceCode = form.telephone.trim().startsWith('+33');
      
      if (!isValidFormat) {
        setValidationMessage("❌ Le numéro de téléphone ne peut contenir que des chiffres, espaces, tirets, parenthèses et le signe +");
        return;
      }
      
      if (!startsWithFranceCode) {
        setValidationMessage("❌ Le numéro de téléphone doit commencer par +33");
        return;
      }
      
      // Compter les chiffres après +33
      const digitsAfter33 = form.telephone.replace('+33', '').replace(/[^\d]/g, '');
      if (digitsAfter33.length > 9) {
        setValidationMessage("❌ Le numéro de téléphone ne peut pas contenir plus de 9 chiffres après +33");
        return;
      }
    }
    
    // Si tout est valide, enregistrer
    // Ne pas envoyer "+33 " vide, envoyer une chaîne vide à la place
    const phoneToSave = (form.telephone.trim() === '+33' || form.telephone.trim() === '+33 ') 
      ? '' 
      : form.telephone;
    
    updateUser?.({
      name: [form.prenom, form.nom].filter(Boolean).join(" "),
      email: form.email,
      phone: phoneToSave,
      country: form.pays,
      state: form.region,
      zip: form.codePostal,
      address: form.adresse,
      location: form.lieu,
    });
    setEdition(false);
    setValidationMessage("Profil mis à jour avec succès");
    setProfileSuccess(true);
    
    // Maintenir le message pendant 3 secondes
    setTimeout(() => {
      setValidationMessage("");
      setProfileSuccess(false);
    }, 3000);
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
        setPasswordMessage("Mot de passe modifié avec succès !");
        setPasswordSuccess(true);
        setPasswordEdition(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        
        // Maintenir le message pendant 5 secondes
        setTimeout(() => {
          setPasswordMessage("");
          setPasswordSuccess(false);
        }, 5000);
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
          <button className="btn sombre" onClick={() => { setEdition(true); setValidationMessage(""); setProfileSuccess(false); }}>{t('profile.edit')}</button>
        ) : (
          <div className="actions">
            <button className="btn ghost" onClick={annuler}>{t('profile.cancel')}</button>
            <button className="btn primaire" onClick={enregistrer}>{t('profile.save')}</button>
          </div>
        )}
        
        {/* Message de validation */}
        {validationMessage && (
          <div className={`validation-message ${profileSuccess ? 'success' : 'error'}`}>
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
              <Champ type="tel" libelle={t('profile.phone')} name="telephone" value={form.telephone} onChange={setChamp} disabled={!edition} placeholder="Ex: +33 1 23 45 67 89" />
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
                <div className={`validation-message ${passwordSuccess ? "success" : "error"}`}>
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
