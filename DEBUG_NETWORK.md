# 🔍 DEBUG NETWORK ERROR

## **PROBLEMA:**
Network Error ao fazer upload do telemóvel

## **VERIFICAR:**

### 1. Firewall Windows:
```powershell
# Permitir Python nas regras do Windows Firewall
```

### 2. Telemóvel e PC na mesma rede WiFi?
Sim / Não

### 3. Consegues fazer Guest Login?
Sim / Não

### 4. Consegues ver lista de músicas/vídeos?
Sim / Não

### 5. Só upload dá erro?
Sim / Não

---

## **SOLUÇÃO RÁPIDA:**

### **Desativar Firewall temporariamente para teste:**
```powershell
# PowerShell como Administrador
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
```

**TESTA AGORA!** Se funcionar, é o firewall.

**Reativar depois:**
```powershell
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

---

## **OU adicionar regra específica:**
```powershell
# PowerShell como Administrador
New-NetFirewallRule -DisplayName "Python Backend" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
```

---

**TESTA ISSO E DIZ-ME O RESULTADO!** 🔧

