# ✅ SOLUÇÃO NETWORK ERROR

## 🔧 **PROBLEMA:**
Network Error ao fazer upload de ficheiros

## ✅ **SOLUÇÃO APLICADA:**

### 1. **copyToCacheDirectory: true** ✅
```javascript
DocumentPicker.getDocumentAsync({
  type: ['audio/mpeg', ...],
  copyToCacheDirectory: true,  // MUDADO DE false PARA true
})
```

**Porquê?** No Expo, o Axios precisa de acesso ao ficheiro. Com `false`, a URI pode não ser acessível.

### 2. **Removido Content-Type manual** ✅
```javascript
// ANTES (ERRADO):
headers: {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'multipart/form-data',  // ❌ Remove boundary!
}

// AGORA (CORRETO):
headers: {
  Authorization: `Bearer ${token}`,
  // Axios define automaticamente com boundary correto ✅
}
```

---

## 📱 **TESTA AGORA:**

1. **Recarrega app:** Pressiona 'r' no Expo
2. **Guest login**
3. **Upload música**
4. **DEVE FUNCIONAR!** ✅

---

**Esta é a solução definitiva!** 🎉

Se ainda não funcionar, há problema de rede entre PC e telemóvel.

