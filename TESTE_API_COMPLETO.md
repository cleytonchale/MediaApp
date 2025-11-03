# 🧪 TESTE COMPLETO - Testar Tudo

## 🎯 **TESTAR CADA API:**

### **1. Testar Backend está rodando:**
```powershell
Invoke-WebRequest -Uri http://localhost:8000 -UseBasicParsing
```
**Deve retornar:** `{"message":"Media Player API","status":"online"}`

---

### **2. Testar Guest (Convidado):**
```powershell
Invoke-WebRequest -Uri http://localhost:8000/auth/guest -Method POST -UseBasicParsing
```
**Deve retornar:** `{"access_token":"...", "token_type":"bearer"}`

---

### **3. Testar Cadastro de Usuário:**
```powershell
$body = @{
    email = "teste@teste.com"
    username = "teste"
    password = "123456"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:8000/auth/register -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```
**Deve retornar:** `{"id":1,"email":"teste@teste.com","username":"teste","created_at":"..."}`

---

### **4. Testar Login:**
```powershell
$formData = "username=teste@teste.com&password=123456"

Invoke-WebRequest -Uri http://localhost:8000/auth/login -Method POST -Body $formData -ContentType "application/x-www-form-urlencoded" -UseBasicParsing
```
**Deve retornar:** `{"access_token":"...", "token_type":"bearer"}`

---

### **5. Testar Listar Músicas:**
```powershell
$token = "SEU_TOKEN_AQUI"

Invoke-WebRequest -Uri http://localhost:8000/musicas -Headers @{Authorization="Bearer $token"} -UseBasicParsing
```
**Deve retornar:** `{"musicas":[],"total":0}`

---

### **6. Testar Listar Vídeos:**
```powershell
Invoke-WebRequest -Uri http://localhost:8000/videos -Headers @{Authorization="Bearer $token"} -UseBasicParsing
```
**Deve retornar:** `{"videos":[],"total":0}`

---

## 🔍 **SE ALGUM TESTE FALHAR:**

Copia a resposta e mostra-me!

