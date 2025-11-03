# Teste manual de upload
curl -X POST http://192.168.16.102:8000/videos/upload \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "file=@teste.mp4" \
  -F "titulo=Teste"

