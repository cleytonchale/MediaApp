# 🚀 DEPLOY NO RENDER - PASSO A PASSO

## ✅ Alterações Preparadas:

1. ✅ `backend/main.py` - Upload de músicas e vídeos funcionando
2. ✅ `backend/requirements.txt` - psycopg2-binary adicionado para PostgreSQL
3. ✅ `render.yaml` - Configuração do Render criada
4. ✅ `src/config.js` - Configurado para usar Render
5. ✅ `network_security_config.xml` - Configurado para HTTPS

## 📝 COMANDOS PARA FAZER PUSH:

```bash
# 1. Adicionar todos os arquivos importantes
git add backend/main.py
git add backend/requirements.txt
git add render.yaml
git add src/config.js
git add network_security_config.xml
git add src/screens/MusicScreen.js
git add src/screens/VideoScreen.js
git add src/screens/HomeScreen.js
git add src/screens/MusicPlayerScreen.js
git add app.json

# 2. Fazer commit
git commit -m "Deploy: Upload de músicas e vídeos funcionando + Configuração Render"

# 3. Fazer push para o GitHub
git push origin master
```

## ⚙️ CONFIGURAÇÃO NO RENDER:

Depois do push, o Render vai detectar automaticamente o `render.yaml` e fazer o deploy.

**IMPORTANTE:**
- O Render vai usar PostgreSQL (automático)
- O servidor vai iniciar com: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1`
- Certifique-se de que a variável `DATABASE_URL` está configurada no Render (cria automaticamente)

## 🔍 VERIFICAR DEPLOY:

1. Acesse o dashboard do Render: https://dashboard.render.com
2. Vá em "Services" → "mediaapp-backend"
3. Veja os logs do deploy
4. Teste a API: https://mediaapp-backend-9zw7.onrender.com

## ⚠️ OBSERVAÇÕES:

- Uploads de arquivos no Render são temporários (ephemeral filesystem)
- Para produção, considere usar S3 ou outro storage persistente
- O primeiro deploy pode demorar alguns minutos

## 🎯 PRÓXIMOS PASSOS:

Após o deploy:
1. Teste o upload de música
2. Teste o upload de vídeo
3. Teste a reprodução
4. Verifique os logs no Render se houver problemas
