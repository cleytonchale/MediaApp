# 🚀 Como Publicar no Render.com - Passo a Passo COMPLETO

## 📋 **PRÉ-REQUISITOS:**

✅ Conta GitHub (grátis): https://github.com
✅ Conta Render (grátis): https://render.com

---

## **PARTE 1: Criar GitHub Repository**

### **Opção A: Já tens GitHub?**
**SALTAR para PARTE 2!** ⏭️

### **Opção B: Criar Conta GitHub (5 minutos)**

1. **Ir para GitHub:**
   - https://github.com
   - Clica "Sign up"

2. **Criar conta:**
   - Email
   - Senha
   - Confirmar email

3. **Voltar:** https://github.com

---

## **PARTE 2: Colocar Código no GitHub**

### **PASSO 1: Criar Repository**

1. **No GitHub:**
   - Clica botão verde "New" (canto superior direito)
   - Ou vai: https://github.com/new

2. **Configurar:**
   - **Repository name:** `MediaApp` (ou outro nome)
   - **Description:** "Media Player App with React Native"
   - **Public** ✅ (gratuito precisa ser público)
   - NÃO marcar "Add README", "Add .gitignore", "Add license"
   - Clica **"Create repository"**

3. **Guardar URL:**
   - GitHub mostra URL tipo: `https://github.com/teu-username/MediaApp.git`
   - **COPIA ISSA!** 📋

---

### **PASSO 2: Adicionar Ficheiros ao GitHub**

Abre PowerShell no teu PC:

```powershell
# Ir para pasta do projeto
cd C:\Users\HP\MediaApp

# Verificar se já tem .git
Test-Path .git
```

**Se retornar TRUE:** Já tens Git configurado! ⏭️ Saltar para linha "git add"

**Se retornar FALSE:** Configurar Git:

```powershell
# Inicializar Git
git init

# Configurar nome (muda para teu nome)
git config user.name "HP"

# Configurar email (muda para teu email do GitHub)
git config user.email "teu-email@gmail.com"
```

**Continuar:**

```powershell
# Adicionar todos os ficheiros
git add .

# Primeiro commit
git commit -m "Primeira versão do MediaApp"

# Adicionar GitHub remoto (SUBSTITUIR pela TUA URL)
git remote add origin https://github.com/teu-username/MediaApp.git

# Enviar para GitHub
git push -u origin main
```

**Pede autenticação?**
- GitHub só aceita token agora
- Ver **PARTE 3** abaixo

---

## **PARTE 3: Criar Token GitHub (se precisar)**

### **Se pediu senha e deu erro:**

1. **GitHub:**
   - Cliques em teu perfil (canto superior direito)
   - "Settings"

2. **Developer settings:**
   - Rolar até ao fim da página
   - Clica "Developer settings"

3. **Personal access tokens:**
   - "Personal access tokens"
   - "Tokens (classic)"
   - "Generate new token"
   - "Generate new token (classic)"

4. **Configurar:**
   - **Note:** "MediaApp Upload"
   - **Expiration:** 90 days (ou "No expiration")
   - **Scopes:** Marcar "repo" ✅
   - Rolar ao fim → "Generate token"

5. **COPIAR TOKEN:**
   - GitHub mostra token tipo: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **COPIA AGORA!** 📋 (só aparece uma vez!)
   - Guarda em local seguro

6. **Usar no Push:**
   ```powershell
   # Quando pedir username/password:
   # Username: teu-username-github
   # Password: COLA O TOKEN AQUI (ghp_xxxxx)
   
   git push -u origin main
   ```

---

## **PARTE 4: Publicar no Render.com** 🎉

### **PASSO 1: Criar Conta Render**

1. **Ir para Render:**
   - https://render.com
   - Clica "Sign Up"

2. **Login:**
   - "Continue with GitHub"
   - Autoriza Render

---

### **PASSO 2: Criar Web Service**

1. **Dashboard:**
   - Clica "New" → "Web Service"

2. **Conectar GitHub:**
   - "Connect account" se pedir
   - Seleciona repositório "MediaApp"
   - Clica "Connect"

