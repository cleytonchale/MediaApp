# 🚀 Deploy no Render.com - AGORA!

## ✅ **GitHub OK!**

Código enviado com sucesso! 🎉

**Repository:** https://github.com/cleytonchale/MediaApp

---

## 🌐 **AGORA: Deploy no Render**

### **PASSO 1: Criar Conta Render**

1. **Ir para Render:**
   - https://render.com
   - Clica "Get Started for Free"

2. **Login com GitHub:**
   - Clica "Continue with GitHub"
   - Autoriza Render
   - Pede email → confirma

---

### **PASSO 2: Criar Web Service**

1. **Dashboard Render:**
   - Clica "New +"
   - Clica "Web Service"

2. **Conectar Repository:**
   - Render mostra lista dos teus repos
   - Se não aparecer, clica "Configure account" → autoriza
   - Seleciona **"MediaApp"** ✅
   - Clica "Connect"

---

### **PASSO 3: Configurar Build**

**Preenche os seguintes campos:**

#### **1. Name:**
```
mediaapp-backend
```

#### **2. Region:**
```
Frankfurt (eu-central)  ← ou mais perto
```

#### **3. Branch:**
```
master  ← porque usa master, não main
```

#### **4. Root Directory:**
```
backend  ← ⚠️ IMPORTANTE!
```

#### **5. Runtime:**
```
Python 3  ← auto-detectar
```

#### **6. Build Command:**
```bash
pip install -r requirements.txt
```

#### **7. Start Command:**
```bash
python main.py
```

---

### **PASSO 4: Configurar Environment Variables**

**Clicar em "Advanced" (abaixo)**

**Environment Variables:**
Clica "Add Environment Variable"

**Variável 1:**
- **Key:** `SECRET_KEY`
- **Value:** `minha_chave_secreta_super_aleatoria_123456789_abcdefg`

**Variável 2:**
- Render já cria `DATABASE_URL` automaticamente! ✅

---

### **PASSO 5: Escolher Plan**

- Selecionar **"Free"** ✅

**Auto-Deploy:**
- Deixar **"Yes"** ✅ (auto-deploy quando fazes push)

---

### **PASSO 6: Deploy!**

1. **Clica "Create Web Service"**

2. **Aguarda build:**
   - ~5-10 minutos
   - Ver progresso em tempo real
   - Logs aparecem na tela

3. **Build completo! ✅**
   - Render dá URL tipo: `https://mediaapp-backend.onrender.com`
   - **GUARDA ESSA URL!** 📋

---

### **PASSO 7: Testar**

1. **Abrir URL no browser:**
   ```
   https://mediaapp-backend.onrender.com
   ```

2. **Deve aparecer:**
   ```json
   {
     "message": "Media Player API",
     "status": "online",
     "version": "2.0.0"
   }
   ```

3. **Testar Guest:**
   ```
   https://mediaapp-backend.onrender.com/auth/guest
   ```

---

## 📱 **ATUALIZAR APP**

### **Opção A: Atualizar TODOS os ficheiros**

Procurar em todos estes ficheiros:
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

**OU (melhor): Criar ficheiro config único**

---

### **Opção B: Ficheiro Config Único** ⭐ RECOMENDADO

**Criar:**
`src/config.js`:
```javascript
// Configuração da API
const API_BASE = process.env.REACT_APP_API_URL || 'https://mediaapp-backend.onrender.com';

export default API_BASE;
```

**Agora importar em TODOS:**
```javascript
import API_BASE from '../config/config';
```

---

### **Fazer Push:**

```powershell
cd C:\Users\HP\MediaApp

git add .
git commit -m "Atualizar para URL Render"
git push origin master
```

**Render auto-deploy!** 🚀

---

## ⚠️ **IMPORTANTE: Mudar de SQLite para PostgreSQL**

Render cria PostgreSQL automaticamente!

**Precisas atualizar `backend/database.py`:**

```python
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Pegar URL do ambiente (Render cria automaticamente)
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./media_app.db"
)

# IMPORTANTE: Render usa PostgreSQL que começa com postgres://
# SQLAlchemy precisa postgresql://
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace(
        "postgres://", 
        "postgresql://"
    )

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

### **Precisas também atualizar `requirements.txt`:**

Adicionar:
```
psycopg2-binary==2.9.7
```

---

### **Fazer Push:**

```powershell
git add backend/
git commit -m "Adicionar suporte PostgreSQL para Render"
git push origin master
```

---

## 🆘 **PROBLEMAS?**

### **Build falhou?**
Ver logs no Render dashboard
- Clica no teu service
- Aba "Logs"
- Copiar erro e mostrar-me

### **URL não funciona?**
- Aguardar 1-2 minutos após build
- Tentar novamente
- Se ainda não funcionar, verificar logs

### **Database error?**
Verificar `DATABASE_URL` está definida:
- Render dashboard → teu service → Environment

---

## ✅ **CHECKLIST FINAL:**

- [ ] Conta Render criada ✅
- [ ] Service criado ✅
- [ ] Build completo ✅
- [ ] URL funciona ✅
- [ ] database.py atualizado
- [ ] requirements.txt atualizado
- [ ] App atualizada com URL Render
- [ ] Push feito
- [ ] Tudo funciona! 🎉

---

**VAI PARA RENDER.COM AGORA!** 🚀
**Segue os passos acima e diz-me se funciona!** 💪

