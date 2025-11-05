from typing import List, Optional
from sqlmodel import select
from .models import UserModel, ProductModel, CartItemModel
from .db import get_session
from .shop import User, Product, ProductRepository


class UserRepositorySQL:
    def add(self, user: User):
        with get_session() as s:
            m = UserModel(
                id=user.id,
                email=user.email,
                password_hash=user.password_hash,
                first_name=user.first_name,
                last_name=user.last_name,
                address=user.address,
                is_admin=user.is_admin,
            )
            s.add(m)
            s.commit()

    def get(self, user_id: str) -> Optional[User]:
        with get_session() as s:
            m = s.get(UserModel, user_id)
            if not m:
                return None
            return User(
                id=m.id,
                email=m.email,
                password_hash=m.password_hash,
                first_name=m.first_name,
                last_name=m.last_name,
                address=m.address,
                is_admin=m.is_admin,
            )

    def get_by_email(self, email: str) -> Optional[User]:
        with get_session() as s:
            res = s.exec(select(UserModel).where(UserModel.email == email)).first()
            if not res:
                return None
            return User(
                id=res.id,
                email=res.email,
                password_hash=res.password_hash,
                first_name=res.first_name,
                last_name=res.last_name,
                address=res.address,
                is_admin=res.is_admin,
            )


class ProductRepositorySQL:
    def add(self, product: Product):
        with get_session() as s:
            m = ProductModel(
                id=product.id,
                name=product.name,
                description=product.description,
                price_cents=product.price_cents,
                stock_qty=product.stock_qty,
                active=product.active,
                image=getattr(product, "image", None),
            )
            s.merge(m)
            s.commit()

    def get(self, product_id: str) -> Optional[Product]:
        with get_session() as s:
            m = s.get(ProductModel, product_id)
            if not m:
                return None
            return Product(
                id=m.id,
                name=m.name,
                description=m.description,
                price_cents=m.price_cents,
                stock_qty=m.stock_qty,
                active=m.active,
                image=getattr(m, "image", None),
            )

    def list_active(self) -> List[Product]:
        with get_session() as s:
            rows = s.exec(select(ProductModel).where(ProductModel.active == True)).all()  # noqa: E712
            return [
                Product(
                    id=m.id,
                    name=m.name,
                    description=m.description,
                    price_cents=m.price_cents,
                    stock_qty=m.stock_qty,
                    active=m.active,
                    image=getattr(m, "image", None),
                )
                for m in rows
            ]

    def reserve_stock(self, product_id: str, qty: int):
        with get_session() as s:
            m = s.get(ProductModel, product_id)
            if not m or m.stock_qty < qty:
                raise ValueError("Stock insuffisant.")
            m.stock_qty -= qty
            s.add(m)
            s.commit()

    def release_stock(self, product_id: str, qty: int):
        with get_session() as s:
            m = s.get(ProductModel, product_id)
            if m:
                m.stock_qty += qty
                s.add(m)
                s.commit()


class CartServiceSQL:
    def __init__(self, cart_repo_sql, products):
        self.carts = cart_repo_sql
        self.products = products

    def add_to_cart(self, user_id: str, product_id: str, qty: int = 1):
        product = self.products.get(product_id)
        if not product:
            raise ValueError("Produit introuvable.")
        
        # Récupérer le panier actuel
        cart = self.carts.get_or_create(user_id)
        
        # Calculer la nouvelle quantité
        current_item = cart.items.get(product_id)
        current_qty = current_item.quantity if current_item else 0
        new_qty = current_qty + qty
        
        # Sauvegarder en base
        self.carts.save_item(user_id, product_id, new_qty)

    def remove_from_cart(self, user_id: str, product_id: str, qty: int = 1):
        # Récupérer le panier actuel
        cart = self.carts.get_or_create(user_id)
        
        # Calculer la nouvelle quantité
        current_item = cart.items.get(product_id)
        current_qty = current_item.quantity if current_item else 0
        new_qty = max(0, current_qty - qty)
        
        # Sauvegarder en base (supprime si qty = 0)
        self.carts.save_item(user_id, product_id, new_qty)

    def view_cart(self, user_id: str):
        return self.carts.get_or_create(user_id)

    def cart_total(self, user_id: str) -> int:
        cart = self.carts.get_or_create(user_id)
        return cart.total_cents(self.products)


class CartRepositorySQL:
    def get_or_create(self, user_id: str):
        from .shop import Cart, CartItem
        
        with get_session() as s:
            items_models = s.exec(
                select(CartItemModel).where(CartItemModel.user_id == user_id)
            ).all()
            
            cart = Cart(user_id=user_id)
            for item_model in items_models:
                if item_model.quantity > 0:
                    cart.items[item_model.product_id] = CartItem(
                        product_id=item_model.product_id,
                        quantity=item_model.quantity
                    )
            
            return cart

    def save_item(self, user_id: str, product_id: str, quantity: int):
        with get_session() as s:
            existing = s.exec(
                select(CartItemModel).where(
                    CartItemModel.user_id == user_id,
                    CartItemModel.product_id == product_id
                )
            ).first()
            
            if quantity <= 0:
                if existing:
                    s.delete(existing)
                    s.commit()
            else:
                if existing:
                    existing.quantity = quantity
                    s.add(existing)
                else:
                    new_item = CartItemModel(
                        user_id=user_id,
                        product_id=product_id,
                        quantity=quantity
                    )
                    s.add(new_item)
                s.commit()

    def clear(self, user_id: str):
        with get_session() as s:
            items = s.exec(
                select(CartItemModel).where(CartItemModel.user_id == user_id)
            ).all()
            for item in items:
                s.delete(item)
            s.commit()
