from .shop import (
    SessionManager, AuthService, CatalogService
)
from .persistence_sql import UserRepositorySQL, ProductRepositorySQL, CartRepositorySQL, CartServiceSQL
from .db import create_db_and_tables

create_db_and_tables()
users = UserRepositorySQL()
products = ProductRepositorySQL()
carts = CartRepositorySQL()
sessions = SessionManager()

auth_service = AuthService(users, sessions)
catalog_service = CatalogService(products)
cart_service = CartServiceSQL(carts, products)
