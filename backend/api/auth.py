from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..core import auth_service  # on importe notre service partagé

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    address: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(req: RegisterRequest):
    try:
        user = auth_service.register(
            email=req.email,
            password=req.password,
            first_name=req.first_name,
            last_name=req.last_name,
            address=req.address
        )
        return {"message": "Utilisateur créé avec succès", "user_id": user.id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(req: LoginRequest):
    try:
        token = auth_service.login(req.email, req.password)
        return {"token": token}
    except ValueError:
        raise HTTPException(status_code=401, detail="Identifiants invalides")
