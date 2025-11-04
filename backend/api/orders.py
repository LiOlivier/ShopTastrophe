from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..core import sessions, users, carts, products  
from ..shop import OrderRepository, PaymentRepository, InvoiceRepository, BillingService, DeliveryService, PaymentGateway, OrderService, UserRepository

router = APIRouter(prefix="/orders", tags=["orders"])

# --- Instances nécessaires ---

orders = OrderRepository()
payments = PaymentRepository()
invoices = InvoiceRepository()

billing = BillingService(invoices)
delivery_svc = DeliveryService()
gateway = PaymentGateway()
order_service = OrderService(
    orders, products, carts, payments, invoices,
    billing, delivery_svc, gateway, users
)
# --- Requêtes ---
class CheckoutRequest(BaseModel):
    token: str

# --- ROUTES ---

@router.post("/checkout")
def checkout(req: CheckoutRequest):
    user_id = sessions.get_user_id(req.token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Token invalide.")
    try:
        order = order_service.checkout(user_id)
        return {
            "message": "Commande validée avec succès ✅",
            "order_id": getattr(order, "id", None),
            "total": getattr(order, "total_cents", 0),
            "status": getattr(order, "status", "UNKNOWN")
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Échec du checkout : {e}")


@router.get("/list")
def list_orders(token: str):
    user_id = sessions.get_user_id(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Token invalide.")
    try:
        user_orders = order_service.view_orders(user_id)
        if not user_orders:
            return {"message": "Aucune commande trouvée."}
        return [
            {
                "id": getattr(o, "id", None),
                "status": getattr(o, "status", "UNKNOWN"),
                "total_cents": getattr(o, "total_cents", lambda: 0)()
                if callable(getattr(o, "total_cents", None)) else getattr(o, "total_cents", 0),
                "created_at": getattr(o, "created_at", None)
            }
            for o in user_orders
        ]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur lors de la récupération des commandes : {e}")