from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from shop import Product
from api import auth, cart, orders
from core import products, catalog_service 
from dataclasses import asdict

app = FastAPI(title="ShopTastrophe 😏")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(cart.router)
app.include_router(orders.router)

# Produits tests
p1 = Product(id="1", name="T-Shirt Ironique", description="Coton bio", price_cents=2499, stock_qty=12)
p2 = Product(id="2", name="Sweat Sarcastique", description="Molleton doux", price_cents=6499, stock_qty=8)
p3 = Product(id="3", name="Casquette Stylée", description="Bleu marine, taille unique", price_cents=1999, stock_qty=20)
p4 = Product(id="4", name="Mug Caféiné", description="Céramique blanche 30cl", price_cents=1299, stock_qty=15)
products.add(p1)
products.add(p2)
products.add(p3)
products.add(p4)


@app.get("/")
def root():
    return {"message": "Bienvenue sur ShopTastrophe 😏"}

@app.get("/products")
def list_products():
    return [asdict(p) for p in catalog_service.list_products()]
