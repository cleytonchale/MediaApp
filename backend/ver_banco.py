# -*- coding: utf-8 -*-
import sqlite3
import sys

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Conectar ao banco
conn = sqlite3.connect('media_app.db')

print("\n" + "="*50)
print("ESTATISTICAS DA BASE DE DADOS")
print("="*50)

# Listar tabelas
tables = conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
print(f"\nTabelas encontradas: {len(tables)}")
for table in tables:
    print(f"   - {table[0]}")

# Contar registros
musicas = conn.execute('SELECT COUNT(*) FROM musicas').fetchone()[0]
videos = conn.execute('SELECT COUNT(*) FROM videos').fetchone()[0]
users = conn.execute('SELECT COUNT(*) FROM users').fetchone()[0]

print(f"\nRegistros:")
print(f"   Usuarios: {users}")
print(f"   Musicas: {musicas}")
print(f"   Videos: {videos}")

# Tamanho total dos arquivos
total_music_size = conn.execute('SELECT SUM(tamanho) FROM musicas').fetchone()[0] or 0
total_video_size = conn.execute('SELECT SUM(tamanho) FROM videos').fetchone()[0] or 0

if total_music_size > 0:
    print(f"\nTamanho dos Arquivos:")
    print(f"   Musicas: {total_music_size / (1024*1024):.2f} MB")
if total_video_size > 0:
    print(f"   Videos: {total_video_size / (1024*1024):.2f} MB")

# Últimas músicas
print(f"\nUltimas Musicas:")
cursor = conn.execute('SELECT titulo, artista, created_at FROM musicas ORDER BY created_at DESC LIMIT 5')
for row in cursor:
    print(f"   - {row[0]} por {row[1]}")

# Últimos vídeos
print(f"\nUltimos Videos:")
cursor = conn.execute('SELECT titulo, created_at FROM videos ORDER BY created_at DESC LIMIT 5')
for row in cursor:
    print(f"   - {row[0]}")

print("\n" + "="*50)

conn.close()

