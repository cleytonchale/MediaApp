# 🔐 Resolver Erro 401 GitHub

## **ERRO:**
```
fatal: 401 (Unauthorized)
```

**Causa:** GitHub precisa de autenticação (token)

---

## ✅ **SOLUÇÃO:**

### **OPÇÃO 1: Usar GitHub CLI (MAIS FÁCIL) ⭐**

#### **Passo 1: Instalar GitHub CLI**

1. **Download:**
   - https://cli.github.com
   - Clica "Download for Windows"
   - Instala o `.msi`

2. **Verificar:**
   ```powershell
   gh --version
   ```

#### **Passo 2: Login**

```powershell
gh auth login
```

**Segue as instruções:**
1. "GitHub.com" → Enter
2. "HTTPS" → Enter
3. "Login with a web browser" → Enter
4. Copia código que aparece
5. Pressiona Enter
6. Browser abre → cola código → autorizar

**PRONTO!** ✅

#### **Passo 3: Fazer Push**

```powershell
cd C:\Users\HP\MediaApp
git push -u origin master
```

**DEVE FUNCIONAR!** 🎉

---

### **OPÇÃO 2: Criar Token Manual**

Se não quiseres instalar GitHub CLI:

#### **Passo 1: Criar Token**

1. **GitHub.com:**
   - Cliques em teu perfil (canto superior direito)
   - "Settings"

2. **Developer settings:**
   - Rolar até ao fim
   - "Developer settings"
   - "Personal access tokens"
   - "Tokens (classic)"
   - "Generate new token"
   - "Generate new token (classic)"

3. **Configurar:**
   - **Note:** "MediaApp"
   - **Expiration:** "No expiration" (ou 90 days)
   - **Scopes:** Marcar "repo" ✅
   - Rolar até ao fim
   - "Generate token"

4. **COPIAR TOKEN:**
   - Aparece: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **COPIA AGORA!** 📋 (só aparece uma vez!)
   - Guarda em local seguro

#### **Passo 2: Usar Token**

```powershell
cd C:\Users\HP\MediaApp

git push -u origin master
```

**Quando pedir:**
- **Username:** cleytonchale
- **Password:** COLAR O TOKEN AQUI (ghp_xxxxx)

**DEVE FUNCIONAR!** ✅

---

### **OPÇÃO 3: Usar SSH**

Se tiveres chave SSH configurada:

#### **Passo 1: Remover HTTPS remote**

```powershell
git remote remove origin
```

#### **Passo 2: Adicionar SSH remote**

```powershell
git remote add origin git@github.com:cleytonchale/MediaApp.git
```

#### **Passo 3: Push**

```powershell
git push -u origin master
```

---

## 🎯 **RECOMENDAÇÃO:**

**USA OPÇÃO 1 (GitHub CLI)!** ⭐
- Mais fácil
- Configura tudo automaticamente
- Funciona sempre

---

## ✅ **APÓS RESOLVER 401:**

Depois do push funcionar, continua com Render.com no guia:
`GITHUB_E_RENDER_PASSO_A_PASSO.md`

---

**QUAL OPÇÃO QUERES USAR?** 🤔
1. GitHub CLI (instalar)
2. Token manual (criar)
3. SSH (se já tens configurado)

