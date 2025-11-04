from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..core import cart_service, sessions, products # on importe nos services partagés
    
router = APIRouter(prefix="/cart", tags=["cart"])

class AddCartRequest(BaseModel):
    token: str
    product_id: str
    qty: int = 1

class RemoveCartRequest(BaseModel):
    token: str
    product_id: str
    qty: int = 1

@router.post("/add")
def add_to_cart(req: AddCartRequest):
    user_id = sessions.get_user_id(req.token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Token invalide.")
    try:
        cart_service.add_to_cart(user_id, req.product_id, req.qty)
        return {"message": f"Produit {req.product_id} ajouté au panier."}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/view")
def view_cart(token: str):
    user_id = sessions.get_user_id(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Token invalide.")
    cart = cart_service.view_cart(user_id)
    return {
        "user_id": user_id,
        "items": [vars(it) for it in cart.items.values()],
        "total_cents": cart.total_cents(products)
    }

@router.delete("/remove")
def remove_from_cart(req: RemoveCartRequest):
    user_id = sessions.get_user_id(req.token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Token invalide.")
    cart_service.remove_from_cart(user_id, req.product_id, req.qty)
    return {"message": f"Produit {req.product_id} retiré du panier."}
