import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import { api } from "../api/client";
import "./OrderTracking.css";

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrder();
  }, [isAuthenticated, orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await api.listOrders(token);
      if (response.ok) {
        const orders = await response.json();
        const foundOrder = orders.find(o => o.id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError("Commande introuvable");
        }
      } else {
        setError("Erreur lors du chargement de la commande");
      }
    } catch (error) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      "CREE": {
        label: "Commande créée",
        description: "Votre commande a été enregistrée et est en attente de validation",
        color: "#ffc107",
        icon: "📝"
      },
      "VALIDEE": {
        label: "Commande validée", 
        description: "Votre commande a été validée et est en attente de paiement",
        color: "#17a2b8",
        icon: "✅"
      },
      "PAYEE": {
        label: "Payée",
        description: "Le paiement a été confirmé, préparation en cours",
        color: "#28a745",
        icon: "💳"
      },
      "EXPEDIEE": {
        label: "Expédiée",
        description: "Votre commande a été expédiée et est en route",
        color: "#007bff",
        icon: "📦"
      },
      "LIVREE": {
        label: "Livrée",
        description: "Votre commande a été livrée avec succès",
        color: "#28a745",
        icon: "🏠"
      },
      "ANNULEE": {
        label: "Annulée",
        description: "Cette commande a été annulée",
        color: "#dc3545",
        icon: "❌"
      },
      "REMBOURSEE": {
        label: "Remboursée",
        description: "Le remboursement a été effectué",
        color: "#6c757d",
        icon: "💰"
      }
    };
    
    // Gérer le cas des enums qui peuvent avoir des valeurs numériques
    const normalizedStatus = typeof status === 'string' ? status : 
                            (status && status.name) ? status.name : 'CREE';
    
    return statusMap[normalizedStatus] || statusMap['CREE'];
  };

  const getStatusProgress = (status) => {
    const statusOrder = ["CREE", "VALIDEE", "PAYEE", "EXPEDIEE", "LIVREE"];
    const currentIndex = statusOrder.indexOf(status);
    
    if (status === "ANNULEE" || status === "REMBOURSEE") {
      return { current: -1, total: statusOrder.length };
    }
    
    return { current: currentIndex + 1, total: statusOrder.length };
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Date inconnue";
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDelivery = (status, createdAt) => {
    if (!createdAt) return null;
    
    const created = new Date(createdAt * 1000);
    let daysToAdd = 0;
    
    switch(status) {
      case "CREE":
      case "VALIDEE":
        daysToAdd = 5; // 5 jours ouvrés
        break;
      case "PAYEE":
        daysToAdd = 3; // 3 jours ouvrés
        break;
      case "EXPEDIEE":
        daysToAdd = 1; // 1 jour ouvré
        break;
      case "LIVREE":
        return "Déjà livrée";
      default:
        return null;
    }
    
    const estimated = new Date(created);
    estimated.setDate(estimated.getDate() + daysToAdd);
    
    return estimated.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="order-tracking">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement du suivi de commande...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-tracking">
        <div className="error-container">
          <h1>❌ Commande introuvable</h1>
          <p>{error}</p>
          <Link to="/orders" className="btn-primary">
            Retour aux commandes
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const progress = getStatusProgress(order.status);
  const estimatedDelivery = getEstimatedDelivery(order.status, order.created_at);

  return (
    <div className="order-tracking">
      <div className="tracking-header">
        <Link to="/orders" className="back-link">
          ← Retour aux commandes
        </Link>
        <h1>Suivi de commande</h1>
        <div className="order-info">
          <span className="order-id">#{order.id}</span>
          <span className="order-date">Commandé le {formatDate(order.created_at)}</span>
        </div>
      </div>

      <div className="tracking-container">
        {/* Status actuel */}
        <div className="current-status">
          <div className="status-icon" style={{ backgroundColor: statusInfo.color }}>
            {statusInfo.icon}
          </div>
          <div className="status-details">
            <h2>{statusInfo.label}</h2>
            <p>{statusInfo.description}</p>
            {estimatedDelivery && (
              <p className="estimated-delivery">
                <strong>Livraison estimée :</strong> {estimatedDelivery}
              </p>
            )}
          </div>
        </div>

        {/* Barre de progression */}
        {progress.current > 0 && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${(progress.current / progress.total) * 100}%`,
                  backgroundColor: statusInfo.color
                }}
              ></div>
            </div>
            <div className="progress-labels">
              <span className="progress-text">
                Étape {progress.current} sur {progress.total}
              </span>
            </div>
          </div>
        )}

        {/* Timeline des statuts */}
        <div className="status-timeline">
          <h3>Historique de la commande</h3>
          <div className="timeline">
            {["CREE", "VALIDEE", "PAYEE", "EXPEDIEE", "LIVREE"].map((status, index) => {
              const isCompleted = ["CREE", "VALIDEE", "PAYEE", "EXPEDIEE", "LIVREE"].indexOf(order.status) >= index;
              const isCurrent = order.status === status;
              const info = getStatusInfo(status);
              
              return (
                <div 
                  key={status} 
                  className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  <div className="timeline-marker" style={isCompleted ? { backgroundColor: info.color } : {}}>
                    {info.icon}
                  </div>
                  <div className="timeline-content">
                    <h4>{info.label}</h4>
                    <p>{info.description}</p>
                    {isCurrent && order.created_at && (
                      <span className="timeline-date">{formatDate(order.created_at)}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Détails de la commande */}
        <div className="order-details">
          <h3>Détails de la commande</h3>
          <div className="details-grid">
            <div className="detail-card">
              <h4>💰 Montant total</h4>
              <p className="total-amount">
                <span className="amount-number">{(order.total_cents / 100).toFixed(2)}</span>
                <span className="amount-euro">€</span>
              </p>
            </div>
            
            <div className="detail-card">
              <h4>📦 Articles ({order.items?.length || 0})</h4>
              <div className="items-list">
                {order.items?.map((item, index) => (
                  <div key={index} className="item-row">
                    <span className="item-name">{item.product_name}</span>
                    <span className="item-qty">×{item.qty}</span>
                    <span className="item-price">{((item.unit_price_cents * item.qty) / 100).toFixed(2)} €</span>
                  </div>
                )) || <p>Détails des articles non disponibles</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="tracking-actions">
          {order.status === "CREE" || order.status === "VALIDEE" ? (
            <Link 
              to={`/payment/${order.id}`} 
              className="btn-primary"
            >
              💳 Procéder au paiement
            </Link>
          ) : null}
          
          {order.status === "EXPEDIEE" && (
            <button className="btn-secondary" onClick={() => alert("Fonctionnalité de suivi transporteur à venir !")}>
              🚚 Suivre le colis
            </button>
          )}
          
          {order.status === "LIVREE" && (
            <button className="btn-secondary" onClick={() => alert("Fonctionnalité d'évaluation à venir !")}>
              ⭐ Laisser un avis
            </button>
          )}
        </div>
      </div>
    </div>
  );
}