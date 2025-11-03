# 🔄 Como Atualizar Render e Expo

## 📋 **COMO FUNCIONA:**

### **1. BACKEND (Render.com):** ✅ AUTOMÁTICO!

**Render atualiza AUTOMATICAMENTE** quando fazes push para GitHub!

#### **Como funciona:**
1. Fazes alterações no código
2. Fazes push para GitHub:
   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push origin master
   ```
3. Render **detecta** automaticamente
4. Render **re-deploys** automaticamente
5. Aguardas 5-10 minutos
6. **PRONTO!** ✅

**NÃO precisas fazer nada no Render!** 🎉

---

### **2. FRONTEND (Expo):** ⚠️ MANUAL!

**Expo NÃO atualiza automaticamente** a app nos usuários!

#### **Opção A: Metro Bundler (Desenvolvimento)**

Se estás em modo desenvolvimento (`npx expo start`):

**Simplesmente recarrega:**
- No terminal Expo: **pressiona 'r'**
- Na app: **puxa para baixo** (pull-to-refresh)

**OU recarregar app no telemóvel:**
- Fecha e abre novamente Expo Go

**Últimas mudanças aparecem!** ✅

---

#### **Opção B: EAS Update (Produção)**

Se quiseres distribuir updates para usuários em produção:

**Primeiro build:**

```bash
# Instalar EAS
npm install -g eas-cli

# Login
eas login

# Configurar
eas build:configure

# Build Android
eas build --platform android --profile preview

# Build iOS
eas build --platform ios --profile preview
```

**Depois fazer updates:**

```bash
# Fazer alterações no código

# Enviar para GitHub
git add .
git commit -m "Nova versão"
git push origin master

# Publicar update EAS
eas update --branch production --message "Descrição da atualização"
```

**Usuários recebem update automaticamente!** ✅

---

## 🎯 **PARA TI AGORA:**

### **SITUAÇÃO ATUAL:**

**Backend (Render):**
- ✅ Já configurado para auto-deploy
- ✅ Cada push = redeploy automático
- **FAZER NADA!** ✅

**Frontend (Expo):**
- ⚠️ Modo desenvolvimento (`npx expo start`)
- ⚠️ Atualizações manuais

---

### **O QUE FAZER AGORA:**

#### **Se fizeres mudanças no BACKEND:**

```bash
cd C:\Users\HP\MediaApp

# Fazer alterações em backend/

git add backend/
git commit -m "Descrição"
git push origin master

# AGUARDAR 5-10 MIN
# Render faz deploy automático!
```

#### **Se fizeres mudanças no FRONTEND:**

```bash
cd C:\Users\HP\MediaApp

# Fazer alterações em src/

git add src/
git commit -m "Descrição"
git push origin master

# RECARREGAR APP NO TELEMÓVEL:
# - Pressiona 'r' no terminal Expo
# - OU fecha e abre Expo Go
```

---

## 🔄 **WORKFLOW COMPLETO:**

### **Desenvolvimento Ativo:**

**Backend:**
1. Editar `backend/`
2. Testar localmente
3. `git add backend/; git commit -m "X"; git push`
4. Aguardar Render redeploy ✅

**Frontend:**
1. Editar `src/`
2. Salvar ficheiro
3. Metro reloads automaticamente
4. App atualiza instantaneamente ✅

---

### **Produção (Distribuir):**

**Backend:**
1. Push para GitHub
2. Render auto-deploy
3. ✅ Pronto!

**Frontend:**
1. Push para GitHub
2. EAS Update:
   ```bash
   eas update --branch production
   ```
3. Usuários recebem automaticamente ✅

---

## 📱 **ESTADO ATUAL:**

### **Render (Backend):**
- ✅ Auto-deploy configurado
- ✅ Já no ar: https://mediaapp-backend-9zw7.onrender.com
- ✅ Cada push = redeploy

### **Expo (Frontend):**
- ✅ Metro rodando (`npx expo start --tunnel`)
- ✅ Dev mode (atualizações instantâneas)
- ⏳ Build produção (fazer depois)

---

## ✅ **RESUMO:**

| O Que | Atualização | Como |
|-------|-------------|------|
| **Backend** | Automática | Push GitHub |
| **Frontend Dev** | Instantânea | Save file |
| **Frontend Prod** | Manual | EAS Update |

---

## 🚀 **PARA PUBLICAR AGORA:**

### **Backend:**
✅ **JÁ ESTÁ ONLINE!**
- https://mediaapp-backend-9zw7.onrender.com
- Cada push = redeploy automático

### **Frontend:**
📱 **Partilhar QR Code:**

```bash
npx expo start --tunnel
```

**Pressiona 's' para link web**
**Partilha QR code ou link!** 🎉

---

**RESUMO:**
- Render = Automático ✅
- Expo Dev = Instantâneo ✅
- Expo Prod = Manual (EAS Update)

**TUDO FUNCIONANDO!** 🎉

