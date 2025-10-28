from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Utiliser un import relatif car `backend` est un package (voir __init__.py)
from .shop import Product, ProductRepository, CatalogService  # import depuis shop.py
from dataclasses import asdict

app = FastAPI(title="ShopTastrophe 😏")

# Autoriser le front (localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation du backend en mémoire
products = ProductRepository()
catalog = CatalogService(products)

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
    # Convertir les dataclasses en dicts pour une sérialisation JSON propre
    return [asdict(p) for p in catalog.list_products()]
