from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.shop import Product
from backend.core import products, catalog_service 
from dataclasses import asdict

app = FastAPI(title="ShopTastrophe Test 😏")

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

# PAS d'import des routers d'API pour tester

try:
    if not catalog_service.list_products():
        p1 = Product(id="1", name="T-Shirt Ironique", description="Coton bio", price_cents=3000, stock_qty=12)
        p2 = Product(id="2", name="Sweat Sarcastique", description="Molleton doux", price_cents=6000, stock_qty=100)
        p3 = Product(id="3", name="Casquette Stylée", description="Bleu marine, taille unique", price_cents=2000, stock_qty=20)
        p4 = Product(id="4", name="ChatasTrophe", description="Céramique blanche 30cl", price_cents=1500, stock_qty=15)
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