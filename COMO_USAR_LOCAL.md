# 💻 COMO USAR BACKEND LOCAL

## 📋 **TESTAR UPLOADS FUNCIONA 100%:**

O problema é Render Free. **SOLUÇÃO TEMPORÁRIA: usar backend local**

---

## 🚀 **PASSO A PASSO:**

### **1. Descobrir seu IP:**
```powershell
# No PowerShell:
ipconfig
# Procurar "IPv4 Address" - exemplo: 192.168.1.100
```

### **2. Atualizar config.js:**
```javascript
// src/config.js
const API_BASE = 'http://192.168.1.100:8000'; // TEU IP AQUI
export default API_BASE;
```

### **3. Iniciar Backend Local:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### **4. Iniciar Expo (outro terminal):**
```bash
npx expo start
```

### **5. Conectar Telemóvel:**
- Mesma rede Wi-Fi que PC
- Escanear QR code
- App conecta em backend local

---

## ✅ **RESULTADO:**

- ✅ Uploads funcionam
- ✅ Arquivos persistem
- ✅ Banco SQLite local
- ✅ Testa tudo 100%

---

## ⚠️ **LIMITAÇÃO:**

Backend só funciona quando PC está ligado e na mesma rede.

**Para produção: usar Cloudinary ou Render Paid**

