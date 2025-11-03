# 🚀 COMO PARTILHAR APP AGORA

## ✅ **OPÇÃO MAIS RÁPIDA - Expo Go QR Code:**

### **PASSO 1: Iniciar Expo com Tunnel:**

```powershell
cd C:\Users\HP\MediaApp
npx expo start --tunnel
```

**Aguarda:**
- Metro bundler inicia
- QR Code aparece no terminal
- URL aparece tipo: `exp://u.expo.dev/...`

---

### **PASSO 2: Partilhar QR Code:**

**Opção A: Print Screen** 📸
- Print Screen do QR code
- Enviar por WhatsApp/Email
- Amigos escaneiam com Expo Go

**Opção B: URL Direta** 🔗
- Copiar URL: `exp://u.expo.dev/xxxxx`
- Enviar para amigos
- Eles abrem no Expo Go

**Opção C: Link Web** 🌐
- Pressionar 's' no terminal
- Expo abre página web com QR
- Partilhar URL dessa página

---

### **PASSO 3: Amigos Usam:**

**Eles precisam:**

1. **Instalar Expo Go:**
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. **Abrir Expo Go**

3. **Escanear QR Code** OU entrar com URL

4. **App abre!** 🎉

---

## 🌐 **OPÇÃO B - Criar Link Permanente:**

### **EAS Update:**

```powershell
# Instalar EAS
npm install -g eas-cli

# Login
eas login

# Configurar
eas update:configure

# Publicar
eas update --branch production --message "Versão 1.0"
```

**Depois:**
- Link permanente no Expo Dashboard
- Partilhar link
- Usuários instalam/atualizam automaticamente

---

## 📱 **OPÇÃO C - Build .APK (Android):**

Para distribuir .apk sem Google Play:

```powershell
# Instalar EAS
npm install -g eas-cli

# Login
eas login

# Build
eas build --platform android --profile preview
```

**Aguarda 15-20 min**

EAS dá link para download .apk!

---

## ✅ **RECOMENDAÇÃO PARA HOJE:**

**USA OPÇÃO A (QR Code)!** ⭐

```powershell
npx expo start --tunnel
```

**Simples, rápido, funciona!** 🎉

---

## 📋 **CHECKLIST:**

1. ✅ Backend: https://mediaapp-backend-9zw7.onrender.com
2. ✅ Frontend: Código atualizado
3. ✅ Render: Deploy automático
4. ⏳ Expo: Gerar QR code
5. ⏳ Testar no telemóvel
6. ⏳ Partilhar com amigos

---

**EXECUTA ESTE COMANDO AGORA:**

```powershell
npx expo start --tunnel
```

**E partilha o QR code!** 🎉

