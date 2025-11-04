# 📱 PUBLICAR APLICAÇÃO NA EXPO - GUIA COMPLETO

## ✅ PRÉ-REQUISITOS:

1. ✅ Conta na Expo (https://expo.dev)
2. ✅ EAS CLI instalado
3. ✅ App configurado para usar API do Render

## 🚀 PASSO A PASSO:

### 1. INSTALAR EAS CLI (se ainda não tiver):

```bash
npm install -g eas-cli
```

### 2. FAZER LOGIN NA EXPO:

```bash
eas login
```

### 3. CONFIGURAR EAS (se necessário):

```bash
eas build:configure
```

### 4. PUBLICAR UPDATE (Over-the-Air Update):

```bash
# Opção 1: Publicar update simples (recomendado para testes)
npx expo publish

# Opção 2: Publicar com mensagem
npx expo publish --message "Versão 1.1.0 - Upload e reprodução de músicas funcionando"
```

### 5. CRIAR BUILD PARA PRODUÇÃO (APK/AAB):

```bash
# Para Android (APK)
eas build --platform android --profile production

# Para Android (AAB - Google Play Store)
eas build --platform android --profile production --type app-bundle

# Para iOS (App Store)
eas build --platform ios --profile production
```

## 📋 PERFIS DE BUILD:

Crie um arquivo `eas.json` na raiz do projeto:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 🎯 OPÇÕES DE DISTRIBUIÇÃO:

### A) EXPO GO (Desenvolvimento/Testes):
```bash
# Iniciar servidor
npx expo start

# Gerar link público
npx expo start --tunnel
```

### B) OTA UPDATE (Sem rebuild):
```bash
npx expo publish
```
- Atualiza o app sem rebuild
- Funciona para apps já instalados
- Mudanças em JavaScript/React

### C) BUILD NATIVO (Produção):
```bash
# Android APK
eas build --platform android --profile preview

# iOS
eas build --platform ios --profile preview
```

## 📝 COMANDOS ÚTEIS:

```bash
# Ver atualizações publicadas
eas update:list

# Ver builds
eas build:list

# Ver status do build
eas build:view [BUILD_ID]

# Baixar APK
eas build:download -p android --latest
```

## 🔍 VERIFICAR PUBLICAÇÃO:

1. Acesse: https://expo.dev/@seu-usuario/MediaApp
2. Veja as atualizações publicadas
3. Escaneie o QR code com Expo Go

## ⚠️ IMPORTANTE:

1. **Versão**: Atualizada para 1.1.0 no `app.json`
2. **API**: Configurada para Render (`src/config.js`)
3. **Permissões**: Todas configuradas no `app.json`
4. **Assets**: Certifique-se de que os ícones existem em `./assets/`

## 📱 TESTAR ANTES DE PUBLICAR:

```bash
# 1. Testar localmente
npx expo start

# 2. Testar no dispositivo físico
npx expo start --tunnel

# 3. Verificar se tudo funciona:
# - Login
# - Upload de música
# - Upload de vídeo
# - Reprodução de música
# - Reprodução de vídeo
```

## 🎉 DEPOIS DE PUBLICAR:

1. Compartilhe o link do Expo
2. Usuários podem escanear o QR code
3. Atualizações OTA aparecem automaticamente

## 📞 SUPORTE:

- Docs Expo: https://docs.expo.dev
- EAS Docs: https://docs.expo.dev/build/introduction/
