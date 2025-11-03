from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import jwt
import os
import shutil
from pathlib import Path
from passlib.context import CryptContext

from database import get_db, engine, Base
from models import User, Musica, Video
from schemas import (
    UserCreate, Token, UserResponse,
    MusicaResponse, MusicaListResponse,
    VideoResponse, VideoListResponse
)

# Configurações
SECRET_KEY = "sua_chave_secreta_aqui_mude_em_producao_123456789"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 dias

# Diretórios de upload
UPLOAD_DIR = Path("uploads")
MUSICA_DIR = UPLOAD_DIR / "musicas"
VIDEO_DIR = UPLOAD_DIR / "videos"
THUMBNAIL_DIR = UPLOAD_DIR / "thumbnails"

# Criar diretórios se não existirem
for directory in [UPLOAD_DIR, MUSICA_DIR, VIDEO_DIR, THUMBNAIL_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Inicialização
Base.metadata.create_all(bind=engine)
app = FastAPI(title="Media Player API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir arquivos estáticos
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Segurança
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# Funções auxiliares
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        username: str = payload.get("username")
        if user_id is None:
            raise credentials_exception
        
        # Se for guest, retornar objeto fake
        if user_id == "guest":
            class GuestUser:
                id = "guest"
                username = "Convidado"
                email = "guest@guest.com"
            return GuestUser()
            
    except jwt.PyJWTError:
        raise credentials_exception
    
    # Se não for guest, buscar usuário no banco
    try:
        user = db.query(User).filter(User.id == int(user_id)).first()
        if user is None:
            raise credentials_exception
        return user
    except ValueError:
        # Se não conseguir converter para int, é guest
        class GuestUser:
            id = "guest"
            username = "Convidado"
            email = "guest@guest.com"
        return GuestUser()


# Rotas de autenticação
@app.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        print(f"\n=== REGISTRO DE USUÁRIO ===")
        print(f"Email: {user_data.email}")
        print(f"Username: {user_data.username}")
        
        # Verificar se email já existe
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            print("Erro: Email já registrado")
            raise HTTPException(status_code=400, detail="Email já registrado")
        
        # Verificar se username já existe
        existing_username = db.query(User).filter(User.username == user_data.username).first()
        if existing_username:
            print("Erro: Username já existe")
            raise HTTPException(status_code=400, detail="Nome de usuário já existe")
        
        # Criar novo usuário
        print("Criando hash da senha...")
        hashed_password = get_password_hash(user_data.password)
        
        print("Criando usuário no banco...")
        new_user = User(
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed_password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print(f"Usuário criado com sucesso! ID: {new_user.id}")
        return new_user
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"\n!!! ERRO no registro !!!")
        print(f"Tipo: {type(e).__name__}")
        print(f"Mensagem: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erro ao criar usuário: {str(e)}")


@app.post("/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Procurar usuário por email
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Criar token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "username": user.username},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/auth/guest", response_model=Token)
def guest_login(db: Session = Depends(get_db)):
    # Criar token para convidado
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": "guest", "username": "Convidado"},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# Rotas de Música
@app.post("/musicas/upload", response_model=MusicaResponse, status_code=status.HTTP_201_CREATED)
async def upload_musica(
    file: UploadFile = File(...),
    titulo: str = Form(...),
    artista: str = Form(...),
    album: Optional[str] = Form(None),
    genero: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload de uma música"""
    
    print(f"\n{'='*60}")
    print(f"=== UPLOAD MÚSICA RECEBIDO ===")
    print(f"{'='*60}")
    print(f"Arquivo: {file.filename}")
    print(f"Título: {titulo}")
    print(f"Artista: {artista}")
    print(f"Usuário: {current_user.username}")
    import sys
    sys.stdout.flush()  # Forçar flush para aparecer nos logs
    
    # Validar extensão
    allowed_extensions = {'.mp3', '.wav', '.flac', '.aac', '.m4a', '.ogg'}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Formato não suportado. Use: {', '.join(allowed_extensions)}"
        )
    
    # Gerar nome único
    timestamp = int(datetime.utcnow().timestamp())
    safe_filename = f"{timestamp}_{file.filename}"
    file_path = MUSICA_DIR / safe_filename
    
    # Salvar arquivo
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_size = file_path.stat().st_size
        
        # Criar registro no banco
        nova_musica = Musica(
            titulo=titulo,
            artista=artista,
            album=album,
            genero=genero,
            arquivo_path=str(file_path.relative_to(UPLOAD_DIR)),
            tamanho=file_size,
            uploaded_by=current_user.id if hasattr(current_user, 'id') and current_user.id != "guest" else 1
        )
        
        db.add(nova_musica)
        db.commit()
        db.refresh(nova_musica)
        
        print(f"✓ Música uploadada: {nova_musica.titulo}")
        return nova_musica
        
    except Exception as e:
        # Deletar arquivo se falhou
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Erro ao fazer upload: {str(e)}")


@app.get("/musicas", response_model=MusicaListResponse)
def listar_musicas(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Listar todas as músicas"""
    
    query = db.query(Musica)
    
    # Busca
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Musica.titulo.ilike(search_term)) |
            (Musica.artista.ilike(search_term)) |
            (Musica.album.ilike(search_term))
        )
    
    total = query.count()
    musicas = query.order_by(Musica.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"musicas": musicas, "total": total}


@app.get("/musicas/{musica_id}", response_model=MusicaResponse)
def obter_musica(musica_id: int, db: Session = Depends(get_db)):
    """Obter detalhes de uma música"""
    musica = db.query(Musica).filter(Musica.id == musica_id).first()
    if not musica:
        raise HTTPException(status_code=404, detail="Música não encontrada")
    return musica


@app.delete("/musicas/{musica_id}")
def deletar_musica(
    musica_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletar uma música"""
    musica = db.query(Musica).filter(Musica.id == musica_id).first()
    if not musica:
        raise HTTPException(status_code=404, detail="Música não encontrada")
    
    # Deletar arquivo
    file_path = UPLOAD_DIR / musica.arquivo_path
    if file_path.exists():
        file_path.unlink()
    
    db.delete(musica)
    db.commit()
    
    return {"message": "Música deletada com sucesso"}


# Rotas de Vídeo
@app.post("/videos/upload", response_model=VideoResponse, status_code=status.HTTP_201_CREATED)
async def upload_video(
    file: UploadFile = File(...),
    titulo: str = Form(...),
    descricao: Optional[str] = Form(None),
    categoria: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload de um vídeo"""
    
    print(f"\n{'='*60}")
    print(f"=== UPLOAD VÍDEO RECEBIDO ===")
    print(f"{'='*60}")
    print(f"Arquivo: {file.filename}")
    print(f"Título: {titulo}")
    print(f"Usuário: {current_user.username}")
    import sys
    sys.stdout.flush()  # Forçar flush para aparecer nos logs
    
    # Validar extensão
    allowed_extensions = {'.mp4', '.avi', '.mov', '.mkv', '.webm'}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Formato não suportado. Use: {', '.join(allowed_extensions)}"
        )
    
    # Gerar nome único
    timestamp = int(datetime.utcnow().timestamp())
    safe_filename = f"{timestamp}_{file.filename}"
    file_path = VIDEO_DIR / safe_filename
    
    # Salvar arquivo
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_size = file_path.stat().st_size
        
        # Criar registro no banco
        novo_video = Video(
            titulo=titulo,
            descricao=descricao,
            categoria=categoria,
            arquivo_path=str(file_path.relative_to(UPLOAD_DIR)),
            tamanho=file_size,
            uploaded_by=current_user.id if hasattr(current_user, 'id') and current_user.id != "guest" else 1
        )
        
        db.add(novo_video)
        db.commit()
        db.refresh(novo_video)
        
        print(f"✓ Vídeo uploadado: {novo_video.titulo}")
        return novo_video
        
    except Exception as e:
        # Deletar arquivo se falhou
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Erro ao fazer upload: {str(e)}")


@app.get("/videos", response_model=VideoListResponse)
def listar_videos(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Listar todos os vídeos"""
    
    query = db.query(Video)
    
    # Busca
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Video.titulo.ilike(search_term)) |
            (Video.descricao.ilike(search_term)) |
            (Video.categoria.ilike(search_term))
        )
    
    total = query.count()
    videos = query.order_by(Video.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"videos": videos, "total": total}


@app.get("/videos/{video_id}", response_model=VideoResponse)
def obter_video(video_id: int, db: Session = Depends(get_db)):
    """Obter detalhes de um vídeo"""
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    return video


@app.delete("/videos/{video_id}")
def deletar_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletar um vídeo"""
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    
    # Deletar arquivo
    file_path = UPLOAD_DIR / video.arquivo_path
    if file_path.exists():
        file_path.unlink()
    
    db.delete(video)
    db.commit()
    
    return {"message": "Vídeo deletado com sucesso"}


@app.get("/")
def root():
    return {
        "message": "Media Player API",
        "status": "online",
        "version": "2.0.0",
        "features": {
            "musicas": "Upload e reprodução de músicas",
            "videos": "Upload e reprodução de vídeos"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
