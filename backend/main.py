from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from shop import Product
from api import auth, cart
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

# Quelques produits de test
p1 = Product(id="1", name="T-Shirt Ironique", description="Coton bio", price_cents=1999, stock_qty=12)
p2 = Product(id="2", name="Sweat Sarcastique", description="Molleton doux", price_cents=4999, stock_qty=8)
products.add(p1)
products.add(p2)

@app.get("/")
def root():
    return {"message": "Bienvenue sur ShopTastrophe 😏"}

@app.get("/products")
def list_products():
    return [asdict(p) for p in catalog_service.list_products()]
