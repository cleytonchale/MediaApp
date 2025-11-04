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

# Rota customizada para servir arquivos (resolve problemas com caracteres especiais)
from fastapi.responses import FileResponse
from urllib.parse import unquote

@app.get("/uploads/{file_path:path}")
async def serve_file(file_path: str):
    """
    Serve arquivos estáticos com suporte a caracteres especiais e URLs encoded.
    Tenta múltiplas variações do caminho para encontrar o arquivo.
    """
    import urllib.parse
    import sys
    
    # IMPORTANTE: FastAPI DECODIFICA automaticamente os parâmetros de path!
    # Então se a URL tem %20, o FastAPI já decodifica para ESPAÇO antes de passar aqui
    # Mas o arquivo no disco tem %20 LITERAL no nome!
    
    # Normalizar barras
    normalized_path = file_path.replace('\\', '/')
    print(f"\n[SERVE FILE] =========================================")
    print(f"[SERVE FILE] Recebida requisição para: {repr(file_path)}")
    print(f"[SERVE FILE] Caminho normalizado: {repr(normalized_path)}")
    print(f"[SERVE FILE] Contém %20? {'%20' in normalized_path}")
    print(f"[SERVE FILE] Contém espaços? {' ' in normalized_path}")
    sys.stdout.flush()
    
    # IMPORTANTE: FastAPI JÁ DECODIFICA a URL antes de chegar aqui!
    # Se a URL tem %20, o FastAPI converte para ESPAÇO automaticamente
    # Mas o arquivo no disco pode ter %20 LITERAL no nome!
    
    # Lista de caminhos para tentar (em ordem de prioridade)
    paths_to_try = []
    
    # 1. PRIMEIRA TENTATIVA: Se tem espaços, substituir TODOS por %20 literal
    # (arquivo antigo pode ter sido salvo com %20 literal no nome)
    if ' ' in normalized_path:
        path_with_percent20 = normalized_path.replace(' ', '%20')
        paths_to_try.append(path_with_percent20)
        print(f"[SERVE FILE] PRIORIDADE 1: Tentando com %20 literal: {repr(path_with_percent20)}")
    
    # 2. Segunda tentativa: Caminho como recebido (pode funcionar se arquivo novo)
    paths_to_try.append(normalized_path)
    
    # 3. Se tem espaços, tentar com underscore (arquivo novo pode ter sido salvo assim)
    if ' ' in normalized_path:
        path_with_underscore = normalized_path.replace(' ', '_')
        paths_to_try.append(path_with_underscore)
    
    # 4. Se ainda tem %20 na string (não foi decodificado), tentar decodificar
    if '%20' in normalized_path:
        decoded = urllib.parse.unquote(normalized_path)
        if decoded != normalized_path:
            paths_to_try.append(decoded)
            # E tentar com underscore também
            paths_to_try.append(decoded.replace(' ', '_'))
    
    # 5. Decodificar completamente e tentar variações
    fully_decoded = urllib.parse.unquote(normalized_path)
    if fully_decoded != normalized_path:
        # Tentar com %20
        path_fully_decoded_percent = fully_decoded.replace(' ', '%20')
        if path_fully_decoded_percent not in paths_to_try:
            paths_to_try.append(path_fully_decoded_percent)
        # Tentar com underscore
        path_fully_decoded_underscore = fully_decoded.replace(' ', '_').replace('(', '_').replace(')', '_')
        if path_fully_decoded_underscore not in paths_to_try:
            paths_to_try.append(path_fully_decoded_underscore)
    
    # 6. Tentar com todos os caracteres especiais substituídos por underscore
    path_underscore_all = normalized_path.replace(' ', '_').replace('%20', '_').replace('%28', '_').replace('%29', '_').replace('(', '_').replace(')', '_')
    if path_underscore_all != normalized_path and path_underscore_all not in paths_to_try:
        paths_to_try.append(path_underscore_all)
    
    # 7. ÚLTIMA TENTATIVA: Buscar arquivo por timestamp (busca inteligente)
    # Extrair apenas o nome do arquivo (sem timestamp)
    if '/' in normalized_path:
        filename_part = normalized_path.split('/')[-1]
        dir_name = normalized_path.split('/')[0]
        music_dir = UPLOAD_DIR / dir_name if dir_name else UPLOAD_DIR
        
        # Tentar encontrar arquivo que começa com o timestamp
        if music_dir.exists():
            import re
            # Extrair timestamp se existir
            match = re.match(r'^(\d+)_(.+)$', filename_part)
            if match:
                timestamp = match.group(1)
                # Buscar arquivos que começam com o timestamp
                for existing_file in music_dir.iterdir():
                    if existing_file.name.startswith(timestamp + '_'):
                        found_path = f"{dir_name}/{existing_file.name}"
                        if found_path not in paths_to_try:
                            paths_to_try.append(found_path)
                            print(f"[SERVE FILE] Arquivo encontrado por timestamp: {existing_file.name}")
    
    # Remover duplicatas mantendo ordem
    seen = set()
    unique_paths = []
    for p in paths_to_try:
        if p not in seen:
            seen.add(p)
            unique_paths.append(p)
    paths_to_try = unique_paths
    
    print(f"[SERVE FILE] Caminhos para tentar ({len(paths_to_try)}):")
    for i, p in enumerate(paths_to_try, 1):
        print(f"  {i}. {repr(p)}")
    sys.stdout.flush()
    
    # Tentar cada caminho
    full_path = None
    for attempt_path in paths_to_try:
        test_path = UPLOAD_DIR / attempt_path
        print(f"[SERVE FILE] Tentando: {test_path}")
        exists = test_path.exists()
        print(f"[SERVE FILE] Existe? {exists}")
        if exists:
            full_path = test_path
            print(f"[SERVE FILE] ✓✓✓ ARQUIVO ENCONTRADO! ✓✓✓")
            sys.stdout.flush()
            break
        sys.stdout.flush()
    
    # Se não encontrou, listar arquivos para debug
    if full_path is None:
        if '/' in normalized_path:
            music_dir = UPLOAD_DIR / normalized_path.split('/')[0]
        else:
            music_dir = UPLOAD_DIR
            
        if music_dir.exists():
            files = list(music_dir.iterdir())
            print(f"[SERVE FILE] Arquivos encontrados em {music_dir}:")
            for f in files[:10]:
                print(f"  - {f.name}")
            sys.stdout.flush()
        
        raise HTTPException(
            status_code=404, 
            detail=f"Arquivo não encontrado. Tentado: {paths_to_try}"
        )
    
    # Verificar se está dentro do diretório de uploads (segurança)
    try:
        full_path.resolve().relative_to(UPLOAD_DIR.resolve())
    except ValueError:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Determinar content-type baseado na extensão
    content_type = "application/octet-stream"
    suffix = full_path.suffix.lower()
    if suffix in ['.mp3', '.wav', '.flac', '.aac', '.m4a', '.ogg', '.opus']:
        content_type = "audio/mpeg" if suffix == '.mp3' else f"audio/{suffix[1:]}"
    elif suffix in ['.mp4', '.avi', '.mov', '.mkv', '.webm']:
        content_type = f"video/{suffix[1:]}"
    
    return FileResponse(
        path=str(full_path),
        media_type=content_type,
        headers={
            "Accept-Ranges": "bytes",
            "Content-Disposition": f'inline; filename="{full_path.name}"'
        }
    )

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
                id = 0
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
            id = 0
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
    print(f"Content-Type: {file.content_type}")
    print(f"Título: {titulo}")
    print(f"Artista: {artista}")
    print(f"Usuário: {current_user.username}")
    print(f"User ID: {getattr(current_user, 'id', 'N/A')}")
    import sys
    sys.stdout.flush()  # Forçar flush para aparecer nos logs
    
    # Validar que o arquivo foi enviado
    if not file.filename:
        raise HTTPException(status_code=400, detail="Arquivo não fornecido")
    
    # Validar campos obrigatórios
    if not titulo or not titulo.strip():
        raise HTTPException(status_code=400, detail="Título é obrigatório")
    if not artista or not artista.strip():
        raise HTTPException(status_code=400, detail="Artista é obrigatório")
    
    # Validar extensão - aceitar qualquer áudio
    file_ext = Path(file.filename).suffix.lower()
    print(f"Extensão do arquivo: {file_ext}")
    
    # Verificar se o diretório existe e tem permissão de escrita
    if not MUSICA_DIR.exists():
        try:
            MUSICA_DIR.mkdir(parents=True, exist_ok=True)
            print(f"✓ Diretório criado: {MUSICA_DIR}")
        except Exception as e:
            print(f"✗ Erro ao criar diretório: {e}")
            raise HTTPException(status_code=500, detail=f"Erro ao criar diretório de upload: {str(e)}")
    
    # Verificar permissão de escrita
    if not os.access(MUSICA_DIR, os.W_OK):
        raise HTTPException(status_code=500, detail="Sem permissão de escrita no diretório de upload")
    
    # Gerar nome único - sanitizar nome do arquivo
    timestamp = int(datetime.utcnow().timestamp())
    # Remover caracteres problemáticos e codificações URL do nome
    import urllib.parse
    decoded_filename = urllib.parse.unquote(file.filename)  # Decodificar se já estiver encoded
    # Sanitizar: substituir espaços por underscores para evitar problemas com %20
    # Remover caracteres especiais, manter apenas alfanuméricos, hífens, underscores e pontos
    safe_name = decoded_filename.replace(' ', '_').replace('%20', '_')
    # Substituir parênteses e outros caracteres especiais por underscore
    safe_name = safe_name.replace('(', '_').replace(')', '_').replace('%28', '_').replace('%29', '_')
    safe_name = ''.join(c if c.isalnum() or c in ('-', '_', '.') else '_' for c in safe_name)
    safe_filename = f"{timestamp}_{safe_name}"
    file_path = MUSICA_DIR / safe_filename
    
    print(f"Salvando arquivo em: {file_path}")
    
    # Salvar arquivo
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_size = file_path.stat().st_size
        print(f"✓ Arquivo salvo. Tamanho: {file_size} bytes")
        
        if file_size == 0:
            file_path.unlink()
            raise HTTPException(status_code=400, detail="Arquivo vazio ou corrompido")
        
        # Criar registro no banco
        user_id = current_user.id if hasattr(current_user, 'id') and current_user.id != "guest" else 1
        print(f"Criando registro no banco com user_id: {user_id}")
        
        # Normalizar caminho para usar barras normais (compatível com URLs)
        arquivo_path = str(file_path.relative_to(UPLOAD_DIR)).replace('\\', '/')
        
        nova_musica = Musica(
            titulo=titulo.strip(),
            artista=artista.strip(),
            album=album.strip() if album else None,
            genero=genero.strip() if genero else None,
            arquivo_path=arquivo_path,
            tamanho=file_size,
            uploaded_by=user_id
        )
        
        db.add(nova_musica)
        db.commit()
        db.refresh(nova_musica)
        
        print(f"✓ Música uploadada com sucesso: {nova_musica.titulo} (ID: {nova_musica.id})")
        return nova_musica
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Deletar arquivo se falhou
        if file_path.exists():
            try:
                file_path.unlink()
                print(f"✗ Arquivo deletado após erro")
            except:
                pass
        
        print(f"✗ ERRO no upload: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
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
    print(f"Content-Type: {file.content_type}")
    print(f"Título: {titulo}")
    print(f"Usuário: {current_user.username}")
    print(f"User ID: {getattr(current_user, 'id', 'N/A')}")
    import sys
    sys.stdout.flush()  # Forçar flush para aparecer nos logs
    
    # Validar que o arquivo foi enviado
    if not file.filename:
        raise HTTPException(status_code=400, detail="Arquivo não fornecido")
    
    # Validar campos obrigatórios
    if not titulo or not titulo.strip():
        raise HTTPException(status_code=400, detail="Título é obrigatório")
    
    # Validar extensão - aceitar qualquer vídeo
    file_ext = Path(file.filename).suffix.lower()
    print(f"Extensão do arquivo: {file_ext}")
    
    # Verificar se o diretório existe e tem permissão de escrita
    if not VIDEO_DIR.exists():
        try:
            VIDEO_DIR.mkdir(parents=True, exist_ok=True)
            print(f"✓ Diretório criado: {VIDEO_DIR}")
        except Exception as e:
            print(f"✗ Erro ao criar diretório: {e}")
            raise HTTPException(status_code=500, detail=f"Erro ao criar diretório de upload: {str(e)}")
    
    # Verificar permissão de escrita
    if not os.access(VIDEO_DIR, os.W_OK):
        raise HTTPException(status_code=500, detail="Sem permissão de escrita no diretório de upload")
    
    # Gerar nome único - sanitizar nome do arquivo
    timestamp = int(datetime.utcnow().timestamp())
    # Remover caracteres problemáticos e codificações URL do nome
    import urllib.parse
    decoded_filename = urllib.parse.unquote(file.filename)  # Decodificar se já estiver encoded
    # Sanitizar: substituir espaços por underscores para evitar problemas com %20
    # Remover caracteres especiais, manter apenas alfanuméricos, hífens, underscores e pontos
    safe_name = decoded_filename.replace(' ', '_').replace('%20', '_')
    # Substituir parênteses e outros caracteres especiais por underscore
    safe_name = safe_name.replace('(', '_').replace(')', '_').replace('%28', '_').replace('%29', '_')
    safe_name = ''.join(c if c.isalnum() or c in ('-', '_', '.') else '_' for c in safe_name)
    safe_filename = f"{timestamp}_{safe_name}"
    file_path = VIDEO_DIR / safe_filename
    
    print(f"Salvando arquivo em: {file_path}")
    
    # Salvar arquivo
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_size = file_path.stat().st_size
        print(f"✓ Arquivo salvo. Tamanho: {file_size} bytes")
        
        if file_size == 0:
            file_path.unlink()
            raise HTTPException(status_code=400, detail="Arquivo vazio ou corrompido")
        
        # Criar registro no banco
        user_id = current_user.id if hasattr(current_user, 'id') and current_user.id != "guest" else 1
        print(f"Criando registro no banco com user_id: {user_id}")
        
        # Normalizar caminho para usar barras normais (compatível com URLs)
        arquivo_path = str(file_path.relative_to(UPLOAD_DIR)).replace('\\', '/')
        
        novo_video = Video(
            titulo=titulo.strip(),
            descricao=descricao.strip() if descricao else None,
            categoria=categoria.strip() if categoria else None,
            arquivo_path=arquivo_path,
            tamanho=file_size,
            uploaded_by=user_id
        )
        
        db.add(novo_video)
        db.commit()
        db.refresh(novo_video)
        
        print(f"✓ Vídeo uploadado com sucesso: {novo_video.titulo} (ID: {novo_video.id})")
        return novo_video
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Deletar arquivo se falhou
        if file_path.exists():
            try:
                file_path.unlink()
                print(f"✗ Arquivo deletado após erro")
            except:
                pass
        
        print(f"✗ ERRO no upload: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
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
    # Configurações para aceitar arquivos grandes (até 100MB)
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        limit_concurrency=100,
        limit_max_requests=1000,
        timeout_keep_alive=300,  # 5 minutos
    )
