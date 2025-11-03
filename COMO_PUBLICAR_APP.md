# 🌐 Como Publicar o MediaApp

## 📋 **OPÇÕES DE HOSPEDAGEM:**

### **OPÇÃO 1: GRÁTIS (Recomendado para começar) ⭐**

#### **Backend:**
- **Railway.app** (grátis): https://railway.app
  - ✅ Mais fácil
  - ✅ Grátis com $5 creditos/mês
  - ✅ PostgreSQL grátis incluído
  
- **Render.com** (grátis): https://render.com
  - ✅ Grátis mas dorme após 15min inativo
  - ⚠️ Perfeito para testes

- **Fly.io** (grátis): https://fly.io
  - ✅ Excelente performance
  - ✅ Grátis generoso

#### **Frontend:**
- **Expo (EAS)** ⭐ RECOMENDADO
  - ✅ Já usa Expo!
  - ✅ Grátis
  - ✅ Build e publica automaticamente

**Custo:** TOTALMENTE GRÁTIS ✅

---

### **OPÇÃO 2: PAGO (Produção)**

#### **Backend:**
- **Heroku** ($7/mês): https://heroku.com
  - ⚠️ Não tem mais free tier
  - ✅ Muito confiável
  
- **DigitalOcean App Platform** ($5/mês): https://digitalocean.com
  - ✅ Excelente preço
  - ✅ Performance ótima

- **AWS Elastic Beanstalk** ($0-10/mês): https://aws.amazon.com
  - ✅ Escalável
  - ⚠️ Mais complexo

#### **Frontend:**
- **Expo EAS** ($29-99/mês): https://expo.dev
- **AWS Amplify**: https://aws.amazon.com/amplify

**Custo:** $5-10/mês 💰

---

### **OPÇÃO 3: VPS (Controlo Total)**

#### **Backend + Frontend:**
- **DigitalOcean Droplet** ($6/mês): https://digitalocean.com
- **Linode** ($5/mês): https://linode.com
- **Vultr** ($6/mês): https://vultr.com

**Custo:** $5-10/mês 💰

---

## 🚀 **GUIA PASSO A PASSO - OPÇÃO 1 (GRÁTIS) ⭐**

### **PARTE 1: Backend no Railway**

1. **Criar conta:**
   - Vai para https://railway.app
   - Clica "Login" → "Github"
   - Autoriza Railway

2. **Criar projeto:**
   - Clica "New Project"
   - Clica "Deploy from Github repo"
   - Seleciona teu repo (ou fork)

3. **Configurar:**
   - Railway detecta Python automaticamente
   - Adiciona estes **Environment Variables**:
     ```
     SECRET_KEY=sua_chave_secreta_aleatoria_aqui_123
     ```
   - Railway cria PostgreSQL automaticamente

4. **Deploy:**
   - Clica "Deploy"
   - Aguarda build (2-5 min)
   - Railway dá URL: `https://seu-app.up.railway.app`

5. **Atualizar Base URL:**
   - Copia URL do Railway
   - Atualiza `API_BASE` na app:
   ```javascript
   const API_BASE = 'https://seu-app.up.railway.app';
   ```

---

### **PARTE 2: Frontend com Expo EAS**

1. **Instalar EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login:**
   ```bash
   eas login
   ```

3. **Configurar:**
   ```bash
   eas build:configure
   ```

4. **Build Android:**
   ```bash
   eas build --platform android
   ```

5. **Build iOS:**
   ```bash
   eas build --platform ios
   ```

6. **Publicar:**
   ```bash
   eas update --branch production --message "Primeira versão"
   ```

**A app fica no Expo Go e Google Play/App Store!** 🎉

---

## 🔧 **ALTERAÇÕES NECESSÁRIAS:**

### **1. Atualizar IPs na app:**
`src/context/AuthContext.js`, `src/screens/*.js`:
```javascript
const API_BASE = 'https://seu-app.up.railway.app';
```

### **2. CORS já está configurado:**
✅ Já tem `allow_origins=["*"]` no backend!

### **3. Database:**
Railway cria PostgreSQL automaticamente!
Só precisa atualizar `database.py` para PostgreSQL:
```python
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
```

---

## 📦 **ALTERNATIVAS MAIS RÁPIDAS:**

### **Backend - Render.com:**
1. https://render.com
2. "New Web Service"
3. Conecta GitHub repo
4. Build: `python -m pip install -r requirements.txt`
5. Start: `python main.py`
6. URL: `https://seu-app.onrender.com`
7. **GRÁTIS!** ✅

### **Frontend - Expo já pronto:**
O Expo já publica! Só precisa:
```bash
npx expo publish
```

---

## 🎯 **RECOMENDAÇÃO FINAL:**

**Para começar:** Railway + Expo ✅
- Grátis
- Fácil
- Funciona bem

**Para produção:** DigitalOcean + Expo EAS
- Barato
- Confiável
- Performance excelente

---

## 🆘 **PRECISAS DE AJUDA?**

**Qual opção queres usar?**
1. Railway + Expo (grátis, fácil) ⭐
2. Render + Expo (grátis, mais lento)
3. DigitalOcean (pago, melhor)
4. Outro?

**Diz-me e faço guia detalhado!** 🚀

