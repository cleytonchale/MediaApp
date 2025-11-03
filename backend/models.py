from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.username}>"


class Musica(Base):
    __tablename__ = "musicas"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False, index=True)
    artista = Column(String, nullable=False, index=True)
    album = Column(String, nullable=True)
    arquivo_path = Column(String, nullable=False, unique=True)
    duracao = Column(Float, nullable=True)  # duração em segundos
    tamanho = Column(Integer, nullable=True)  # tamanho em bytes
    genero = Column(String, nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Musica {self.titulo} - {self.artista}>"


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False, index=True)
    descricao = Column(String, nullable=True)
    arquivo_path = Column(String, nullable=False, unique=True)
    thumbnail_path = Column(String, nullable=True)
    duracao = Column(Float, nullable=True)  # duração em segundos
    tamanho = Column(Integer, nullable=True)  # tamanho em bytes
    resolução = Column(String, nullable=True)  # ex: "1920x1080"
    categoria = Column(String, nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Video {self.titulo}>"

