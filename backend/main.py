from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .shop import Product
from .api import auth, cart, orders
from .core import products, catalog_service 
from dataclasses import asdict

app = FastAPI(title="ShopTastrophe 😏")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(cart.router)
app.include_router(orders.router)

try:
    if not catalog_service.list_products():
        p1 = Product(id="1", name="T-Shirt Ironique", description="Coton bio", price_cents=3000, stock_qty=100)
        p2 = Product(id="2", name="Sweat Sarcastique", description="Molleton doux", price_cents=6000, stock_qty=150)
        p3 = Product(id="3", name="Vide Tête", description="Bleu marine, taille unique", price_cents=2000, stock_qty=80)
        p4 = Product(id="4", name="ChatasTrophe", description="Céramique blanche 30cl", price_cents=1500, stock_qty=120)
        products.add(p1)
        products.add(p2)
        products.add(p3)
        products.add(p4)
except Exception:
    pass


@app.get("/")
def root():
    return {"message": "Bienvenue sur ShopTastrophe 😏"}

@app.get("/products")
def list_products():
    return [asdict(p) for p in catalog_service.list_products()]

@app.post("/admin/reset-stock")
def reset_stock():
    """Endpoint pour remettre le stock à niveau - utile pour les tests"""
    try:
        all_products = catalog_service.list_products()
        for p in all_products:
            if p.id == "1":  # T-Shirt
                p.stock_qty = 100
            elif p.id == "2":  # Sweat
                p.stock_qty = 150
            elif p.id == "3":  # Casquette
                p.stock_qty = 80
            elif p.id == "4":  # Tasse
                p.stock_qty = 120
            
            products.add(p)  
            
        return {"message": "Stock remis à niveau avec succès"}
    except Exception as e:
        return {"error": f"Erreur lors de la remise à niveau du stock: {str(e)}"}
