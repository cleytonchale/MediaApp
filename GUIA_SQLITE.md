# 🗄️ GUIA COMPLETO - SQLite Para MediaApp

## 📋 **O QUE É SQLite?**

SQLite é uma base de dados **leve** e **integrada** - não precisa de servidor separado!
- ✅ Um único ficheiro: `media_app.db`
- ✅ Já vem com Python
- ✅ Perfeito para apps pequenas/médias
- ✅ Backup = copiar o ficheiro!

---

## 🎯 **ESTRUTURA DA BASE DE DADOS:**

### **Tabelas criadas automaticamente:**

#### **1. users** (utilizadores)
- `id` - ID único
- `email` - Email do utilizador
- `username` - Nome de utilizador
- `hashed_password` - Senha encriptada
- `created_at` - Data de criação

#### **2. musicas** (músicas uploadadas)
- `id` - ID único
- `titulo` - Título da música
- `artista` - Artista/Cantor
- `album` - Álbum (opcional)
- `arquivo_path` - Caminho do ficheiro
- `duracao` - Duração em segundos
- `tamanho` - Tamanho em bytes
- `genero` - Gênero musical
- `uploaded_by` - ID do usuário que fez upload
- `created_at` - Data de criação
- `updated_at` - Data de atualização

#### **3. videos** (vídeos uploadados)
- `id` - ID único
- `titulo` - Título do vídeo
- `descricao` - Descrição
- `arquivo_path` - Caminho do ficheiro
- `thumbnail_path` - Caminho da thumbnail
- `duracao` - Duração em segundos
- `tamanho` - Tamanho em bytes
- `resolução` - Resolução (ex: "1920x1080")
- `categoria` - Categoria do vídeo
- `uploaded_by` - ID do usuário
- `created_at` - Data de criação
- `updated_at` - Data de atualização

---

## 🔧 **FERRAMENTAS PARA VER/GERIR SQLite:**

### **Opção 1: DB Browser for SQLite (RECOMENDADO - Interface Gráfica)**

#### **Instalar:**
1. Baixa: https://sqlitebrowser.org/
2. Instala (versão padrão)
3. Abre o programa

#### **Usar:**

```powershell
# Abrir o banco de dados
1. Abre DB Browser for SQLite
2. File → Open Database
3. Vai para: C:\Users\HP\MediaApp\backend\
4. Seleciona: media_app.db
5. Clica Open
```

**Ver Tabelas:**
1. Vê as tabelas no painel esquerdo
2. Clica em **"Browse Data"**
3. Seleciona a tabela (users, musicas, videos)
4. Vê todos os dados!

**Adicionar/Eliminar Dados:**
1. Browse Data → New Record (ou Delete)
2. Edita diretamente!
3. File → Write Changes para salvar

---

### **Opção 2: SQLite CLI (Linha de Comando)**

#### **Ver Tabelas:**
```powershell
cd C:\Users\HP\MediaApp\backend

# Abrir banco
python -c "import sqlite3; conn = sqlite3.connect('media_app.db'); print(conn.execute('SELECT name FROM sqlite_master WHERE type=\"table\"').fetchall())"
```

**Ver Dados:**
```powershell
# Ver todas as músicas
python -c "import sqlite3; conn = sqlite3.connect('media_app.db'); print(conn.execute('SELECT * FROM musicas').fetchall())"

# Ver todos os vídeos
python -c "import sqlite3; conn = sqlite3.connect('media_app.db'); print(conn.execute('SELECT * FROM videos').fetchall())"

# Ver todos os usuários
python -c "import sqlite3; conn = sqlite3.connect('media_app.db'); print(conn.execute('SELECT * FROM users').fetchall())"
```

---

### **Opção 3: SQLite Online (Sem Instalar)**

1. Vai para: https://sqliteviewer.app/
2. Upload ficheiro: `media_app.db`
3. Visualiza dados!

---

## 📊 **QUERIES ÚTEIS:**

### **Ver contagem de registos:**
```powershell
cd C:\Users\HP\MediaApp\backend

# Contar músicas
python -c "import sqlite3; conn = sqlite3.connect('media_app.db'); print('Músicas:', conn.execute('SELECT COUNT(*) FROM musicas').fetchone()[0])"

# Contar vídeos
python -c "import sqlite3; conn = sqlite3.connect('media_app.db'); print('Vídeos:', conn.execute('SELECT COUNT(*) FROM videos').fetchone()[0])"

# Contar usuários
python -c "import sqlite3; conn = sqlite3.connect('media_app.db'); print('Usuários:', conn.execute('SELECT COUNT(*) FROM users').fetchone()[0])"
```

### **Ver última música adicionada:**
```powershell
python -c "import sqlite3; conn = sqlite3.connect('media_app.db'); print(conn.execute('SELECT titulo, artista FROM musicas ORDER BY created_at DESC LIMIT 1').fetchone())"
```

### **Ver todas as músicas de um artista:**
```powershell
python -c "import sqlite3; conn = sqlite3.connect('media_app.db'); print(conn.execute('SELECT titulo FROM musicas WHERE artista LIKE \"%NomeArtista%\"').fetchall())"
```

---

## 🔄 **COMO FUNCIONA AUTOMATICAMENTE:**

### **Quando inicias o backend:**

