# 🐛 DEBUG - Tudo sobre Erros

## **PROBLEMAS CONHECIDOS:**

### 1. Cadastro/Login redireciona para convidado
**Status:** Não é um erro! Funcionando corretamente.

### 2. Upload dá "Network Error"
**Status:** Investigando

---

## 📋 **TESTE AGORA:**

### **Passo 1: Verificar Backend**
Abre janela do backend e mostra-me as **ÚLTIMAS 30 LINHAS** dos logs.

### **Passo 2: Fazer Upload**
1. No telemóvel, tenta fazer upload
2. **O QUE APARECE NO BACKEND?** (copiar última linha)

### **Passo 3: Testar Guest + Upload**
1. Guest funciona? ✅
2. Upload funciona? ❌
3. Erro exato?

---

## 🔍 **POSSÍVEIS CAUSAS:**

1. **Timeout**: Já aumentado para 5 minutos ✅
2. **Formato**: Pode ser problema com FormData
3. **Backend não recebe**: Verificar logs
4. **Auth falha**: Verificar token

---

## 📝 **COPIAR PARA MIM:**

Quando tentares upload, copia:
1. Erro no telemóvel (completo)
2. Logs do backend (últimas 10 linhas)
3. Tamanho do arquivo

**JUNTO ISSO E ME MOSTRA!** 🔍

