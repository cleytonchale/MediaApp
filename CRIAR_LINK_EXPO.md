# 🔗 Como Criar Link Expo Go Permanente

## 🎯 **O QUE QUERES:**

Link tipo:
```
https://expo.dev/preview/update?message=...
```

---

## ✅ **SOLUÇÃO - EAS Update:**

### **PASSO 1: Instalar EAS CLI**

```powershell
npm install -g eas-cli
```

---

### **PASSO 2: Login Expo**

```powershell
eas login
```

**Criar conta se não tiveres:**
- Vai para: https://expo.dev/signup
- Cria conta gratuita

---

### **PASSO 3: Configurar Projeto**

```powershell
cd C:\Users\HP\MediaApp
eas update:configure
```

**Escolher:**
- Branch: `production` (ou default)
- Update strategy: `classic` ou `native`

---

### **PASSO 4: Verificar app.json**

Criar/verificar `app.json`:

```json
{
  "expo": {
    "name": "MediaApp",
    "slug": "mediaapp",
    "version": "1.0.0",
    "sdkVersion": "54.0.0"
  }
}
```

---

### **PASSO 5: Publicar Update**

```powershell
eas update --branch production --message "Versão 1.0"
```

**EAS dá:**
```
✅ Published update!

Link: https://expo.dev/preview/update?message=Versao_1.0&updateRuntimeVersion=1.0.0&...
```

**COPIA ESSE LINK!** 📋

---

### **PASSO 6: Partilhar Link**

Link permanente tipo:
```
https://expo.dev/preview/update?message=Versao_1.0&updateRuntimeVersion=1.0.0&createdAt=2025-11-03T12%3A00%3A00.000Z&slug=mediaapp&projectId=xxxxx&group=xxxxx
```

**Usuários:**
1. Abrem Expo Go
2. Entram com este link
3. App carrega! 🎉

---

## 🔄 **ATUALIZAR APP DEPOIS:**

```powershell
# Fazer alterações no código

# Publicar nova versão
eas update --branch production --message "Correções"
```

**Novo link gerado automaticamente!**

---

## 📱 **ALTERNATIVA MAIS RÁPIDA:**

### **Sem EAS (Desenvolvimento):**

```powershell
npx expo start --tunnel
```

**Pressiona 's' no terminal**

**Link aparece!** 🔗

---

## 🎯 **RECOMENDAÇÃO:**

**Para agora:**
✅ Usa `npx expo start --tunnel`

**Para produção:**
✅ Usa `eas update`

---

**EXECUTA AGORA:**

```powershell
eas login
eas update:configure
eas update --branch production --message "Primeira versão"
```

**PEGA O LINK!** 🎉

