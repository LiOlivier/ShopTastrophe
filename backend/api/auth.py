from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from ..core import auth_service  # on importe notre service partagé

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()

class RegisterRequest(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    address: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

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

@router.post("/change-password")
def change_password(req: ChangePasswordRequest, credentials = Depends(security)):
    try:
        # Extraire le token et valider la session
        token = credentials.credentials
        session = auth_service.sessions.get_user_id(token)
        if not session:
            raise HTTPException(status_code=401, detail="Token invalide")
        
        # Changer le mot de passe
        success = auth_service.change_password(
            user_id=session,
            current_password=req.current_password,
            new_password=req.new_password
        )
        
        if success:
            return {"message": "Mot de passe modifié avec succès"}
        else:
            raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect")
            
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
