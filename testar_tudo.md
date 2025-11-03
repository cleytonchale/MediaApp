# 🧪 TESTAR TUDO AGORA

## PASSO A PASSO:

### 1. Verificar backend está rodando:
```powershell
Invoke-WebRequest -Uri http://localhost:8000 -UseBasicParsing
```

### 2. Testar guest:
```powershell
Invoke-WebRequest -Uri http://localhost:8000/auth/guest -Method POST -UseBasicParsing
```

### 3. No telemóvel:
1. Fecha completamente a app (remove do histórico)
2. Abre novamente a app
3. Tenta "Continuar como convidado"
4. Diz-me o que acontece

### 4. Se guest funcionar, testa upload de música:
1. Vai para aba Música
2. Upload de uma música PEQUENA (< 10MB)
3. Diz-me o erro exato se der erro

