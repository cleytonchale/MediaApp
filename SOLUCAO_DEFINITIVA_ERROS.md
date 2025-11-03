# 🔧 SOLUÇÃO DEFINITIVA - Todos os Erros

## ✅ **STATUS ATUAL:**
- ✅ Backend funcionando: http://localhost:8000
- ✅ SQLite funcionando: 3 tabelas criadas
- ✅ APIs testadas: Tudo OK!
- ✅ Base de código 100% completa

---

## 🎯 **PROBLEMA IDENTIFICADO:**

O problema **NÃO** é no código. É **COMO** inicias o backend!

### **❌ ERRADO:**
```powershell
cd backend
python main.py    # Usa Python GLOBAL (sem dependências!)
```

### **✅ CORRETO:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1    # Ativa venv primeiro!
python main.py
```

OU

```powershell
cd backend
.\start.bat    # Já ativa venv automaticamente
```

---

## 🚀 **SOLUÇÃO PASSO A PASSO:**

### **PASSO 1: Fechar tudo**

```powershell
# Parar todos os processos Python e Node
Get-Process | Where-Object {$_.ProcessName -match "python|node"} | Stop-Process -Force
```

### **PASSO 2: Iniciar Backend CORRETAMENTE**

```powershell
cd C:\Users\HP\MediaApp\backend

# Método 1 (mais fácil):
.\start.bat

# OU Método 2 (manual):
.\venv\Scripts\Activate.ps1
python main.py
```

**VERIFICA que aparece:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### **PASSO 3: Iniciar Expo (outra janela)**

Abre NOVA janela PowerShell:

```powershell
cd C:\Users\HP\MediaApp
npx expo start -c
```

### **PASSO 4: Conectar no telemóvel**

1. Expo Go → Escaneia QR
2. Login como convidado
3. Tudo funciona! ✅

---

## 🐛 **RESOLVER CADA ERRO:**

### **Erro 1: "ModuleNotFoundError: No module named 'sqlalchemy'"**

**Causa:** Python global sem dependências

**Solução:**
```powershell
cd C:\Users\HP\MediaApp\backend
.\venv\Scripts\Activate.ps1    # IMPORTANTE!
python main.py
```

---

### **Erro 2: "404 Not Found" nas APIs**

**Causa:** Backend não está rodando

**Verifica:**
```powershell
netstat -ano | Select-String ":8000"
# Deve mostrar: LISTENING
```

**Solução:**
```powershell
cd C:\Users\HP\MediaApp\backend
.\start.bat
```

---

### **Erro 3: "Network Error"**

**Causa:** IP errado ou firewall

**Verifica IP:**
```powershell
ipconfig | Select-String -Pattern "Wireless|IPv4" -Context 0,1
```

**Atualiza em:**
- src/context/AuthContext.js (linha 8)
- src/screens/HomeScreen.js (linha 18)
- src/screens/MusicScreen.js (linha 21)
- src/screens/VideoScreen.js (linha 20)

---

### **Erro 4: Upload não funciona**

**Verifica:**
1. Backend está rodando? ✅
2. Diretórios existem?
   ```powershell
   Test-Path C:\Users\HP\MediaApp\backend\uploads
   Test-Path C:\Users\HP\MediaApp\backend\uploads\musicas
   Test-Path C:\Users\HP\MediaApp\backend\uploads\videos
   ```
3. Backend cria automaticamente!

---

### **Erro 5: Cadastro dá erro**

**Testa manualmente:**
```powershell
# Cadastrar usuário
$body = @{
    email = "teste@teste.com"
    username = "teste"
    password = "123456"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:8000/auth/register -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

**Se funcionar:** Problema no frontend
**Se não funcionar:** Ver logs do backend

---

## ✅ **TESTE COMPLETO:**

### **Teste 1: Backend**
```powershell
Invoke-WebRequest -Uri http://localhost:8000 -UseBasicParsing
# Deve retornar: {"message":"Media Player API","status":"online"}
```

### **Teste 2: Guest Login**
```powershell
Invoke-WebRequest -Uri http://localhost:8000/auth/guest -Method POST -UseBasicParsing
# Deve retornar: {"access_token":"..."}
```

### **Teste 3: Listar Músicas**
```powershell
$token = (Invoke-WebRequest -Uri http://localhost:8000/auth/guest -Method POST -UseBasicParsing | ConvertFrom-Json).access_token
Invoke-WebRequest -Uri "http://localhost:8000/musicas" -Headers @{Authorization="Bearer $token"} -UseBasicParsing
# Deve retornar: {"musicas":[],"total":0}
```

### **Teste 4: SQLite**
```powershell
cd C:\Users\HP\MediaApp\backend
python ver_banco.py
# Deve mostrar: 3 tabelas (users, musicas, videos)
```

### **Teste 5: Frontend**
1. Expo Go no telemóvel
2. Escaneia QR
3. Login como convidado
4. Vai para Música
5. Clique em Upload
6. Seleciona MP3
7. Envia!

---

## 📋 **CHECKLIST FINAL:**

Antes de testar na app, verifica:

- [ ] Backend rodando com VENV ativado
- [ ] Expo rodando em outra janela
- [ ] IP correto nos 4 ficheiros
- [ ] SQLite tem 3 tabelas
- [ ] Diretórios uploads/ existem
- [ ] Firewall liberado (porta 8000)
- [ ] Telemóvel na mesma rede WiFi

---

## 🎉 **SE TUDO FUNCIONAR:**

Agora sim podes:
1. Fazer cadastro de usuários
2. Fazer upload de músicas
3. Fazer upload de vídeos
4. Reproduzir tudo
5. Ver no SQLite

---

## 🆘 **AINDA COM ERROS?**

Me diz EXATAMENTE:
1. O que fazes (passo a passo)
2. O erro que aparece (copiar/colar)
3. O que aparece nos logs do backend

E eu resolvo! 🔧

