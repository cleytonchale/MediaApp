"""
Script para adicionar música/vídeo manualmente ao banco
"""
from database import SessionLocal, engine, Base
from models import User, Musica, Video
from pathlib import Path
import os
from datetime import datetime

# Criar tabelas
Base.metadata.create_all(bind=engine)

def adicionar_musica():
    """Adicionar música manualmente"""
    db = SessionLocal()
    
    try:
        print("\n=== ADICIONAR MÚSICA ===")
        print("\nArquivos na pasta uploads/musicas:")
        
        # Listar arquivos disponíveis
        musica_dir = Path("uploads/musicas")
        if musica_dir.exists():
            arquivos = list(musica_dir.glob("*"))
            for i, arquivo in enumerate(arquivos, 1):
                print(f"{i}. {arquivo.name} ({arquivo.stat().st_size} bytes)")
        else:
            print("Pasta vazia ou não existe")
            return
        
        # Ler dados
        num = input("\nNúmero do arquivo: ")
        try:
            arquivo_escolhido = arquivos[int(num) - 1]
        except (ValueError, IndexError):
            print("Erro: Número inválido")
            return
        
        titulo = input("Título: ").strip()
        artista = input("Artista: ").strip()
        album = input("Álbum (opcional): ").strip() or None
        genero = input("Gênero (opcional): ").strip() or None
        
        if not titulo or not artista:
            print("Erro: Título e Artista são obrigatórios")
            return
        
        # Criar registro
        nova_musica = Musica(
            titulo=titulo,
            artista=artista,
            album=album,
            genero=genero,
            arquivo_path=f"musicas/{arquivo_escolhido.name}",
            tamanho=arquivo_escolhido.stat().st_size,
            uploaded_by=1  # Assumindo usuário ID 1
        )
        
        db.add(nova_musica)
        db.commit()
        db.refresh(nova_musica)
        
        print(f"\n✓ Música adicionada: {nova_musica.titulo} - {nova_musica.artista}")
        
    except Exception as e:
        print(f"\nErro: {e}")
        db.rollback()
    finally:
        db.close()


def adicionar_video():
    """Adicionar vídeo manualmente"""
    db = SessionLocal()
    
    try:
        print("\n=== ADICIONAR VÍDEO ===")
        print("\nArquivos na pasta uploads/videos:")
        
        # Listar arquivos disponíveis
        video_dir = Path("uploads/videos")
        if video_dir.exists():
            arquivos = list(video_dir.glob("*"))
            for i, arquivo in enumerate(arquivos, 1):
                print(f"{i}. {arquivo.name} ({arquivo.stat().st_size} bytes)")
        else:
            print("Pasta vazia ou não existe")
            return
        
        # Ler dados
        num = input("\nNúmero do arquivo: ")
        try:
            arquivo_escolhido = arquivos[int(num) - 1]
        except (ValueError, IndexError):
            print("Erro: Número inválido")
            return
        
        titulo = input("Título: ").strip()
        descricao = input("Descrição (opcional): ").strip() or None
        categoria = input("Categoria (opcional): ").strip() or None
        
        if not titulo:
            print("Erro: Título é obrigatório")
            return
        
        # Criar registro
        novo_video = Video(
            titulo=titulo,
            descricao=descricao,
            categoria=categoria,
            arquivo_path=f"videos/{arquivo_escolhido.name}",
            tamanho=arquivo_escolhido.stat().st_size,
            uploaded_by=1  # Assumindo usuário ID 1
        )
        
        db.add(novo_video)
        db.commit()
        db.refresh(novo_video)
        
        print(f"\n✓ Vídeo adicionado: {novo_video.titulo}")
        
    except Exception as e:
        print(f"\nErro: {e}")
        db.rollback()
    finally:
        db.close()


def listar():
    """Listar músicas e vídeos existentes"""
    db = SessionLocal()
    
    try:
        print("\n=== MÚSICAS ===")
        musicas = db.query(Musica).all()
        for m in musicas:
            print(f"ID {m.id}: {m.titulo} - {m.artista}")
        
        print("\n=== VÍDEOS ===")
        videos = db.query(Video).all()
        for v in videos:
            print(f"ID {v.id}: {v.titulo}")
        
    finally:
        db.close()


if __name__ == "__main__":
    while True:
        print("\n" + "="*50)
        print("GESTOR DE MÍDIA MANUAL")
        print("="*50)
        print("1. Adicionar Música")
        print("2. Adicionar Vídeo")
        print("3. Listar Tudo")
        print("0. Sair")
        print("="*50)
        
        opcao = input("\nEscolha uma opção: ").strip()
        
        if opcao == "1":
            adicionar_musica()
        elif opcao == "2":
            adicionar_video()
        elif opcao == "3":
            listar()
        elif opcao == "0":
            print("\nAté logo!")
            break
        else:
            print("\nOpção inválida!")

