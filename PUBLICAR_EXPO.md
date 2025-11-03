# 📱 Como Publicar App no Expo

## 📋 **OPÇÕES:**

### **OPÇÃO 1: Expo Go (DEPOIS DE FAZER PUSH)** ✅ MAIS FÁCIL!

Não precisa publicar separadamente!

**A app já está disponível via Expo Go!**

#### **Como Usuários Vão Aceder:**

1. **Instalar Expo Go:**
   - Google Play: https://play.google.com/store/apps/details?id=host.exp.exponent
   - App Store: https://apps.apple.com/app/expo-go/id982107779

2. **Instalar tua app:**
   - Usuário abre Expo Go
   - Escaneia QR code do Expo
   - OU entra com tua conta Expo

3. **TU PARTILHAS:**
   ```bash
   npx expo start --tunnel
   ```
   
   **QR Code aparece!**
   
   Usuários escaneiam e usam! 🎉

---

### **OPÇÃO 2: EAS Update (Publish Updates)** 🔄

Para distribuir updates sem publicar nas stores:

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar
eas update:configure

# Publicar update
eas update --branch production --message "Primeira versão"

# DISTRIBUIR para usuários
eas update --branch production
```

**Users atualizam automaticamente!** ✅

---

### **OPÇÃO 3: EAS Build (Standalone Apps)** 📦

Criar .apk/.ipa para distribuir:

#### **Build Android:**

```bash
# Instalar EAS
npm install -g eas-cli

# Login
eas login

# Configurar
eas build:configure

# Build Android
eas build --platform android --profile preview

# Aguardar (10-20 min)
# EAS dá link para download .apk
```

#### **Build iOS:**

```bash
eas build --platform ios --profile preview
```

**Distribuir:**
- Android: Download direto .apk
- iOS: TestFlight (precisa conta desenvolvedor Apple)

---

### **OPÇÃO 4: Google Play Store / App Store** 🏪

Para publicar nas lojas:

#### **Android (Google Play):**

```bash
# Build production
eas build --platform android --profile production

# Submeter para Play Store
eas submit --platform android
```

**Requisitos:**
- Conta Google Play Developer ($25 one-time)
- ~$25 USD
- 1-7 dias para aprovação

#### **iOS (App Store):**

```bash
# Build production
eas build --platform ios --profile production

# Submeter para App Store
eas submit --platform ios
```

**Requisitos:**
- Conta Apple Developer ($99/year)
- Review mais rigoroso
- 1-3 dias para aprovação

---

## 🎯 **RECOMENDAÇÃO:**

### **Para Testar Agora:**
**OPÇÃO 1 - Expo Go!** ⭐

1. Abres terminal:
   ```bash
   npx expo start --tunnel
   ```

2. Partilhas QR code com amigos!

3. Eles instalam Expo Go e escaneiam!

**PRONTO!** 🎉

---

### **Para Produção (Milhares de Users):**
**OPÇÃO 4 - Play Store / App Store**

- Mais profissional
- Não precisa Expo Go
- Build nativo
- Publicidade gratuita

---

## 🚀 **TESTE AGORA:**

### **Compartilhar com QR Code:**

```bash
# No terminal
npx expo start --tunnel
```

**QR Code aparece!**

**Amigos:**
1. Instalam Expo Go
2. Abrem app
3. Escaneiam QR
4. **App abre!** 🎉

---

## 📱 **Criar Link Permanente:**

### **Expo Go Link:**

Depois de `npx expo start`, terminal mostra:
```
Metro waiting on exp://192.168.1.X:8081
```

**Link permanente:**
`exp://192.168.1.X:8081`

Usuários abrem Expo Go e entram com este link!

---

### **OU Criar link.small:**

```bash
# Instalar
npm install -g @expo/link

# Criar link
npx @expo/link
```

**Partilhar link!** 🔗

---

## ✅ **RESUMO:**

**Para distribuir AGORA:**
✅ Expo Go + QR code

**Para distribuir updates:**
✅ EAS Update

**Para app standalone:**
✅ EAS Build

**Para lojas:**
✅ Google Play / App Store

---

**QUAL OPÇÃO QUERES?** 🤔

Para **TESTAR AGORA**, usa OPÇÃO 1! ⭐

