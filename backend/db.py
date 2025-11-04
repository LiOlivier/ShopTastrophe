from sqlmodel import SQLModel, create_engine, Session
import os


DB_URL = os.getenv("DATABASE_URL", "sqlite:///./shop.db")
connect_args = {"check_same_thread": False} if DB_URL.startswith("sqlite") else {}
engine = create_engine(DB_URL, echo=False, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session() -> Session:
    return Session(engine)
