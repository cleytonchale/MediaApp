# 🚀 PASSO A PASSO COMPLETO - Configurar Tudo do Zero

## 🎯 **OBJETIVO:**
Fazer a app funcionar completamente com SQLite, uploads, e todas as funcionalidades!

---

## 📋 **PASSO 1: LIMPAR E PREPARAR**

### **1.1 - Para TODOS os processos Python e Node:**

```powershell
# Parar todos os processos
Get-Process | Where-Object {$_.ProcessName -match "python|node"} | Stop-Process -Force
```

### **1.2 - Verificar estrutura de pastas:**

```powershell
cd C:\Users\HP\MediaApp

# Ver estrutura
tree /F /A
```

---

## 🔧 **PASSO 2: CONFIGURAR BACKEND (SQLite)**

### **2.1 - Limpar banco antigo (se existir):**

```powershell
cd C:\Users\HP\MediaApp\backend

# Deletar banco antigo
Remove-Item -Force media_app.db -ErrorAction SilentlyContinue

# Limpar cache Python
Remove-Item -Recurse -Force __pycache__ -ErrorAction SilentlyContinue
```

### **2.2 - Verificar se venv existe:**

```powershell
# Verifica se venv existe
Test-Path venv

# Se retornar False, criar venv:
python -m venv venv
```

### **2.3 - Ativar venv e instalar dependências:**

```powershell
# Ativar venv
.\venv\Scripts\Activate.ps1

# Ver se está ativado (deve mostrar "(venv)" antes do PS)
```

### **2.4 - Instalar dependências:**

```powershell
# Instalar tudo
pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose[cryptography] pyjwt python-multipart python-dotenv email-validator

# OU instalar do requirements.txt
pip install -r requirements.txt
```

### **2.5 - Verificar ficheiro main.py:**

```powershell
# Ver se o ficheiro existe
Test-Path main.py

# Ver primeiras linhas
Get-Content main.py -TotalCount 50
```

### **2.6 - Iniciar backend:**

```powershell
# Certifica-te que estás na pasta backend
cd C:\Users\HP\MediaApp\backend

# Ativar venv (se não estiver ativado)
.\venv\Scripts\Activate.ps1

# Iniciar servidor
python main.py
```

**O QUE DEVES VER:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

✅ **DEIXA ESTA JANELA ABERTA!**

### **2.7 - Verificar se funcionou:**

```powershell
# Abre outra janela do PowerShell e testa:
Invoke-WebRequest -Uri http://localhost:8000 -UseBasicParsing

# Deve retornar:
# {"message":"Media Player API","status":"online","version":"2.0.0"}
```

### **2.8 - Verificar banco SQLite foi criado:**

```powershell
cd C:\Users\HP\MediaApp\backend

# Ver se ficheiro foi criado
Get-ChildItem *.db

# Deve mostrar: media_app.db
```

---

## 📱 **PASSO 3: CONFIGURAR FRONTEND**

### **3.1 - Abrir NOVA janela PowerShell:**

**ABRE UMA JANELA COMPLETAMENTE NOVA!**

### **3.2 - Ir para pasta raiz:**

```powershell
cd C:\Users\HP\MediaApp

# Verificar que estás no lugar certo
Get-Location
# Deve mostrar: C:\Users\HP\MediaApp
```

### **3.3 - Limpar cache Expo:**

```powershell
# Limpar cache
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
```

### **3.4 - Verificar node_modules:**

```powershell
# Ver se existe
Test-Path node_modules

# Se não existir ou houver problemas:
npm install
```

### **3.5 - Verificar IP nos ficheiros:**

```powershell
# Ver teu IP
ipconfig | Select-String -Pattern "Wireless.*WiFi" -Context 0,2

# Anota o IPv4 Address (ex: 192.168.16.102)
```

### **3.6 - Atualizar IP nos ficheiros (se necessário):**

```powershell
# Ver IP atual nos ficheiros
Select-String -Path "src\context\AuthContext.js" -Pattern "API_BASE.*="
Select-String -Path "src\screens\*.js" -Pattern "API_BASE.*="

# Se o IP for diferente do teu IP atual, substitui manualmente nos ficheiros
```

### **3.7 - Iniciar Expo:**

```powershell
# Certifica-te que estás na pasta RAIZ
cd C:\Users\HP\MediaApp

# Iniciar Expo
npx expo start -c
```

**O QUE DEVES VER:**
```
› Metro waiting on exp://...
› Scan the QR code above with Expo Go
```

✅ **DEIXA ESTA JANELA TAMBÉM ABERTA!**

---

## 📲 **PASSO 4: TESTAR NO TELEMÓVEL**

### **4.1 - Conectar:**

1. Abre **Expo Go** no telemóvel
2. Escaneia o **QR code** do Terminal 2
3. Aguarda carregar

