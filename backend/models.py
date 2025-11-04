from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import UniqueConstraint


class UserModel(SQLModel, table=True):
    __tablename__ = "users"
    id: str = Field(primary_key=True, index=True)
    email: str = Field(index=True)
    password_hash: str
    first_name: str
    last_name: str
    address: str
    is_admin: bool = False

    __table_args__ = (
        UniqueConstraint("email", name="uq_users_email"),
    )


class ProductModel(SQLModel, table=True):
    __tablename__ = "products"
    id: str = Field(primary_key=True, index=True)
    name: str
    description: str
    price_cents: int
    stock_qty: int
    active: bool = True


class CartItemModel(SQLModel, table=True):
    __tablename__ = "cart_items"
    # composite primary key (user_id, product_id) simulated by unique constraint + surrogate id
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    product_id: str = Field(index=True)
    quantity: int = 0
    __table_args__ = (
        UniqueConstraint("user_id", "product_id", name="uq_cart_user_product"),
    )
