import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import { api } from "../api/client";
import "./Payment.css";

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: ""
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrder();
  }, [isAuthenticated, orderId]);

  const loadOrder = async () => {
    try {
      const response = await api.listOrders(token);
      if (response.ok) {
        const orders = await response.json();
        const foundOrder = orders.find(o => o.id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setMessage("Commande introuvable");
        }
      }
    } catch (error) {
      setMessage("Erreur lors du chargement de la commande");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    // Supprimer tous les caractères non-numériques
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Ajouter des espaces tous les 4 chiffres
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentForm(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setMessage("");

    // Validation simple
    const cardNumberClean = paymentForm.cardNumber.replace(/\s/g, '');
    if (!cardNumberClean || cardNumberClean.length < 13) {
      setMessage("Numéro de carte invalide");
      setProcessing(false);
      return;
    }

    if (!paymentForm.expMonth || !paymentForm.expYear || !paymentForm.cvc) {
      setMessage("Tous les champs sont requis");
      setProcessing(false);
      return;
    }

    try {
      const response = await api.processPayment({
        order_id: orderId,
        card_number: cardNumberClean,
        exp_month: parseInt(paymentForm.expMonth),
        exp_year: parseInt(paymentForm.expYear),
        cvc: paymentForm.cvc
      }, token);

      if (response.ok) {
        const result = await response.json();
        setMessage("Paiement réussi ! Redirection...");
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(error.detail || "Paiement refusé");
      }
    } catch (error) {
      setMessage("Erreur lors du paiement");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="payment-page">Chargement...</div>;
  }

  if (!order) {
    return <div className="payment-page">{message}</div>;
  }

  if (order.status === "PAYEE") {
    return (
      <div className="payment-page">
        <h1>Cette commande a déjà été payée</h1>
        <button onClick={() => navigate('/orders')}>Retour aux commandes</button>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <h1>Paiement de la commande</h1>
      
      <div className="payment-container">
        <div className="order-summary">
          <h2>Récapitulatif</h2>
          <p><strong>Commande #{order.id}</strong></p>
          <p>Total: <strong>{(order.total_cents / 100).toFixed(2)} €</strong></p>
          
          <div className="order-items">
            {order.items?.map((item, index) => (
              <div key={index} className="order-item">
                <span>{item.product_name}</span>
                <span>{item.qty} x {(item.unit_price_cents / 100).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        </div>

        <div className="payment-form-container">
          <h2>Informations de paiement</h2>
          
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label htmlFor="cardNumber">Numéro de carte</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentForm.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expMonth">Mois</label>
                <select
                  id="expMonth"
                  name="expMonth"
                  value={paymentForm.expMonth}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Mois</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="expYear">Année</label>
                <select
                  id="expYear"
                  name="expYear"
                  value={paymentForm.expYear}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Année</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="cvc">CVC</label>
                <input
                  type="text"
                  id="cvc"
                  name="cvc"
                  value={paymentForm.cvc}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>
            </div>

            <div className="payment-info">
              <p className="test-info">
                 <strong>Méthode pour test:</strong> Utilisez n'importe quel numéro sauf ceux finissant par 0000 (qui simulent un refus)
              </p>
            </div>

            {message && (
              <div className={`message ${message.includes('réussi') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <div className="payment-actions">
              <button 
                type="button" 
                onClick={() => navigate('/orders')}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={processing}
                className="btn-primary"
              >
                {processing ? 'Traitement...' : `Payer ${(order.total_cents / 100).toFixed(2)} €`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}