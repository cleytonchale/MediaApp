# 🔗 Como Obter Link Expo Go

## ✅ **SOLUÇÃO SIMPLES - SEM INSTALAR NADA!**

### **PASSO 1: Iniciar Expo:**

```powershell
cd C:\Users\HP\MediaApp
npx expo start --tunnel
```

**Aguarda** ~30 segundos...

---

### **PASSO 2: Ver QR Code e Link:**

No terminal aparece:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press s │ switch to development build
› Press m │ toggle menu
› Press r │ reload app
› Press u │ open developer menu
```

**Aqui tens:**
1. ✅ **QR Code** (para escanear)
2. ✅ **Link:** `exp://192.168.x.x:8081`

---

### **PASSO 3: Pressionar 's' no Terminal:**

**Pressiona tecla 's' no terminal do Expo**

**Expo abre browser com:**
- QR Code grande
- Link partilhável
- URL tipo: `https://expo.dev/@usuario/MediaApp`

**COPIA ESSE LINK!** 📋

---

### **PASSO 4: Pressionar 'w' (opcional):**

**Pressiona 'w' no terminal**

**Expo abre no browser:**
- Versão web da app
- Link para QR code
- URL partilhável

---

## 🌐 **ALTERNATIVA: Criar Conta Expo**

### **Se quiseres link permanente:**

1. **Instalar EAS CLI:**

```powershell
npm install -g eas-cli
```

2. **Login Expo:**

```powershell
eas login
```

**Criar conta se não tiveres:**
- https://expo.dev/signup

3. **Configurar Projeto:**

```powershell
eas init
```

4. **Publicar:**

```powershell
eas update --branch production --message "Primeira versão"
```

5. **Link Permanente:**

```
https://expo.dev/@teu-username/MediaApp
```

---

## ✅ **MÉTODO MAIS RÁPIDO (RECOMENDADO):**

**APENAS EXECUTA:**

```powershell
npx expo start --tunnel
```

**Depois:**
1. Pressiona **'s'** ← Cria link web partilhável
2. Cópia o **Link** que aparece
3. **PARTILHA!** 🎉

---

## 📱 **COMO AMIGOS USAM:**

1. Instalam **Expo Go:**
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. Abrem app **Expo Go**

3. Escaneiam **QR code** OU entram com **link**

4. **App abre!** 🎉

---

## 🔗 **LINKS QUE VAI APARECER:**

### **Opção 1: Link Local (QR Code)**
```
exp://192.168.x.x:8081
```

### **Opção 2: Link Tunnel (--tunnel)**
```
exp://u.expo.dev/xxxxx
```

### **Opção 3: Link Web (pressionar 's')**
```
https://expo.dev/@usuario/MediaApp
```

---

## 🎯 **AÇÃO AGORA:**

```powershell
npx expo start --tunnel
```

**AGUARDA QR CODE APARECER**

**Pressiona 's' para link web**

**COPIA E PARTILHA!** 🚀