1. **Backend lê** `database.py`:
   ```python
   SQLALCHEMY_DATABASE_URL = "sqlite:///./media_app.db"
   ```

2. **Cria engine** SQLAlchemy com SQLite:
   ```python
   engine = create_engine(SQLALCHEMY_DATABASE_URL)
   ```

3. **Cria tabelas automaticamente**:
   ```python
   Base.metadata.create_all(bind=engine)
   ```
   - Lê `models.py` (User, Musica, Video)
   - Cria tabelas se não existirem
   - Mantém estrutura atualizada

4. **Ficheiro criado**: `backend/media_app.db`

---

## 🎯 **FLUXO DE DADOS:**

### **Upload de Música:**
```
Utilizador → Upload → Backend
                        ↓
                    Salva arquivo em uploads/musicas/
                        ↓
                    Cria registro em SQLite (tabela musicas)
                        ↓
                    Retorna ID para frontend
```

### **Listar Músicas:**
```
Frontend → GET /musicas → Backend
                            ↓
                        Consulta SQLite
                            ↓
                        Retorna lista JSON
```

### **Reproduzir:**
```
Frontend → GET /musicas/{id} → Backend
                                  ↓
                              Busca no SQLite
                                  ↓
                              Retorna arquivo_path
                                  ↓
                              Frontend reproduz do uploads/
```

---

## 🗑️ **RESETAR BASE DE DADOS:**

### **Se quiseres limpar tudo:**
```powershell
cd C:\Users\HP\MediaApp\backend

# Parar backend primeiro!
Get-Process python | Where-Object {$_.MainWindowTitle -like "*main.py*"} | Stop-Process

# Deletar banco
Remove-Item -Force media_app.db

# Iniciar backend (cria novo banco)
python main.py
```

---

## 💾 **BACKUP DA BASE DE DADOS:**

```powershell
cd C:\Users\HP\MediaApp\backend

# Copiar banco
Copy-Item media_app.db media_app_backup.db

# OU zipar tudo
Compress-Archive -Path media_app.db, uploads -DestinationPath backup_mediaapp.zip
```

---

## 📈 **VER ESTATÍSTICAS:**

Cria um script para ver estatísticas:

```powershell
cd C:\Users\HP\MediaApp\backend

# Script para estatísticas
python -c "
import sqlite3
from datetime import datetime

conn = sqlite3.connect('media_app.db')

# Contar registros
musicas = conn.execute('SELECT COUNT(*) FROM musicas').fetchone()[0]
videos = conn.execute('SELECT COUNT(*) FROM videos').fetchone()[0]
users = conn.execute('SELECT COUNT(*) FROM users').fetchone()[0]

# Tamanho dos arquivos
total_music_size = conn.execute('SELECT SUM(tamanho) FROM musicas').fetchone()[0] or 0
total_video_size = conn.execute('SELECT SUM(tamanho) FROM videos').fetchone()[0] or 0

print('📊 ESTATÍSTICAS DA APLICAÇÃO')
print('=' * 40)
print(f'👤 Usuários: {users}')
print(f'🎵 Músicas: {musicas}')
print(f'🎬 Vídeos: {videos}')
print(f'💾 Tamanho Músicas: {total_music_size / (1024*1024):.2f} MB')
print(f'💾 Tamanho Vídeos: {total_video_size / (1024*1024):.2f} MB')
print('=' * 40)
"
```

---

## 🎨 **VISUALIZAÇÃO NO DB BROWSER:**

### **Ver Diagrama de Relações:**
1. Abre DB Browser
2. Tools → Show SQL
3. Vê relações entre tabelas

### **Exportar Dados:**
1. Browse Data
2. File → Export → Export Table(s) to CSV
3. Escolhe tabela
4. Salva!

### **Importar Dados:**
1. Database → Import → Table from CSV
2. Seleciona ficheiro CSV
3. Mapeia colunas
4. Import!

---

## 🔍 **DEBUGGING:**

### **Ver última ação:**
```powershell
# Ver últimas músicas adicionadas
python -c "
import sqlite3
conn = sqlite3.connect('media_app.db')
cursor = conn.execute('SELECT titulo, artista, created_at FROM musicas ORDER BY created_at DESC LIMIT 5')
print('Últimas 5 músicas:')
for row in cursor:
    print(f'  - {row[0]} por {row[1]} em {row[2]}')
"
```

### **Ver erros na estrutura:**
```powershell
python -c "
import sqlite3
conn = sqlite3.connect('media_app.db')

# Listar todas as colunas de uma tabela
cursor = conn.execute('PRAGMA table_info(musicas)')
print('Colunas da tabela musicas:')
for row in cursor:
    print(f'  {row[1]} ({row[2]})')
"
```

---

## ✅ **CHECKLIST:**

- [ ] DB Browser instalado
- [ ] Banco aberto no DB Browser
- [ ] Consegues ver as 3 tabelas
- [ ] Dados aparecem após upload
- [ ] Backup criado
- [ ] Queries funcionam

---

## 🎉 **CONCLUÍDO!**

Agora sabes:
- ✅ Como SQLite funciona na tua app
- ✅ Como ver os dados
- ✅ Como fazer backup
- ✅ Como resetar
- ✅ Como fazer queries

**SQLite é automático - não precisas de fazer nada extra!** 🗄️

