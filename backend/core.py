#core.py sert à faire la transition des instances globales entre les modules 
from shop import (
    UserRepository, ProductRepository, CartRepository,
    SessionManager, AuthService, CartService, CatalogService
)

# Instances globales partagées
users = UserRepository()
products = ProductRepository()
carts = CartRepository()
sessions = SessionManager()

auth_service = AuthService(users, sessions)
catalog_service = CatalogService(products)
cart_service = CartService(carts, products)
