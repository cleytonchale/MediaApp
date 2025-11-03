# 🔗 Como Obter Link Expo Go

## 🎯 **MÉTODO MAIS FÁCIL:**

### **Sem precisar de conta:**

```powershell
cd C:\Users\HP\MediaApp
npx expo start --tunnel
```

**No terminal:**
1. Aguarda QR code aparecer
2. **Pressiona 's'** ← Cria link web
3. Browser abre com link partilhável
4. **COPIA O LINK!** 📋

---

## 🌐 **MÉTODO COM CONTA EXPO:**

### **PASSO 1: Criar Conta Expo**

1. **Ir para:** https://expo.dev/signup
2. **Criar conta:** Email + Senha
3. **Confirmar email**

---

### **PASSO 2: Login**

```powershell
npx eas-cli login
```

**Escolher:**
- "Log in with Email"
- Digitar email e senha

---

### **PASSO 3: Configurar**

```powershell
cd C:\Users\HP\MediaApp
npx eas-cli update:configure
```

**Escolher:**
- Branch: `production`
- Update strategy: `classic`

---

### **PASSO 4: Publicar**

```powershell
npx eas-cli update --branch production --message "Primeira versão"
```

**Link aparece:**
```
Published update!
Link: https://expo.dev/preview/update?message=...
```

**COPIA ESSE LINK!** 📋

---

## 🔄 **ATUALIZAR DEPOIS:**

```powershell
# Fazer alterações
git add .
git commit -m "Updates"
git push

# Publicar novo update
npx eas-cli update --branch production --message "Novas features"
```

---

## ✅ **RESUMO:**

| Método | Link Permanente | Conta Necessária |
|--------|-----------------|------------------|
| **`expo start --tunnel`** | ❌ Temporário | ❌ Não |
| **EAS Update** | ✅ Sim | ✅ Sim |

---

## 🚀 **PARA TI AGORA:**

**Opção 1 - Rápida:**
```powershell
npx expo start --tunnel
```
**Pressiona 's' para link web!**

**Opção 2 - Permanente:**
1. Criar conta em https://expo.dev/signup
2. `npx eas-cli login`
3. `npx eas-cli update:configure`
4. `npx eas-cli update --branch production --message "v1"`

---

**QUAL MÉTODO QUERES USAR?** 🤔