### **4.2 - Testar Login:**

1. Clica em **"Entrar como convidado"**
2. Deve funcionar sem erros

### **4.3 - Verificar erros:**

- Se aparecerem erros 404, volta ao **PASSO 2** e verifica backend
- Se aparecerem erros de rede, verifica o IP

---

## ✅ **PASSO 5: TESTAR FUNCIONALIDADES**

### **5.1 - Testar Upload de Música:**

```powershell
# Volta à janela do backend e vê se aparecem logs:
# "✓ Música uploadada: ..."
```

1. Na app: Vai para aba **"Música"**
2. Clica em **"Upload"** (+)
3. Preenche: Título, Artista
4. Seleciona ficheiro de música
5. Clica **"Enviar"**

**VERIFICA:**
- Música aparece na lista?
- Sem erros no backend?

### **5.2 - Testar Reprodução:**

1. Clica numa música
2. Abre **MusicPlayer**
3. Clica play
4. Música toca?

### **5.3 - Testar Upload de Vídeo:**

1. Vai para aba **"Vídeo"**
2. Clica em **"Upload"** (+)
3. Preenche: Título
4. Seleciona ficheiro de vídeo
5. Clica **"Enviar"**

**VERIFICA:**
- Vídeo aparece na lista?
- Sem erros no backend?

### **5.4 - Verificar Arquivos:**

```powershell
cd C:\Users\HP\MediaApp\backend\uploads

# Ver estrutura
tree /F /A

# Deve mostrar:
# uploads\
# ├── musicas\
# │   └── [teus ficheiros]
# └── videos\
#     └── [teus ficheiros]
```

### **5.5 - Verificar Banco SQLite:**

```powershell
cd C:\Users\HP\MediaApp\backend

# Ver tamanho do banco (deve aumentar depois de uploads)
Get-Item media_app.db | Select-Object Name, Length

# Ver conteúdo do banco (opcional)
python -c "import sqlite3; conn = sqlite3.connect('media_app.db'); print(conn.execute('SELECT name FROM sqlite_master WHERE type=\"table\"').fetchall())"
```

---

## 🐛 **SOLUÇÃO DE PROBLEMAS**

### **Erro 404 nas APIs:**

**Causa:** Backend não está rodando ou rotas erradas

**Solução:**
```powershell
# Ver se backend está rodando
netstat -ano | Select-String ":8000"

# Se não estiver, reinicia:
cd C:\Users\HP\MediaApp\backend
.\venv\Scripts\Activate.ps1
python main.py
```

### **Erro "Network Error":**

**Causa:** IP errado ou firewall bloqueando

**Solução:**
```powershell
# Ver IP atual
ipconfig

# Atualizar IP nos ficheiros:
# src/context/AuthContext.js linha 8
# src/screens/HomeScreen.js linha 18
# src/screens/MusicScreen.js linha 21
# src/screens/VideoScreen.js linha 20

# Liberar firewall
New-NetFirewallRule -DisplayName "Allow Backend 8000" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
```

### **Banco SQLite não cria tabelas:**

**Solução:**
```powershell
cd C:\Users\HP\MediaApp\backend

# Deletar banco antigo
Remove-Item -Force media_app.db

# Reiniciar backend (cria novo banco)
python main.py
```

### **Upload falha:**

**Verifica:**
- Backend está rodando?
- Diretório uploads/ existe?
- Formato de arquivo é suportado?
- Permissões estão corretas?

---

## 📊 **VERIFICAÇÃO FINAL**

### **Checklist:**

- [ ] Backend rodando na porta 8000
- [ ] Expo rodando e QR code visível
- [ ] App aberta no telemóvel
- [ ] Login funciona
- [ ] Upload de música funciona
- [ ] Upload de vídeo funciona
- [ ] Reprodução funciona
- [ ] Banco SQLite existe e tem dados
- [ ] Arquivos em uploads/ existem

---

## 🎉 **SUCESSO!**

Se tudo estiver verde ✅:
- ✅ SQLite funcionando
- ✅ Uploads funcionando
- ✅ Reprodução funcionando
- ✅ Todos os menus funcionam!

---

## 🔗 **COMANDOS RESUMIDOS:**

### **Terminal 1 (Backend):**
```powershell
cd C:\Users\HP\MediaApp\backend
.\venv\Scripts\Activate.ps1
python main.py
```

### **Terminal 2 (Frontend):**
```powershell
cd C:\Users\HP\MediaApp
npx expo start -c
```

### **Ver logs do backend:**
- Procura por: "✓ Música uploadada" ou "✓ Vídeo uploadado"
- Procura por: "REGISTRO DE USUÁRIO" ou "LOGIN DE USUÁRIO"

---

**🎵 Agora podes usar a app completamente! 🎬**

