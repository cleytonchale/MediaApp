from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserResponse(BaseModel):
    id: int  # Aceita int (usuário real) - guest terá 0
    email: str
    username: str
    created_at: Optional[datetime] = None  # Guest não tem created_at

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[str] = None


# Schemas para Música
class MusicaBase(BaseModel):
    titulo: str
    artista: str
    album: Optional[str] = None
    genero: Optional[str] = None


class MusicaCreate(MusicaBase):
    pass


class MusicaResponse(MusicaBase):
    id: int
    arquivo_path: str
    duracao: Optional[float] = None
    tamanho: Optional[int] = None
    uploaded_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MusicaListResponse(BaseModel):
    musicas: List[MusicaResponse]
    total: int


# Schemas para Vídeo
class VideoBase(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    categoria: Optional[str] = None


class VideoCreate(VideoBase):
    pass


class VideoResponse(VideoBase):
    id: int
    arquivo_path: str
    thumbnail_path: Optional[str] = None
    duracao: Optional[float] = None
    tamanho: Optional[int] = None
    resolução: Optional[str] = None
    uploaded_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class VideoListResponse(BaseModel):
    videos: List[VideoResponse]
    total: int