3. **Configurar:**

   **Name:** `mediaapp-backend`
   
   **Region:** `Frankfurt (eu-central)` (mais perto)
   
   **Branch:** `main`
   
   **Root Directory:** `backend` ⚠️ **IMPORTANTE!**
   
   **Runtime:** `Python 3`
   
   **Build Command:**
   ```bash
   pip install -r requirements.txt
   ```
   
   **Start Command:**
   ```bash
   python main.py
   ```

4. **Environment Variables:**
   Clica "Advanced" → "Environment Variables"
   
   Adicionar:
   ```
   KEY: SECRET_KEY
   VALUE: uma_chave_secreta_aleatoria_muito_longa_123456789
   
   KEY: DATABASE_URL
   VALUE: (Render cria automaticamente)
   ```

5. **Plan:**
   - Selecionar **"Free"** ✅
   - Ativar "Auto-Deploy"

6. **Deploy:**
   - Clica "Create Web Service"
   - Aguarda build (5-10 minutos)

7. **URL:**
   - Render dá: `https://mediaapp-backend.onrender.com`
   - **GUARDA ISTO!** 📋

---

## **PARTE 5: Atualizar App com URL do Render**

### **Na app (local):**

Ficheiros para atualizar:
- `src/context/AuthContext.js`
- `src/screens/MusicScreen.js`
- `src/screens/VideoScreen.js`
- `src/screens/HomeScreen.js`
- `src/screens/MusicPlayerScreen.js`
- `src/screens/VideoPlayerScreen.js`

**Mudar de:**
```javascript
const API_BASE = 'http://10.168.62.170:8000';
```

**Para:**
```javascript
const API_BASE = 'https://mediaapp-backend.onrender.com';
```

**OU criar ficheiro único:**

`src/config/api.js`:
```javascript
// Configuração da API
const API_BASE = 'https://mediaapp-backend.onrender.com';
// const API_BASE = 'http://10.168.62.170:8000'; // Local

export default API_BASE;
```

E importar em todos:
```javascript
import API_BASE from '../config/api';
```

---

## **PARTE 6: Fazer Upload para GitHub**

```powershell
cd C:\Users\HP\MediaApp

git add .
git commit -m "Atualizar URL para Render"
git push origin main
```

**Render auto-deploy!** 🚀

---

## **PARTE 7: Testar**

1. **Abrir URL Render:**
   - `https://mediaapp-backend.onrender.com`
   - Deve mostrar: `{"message":"Media Player API","status":"online"}`

2. **Testar guest:**
   - `https://mediaapp-backend.onrender.com/auth/guest`
   - Deve retornar token

3. **Testar na app:**
   - Mudar IP para URL Render
   - Recarregar app
   - Upload deve funcionar! ✅

---

## 🆘 **PROBLEMAS COMUNS:**

### **Erro: "Cannot find module"**
Adicionar ao `backend/requirements.txt`:
```
fastapi==0.115.0
uvicorn[standard]==0.31.0
sqlalchemy==2.0.35
passlib[bcrypt]==1.7.4
bcrypt==4.0.1
python-jose[cryptography]==3.3.0
pyjwt==2.9.0
python-multipart==0.0.12
python-dotenv==1.0.1
email-validator==2.2.0
psycopg2-binary==2.9.7  ← ADICIONAR!
```

### **Erro: "DATABASE_URL not set"**
Render cria automaticamente PostgreSQL!
Só precisa atualizar `backend/database.py`:
```python
import os

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./media_app.db"
)

# Se for PostgreSQL (Render), converter URL
if SQLALCHEMY_DATABASE_URL.startswith("postgres"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://")

SQLALCHEMY_DATABASE_URL
```

### **Render dorme após 15min**
⚠️ Free tier tem limitação!
Soluções:
1. Upgrade para Paid ($7/mês)
2. Usar Railway.app (melhor free tier)
3. Usar uptime robot (pings para não dormir)

---

## ✅ **CHECKLIST:**

- [ ] Conta GitHub criada
- [ ] Código enviado para GitHub
- [ ] Conta Render criada
- [ ] Web Service criado
- [ ] Build bem-sucedido
- [ ] URL funciona no browser
- [ ] App atualizada com URL Render
- [ ] Upload funciona! 🎉

---

**PRECISAS DE AJUDA EM ALGUM PASSO?** 🆘
**Diz-me em que ficaste e ajudo!** 💪

