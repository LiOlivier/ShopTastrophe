#core.py sert à faire la transition des instances globales entre les modules 
from shop import (
    CartRepository,
    SessionManager, AuthService, CartService, CatalogService
)
from .persistence_sql import UserRepositorySQL, ProductRepositorySQL
from .db import create_db_and_tables

# Instances globales partagées
create_db_and_tables()
users = UserRepositorySQL()
products = ProductRepositorySQL()
carts = CartRepository()
sessions = SessionManager()

auth_service = AuthService(users, sessions)
catalog_service = CatalogService(products)
cart_service = CartService(carts, products)
