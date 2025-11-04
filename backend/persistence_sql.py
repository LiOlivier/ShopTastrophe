from typing import List, Optional
from sqlmodel import select
from .models import UserModel, ProductModel, CartItemModel
from .db import get_session
from .shop import User, Product


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


# Note: Cart remains in-memory via existing CartRepository for now.
