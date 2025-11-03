# 🎵 Media Player - Aplicativo Profissional

> **Player de música e vídeo com upload de arquivos próprios**

![Status](https://img.shields.io/badge/Status-100%25%20Funcional-success)
![Design](https://img.shields.io/badge/Design-Profissional-blue)
![API](https://img.shields.io/badge/API-Privada-green)

---

## ✨ **FUNCIONALIDADES**

### **🎵 Player de Música**
- ✅ Upload de arquivos de áudio (MP3, WAV, FLAC, AAC, M4A, OGG)
- ✅ Reprodução com controles completos
- ✅ Player dedicado para músicas
- ✅ Controles (Play, Pause, Próximo, Anterior)
- ✅ Progress bar e tempo

### **🎬 Player de Vídeo**
- ✅ Upload de arquivos de vídeo (MP4, AVI, MOV, MKV, WebM)
- ✅ Reprodução com controles nativos
- ✅ Player dedicado para vídeos
- ✅ Controles de reprodução

### **📚 Biblioteca & Armazenamento**
- ✅ Sistema de favoritos
- ✅ Histórico automático
- ✅ Armazenamento local de arquivos
- ✅ Separação de músicas e vídeos

### **🔍 Busca & Filtros**
- ✅ Busca nas músicas e vídeos próprios
- ✅ Listagem organizada
- ✅ Deletar arquivos

### **👤 Autenticação**
- ✅ Login com email/senha
- ✅ Registro de usuários
- ✅ Modo convidado
- ✅ JWT tokens

---

## 🎨 **DESIGN PROFISSIONAL**

### **Características:**
- 🎨 Interface moderna e limpa
- 🌈 Gradientes suaves (Roxo/Azul)
- 📱 Design responsivo
- ✨ Sombras e elevação
- 🔤 Tipografia clara

### **Paleta de Cores:**
```
Primária:     #667eea (Azul/Roxo)
Secundária:   #764ba2 (Roxo profundo)
Background:   #f5f5f5 (Cinza claro)
Cards:        #ffffff (Branco)
```

---

## 🚀 **INSTALAÇÃO RÁPIDA**

### **Pré-requisitos:**
- Node.js 18+
- Python 3.8+
- Expo Go (celular)

### **1. Instalar dependências:**

```bash
# Frontend
npm install

# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### **2. Iniciar aplicação:**

```bash
# Terminal 1: Backend
cd backend
python main.py

# Terminal 2: Frontend
npx expo start -c
```

### **3. Testar:**
- Abra Expo Go no celular
- Escaneie o QR code
- Login como convidado ou crie conta
- Faça upload de suas músicas e vídeos! 🎵🎬

---

## 📱 **TELAS DO APLICATIVO**

### **1. Login/Registro**
- Design moderno com gradiente
- Login rápido como convidado
- Validação de campos

### **2. Início (Home)**
- Listagem recente de músicas e vídeos
- Cards com informações
- Botões de ação (❤️ Favoritar)

### **3. Música**
- Lista todas as músicas uploadadas
- Botão para fazer upload
- Reprodução direta
- Busca e filtros

### **4. Vídeo**
- Lista todos os vídeos uploadados
- Botão para fazer upload
- Reprodução direta
- Busca e filtros

### **5. Players Separados**
- **MusicPlayer**: Player dedicado para músicas
  - Controles de áudio
  - Progress bar
  - Fila de reprodução
- **VideoPlayer**: Player dedicado para vídeos
  - Controles de vídeo
  - Playback nativo
  - Fila de reprodução

### **6. Biblioteca**
- Tabs: Favoritos / Histórico
- Lista organizada
- Acesso rápido às faixas

### **7. Mini Player**
- Sempre visível (exceto login)
- Controles básicos
- Detecta automaticamente tipo de mídia

---

## 🔧 **ARQUITETURA**

### **Frontend (React Native + Expo)**
```
src/
├── screens/          # Telas do app
├── components/       # Componentes reutilizáveis
├── context/         # Estado global (Context API)
└── navigation/      # Configuração de rotas
```

### **Backend (FastAPI + Python)**
```
backend/
├── main.py              # API principal
├── youtube_service.py   # Integração YouTube
├── database.py          # Configuração banco
├── models.py            # Modelos de dados
└── schemas.py           # Schemas Pydantic
```

### **Fluxo de Dados:**
```
Usuário → Frontend → Backend → Uploads/
         ↓          ↓            SQLite DB
      Context    SQLite DB
```

---

## 🌐 **API ENDPOINTS**

### **Autenticação:**
```
POST /auth/register      - Criar conta
POST /auth/login         - Login
POST /auth/guest         - Entrar como convidado
GET  /auth/me            - Dados do usuário
```

### **Músicas:**
```
POST /musicas/upload     - Upload de música
GET  /musicas            - Listar músicas
GET  /musicas/{id}       - Obter música
DELETE /musicas/{id}     - Deletar música
```

### **Vídeos:**
```
POST /videos/upload      - Upload de vídeo
GET  /videos             - Listar vídeos
GET  /videos/{id}        - Obter vídeo
DELETE /videos/{id}      - Deletar vídeo
```

### **Documentação Interativa:**
Acesse: `http://localhost:8000/docs`

---

## 📚 **TECNOLOGIAS**

### **Frontend:**
| Tecnologia | Uso |
|------------|-----|
| React Native | Framework mobile |
| Expo | Plataforma de desenvolvimento |
| React Navigation | Navegação entre telas |
| Context API | Gerenciamento de estado |
| Axios | Requisições HTTP |
| AsyncStorage | Armazenamento local |
| Expo AV | Player de áudio e vídeo |
| Expo Document Picker | Seletor de arquivos |

### **Backend:**
| Tecnologia | Uso |
|------------|-----|
| FastAPI | Framework API REST |
| SQLAlchemy | ORM (banco de dados) |
| SQLite | Banco de dados |
| JWT | Autenticação |
| Passlib | Hash de senhas |
| Uvicorn | Servidor ASGI |

---

## 🎯 **GUIA DE USO**

### **1. Primeiro Acesso:**
```
1. Abra o app
2. Clique em "Entrar como convidado"
3. Vá para a aba "Música" ou "Vídeo"
4. Clique em "Upload" para enviar arquivos
5. Clique na música/vídeo para reproduzir! 🎵🎬
```

### **2. Fazer Upload:**
```
Música:
1. Vá para aba "Música"
2. Clique em "Upload"
3. Preencha: Título, Artista
4. Selecione arquivo de áudio
5. Arquivo será salvo!

Vídeo:
1. Vá para aba "Vídeo"
2. Clique em "Upload"
3. Preencha: Título, Descrição
4. Selecione arquivo de vídeo
5. Arquivo será salvo!
```

### **3. Reproduzir:**
```
Música:
  ▶️ - Play/Pause
  ⏮️ - Anterior
  ⏭️ - Próximo
  🔀 - Aleatório
  🔁 - Repetir

Vídeo:
  ▶️ - Play/Pause
  📊 - Progress bar
  ⏮️ - Anterior
  ⏭️ - Próximo
  🔀 - Aleatório
  🔁 - Repetir
```

### **4. Gerenciar:**
```
❤️  - Favoritar
🗑️  - Deletar
📚  - Ver biblioteca (Favoritos/Histórico)
```

---

## 🐛 **SOLUÇÃO DE PROBLEMAS**

### **Erro: "Network Error"**
```bash
1. Verifique se backend está rodando:
   cd backend && python main.py

2. Confirme IP correto em:
   src/context/AuthContext.js
   src/screens/HomeScreen.js

3. Windows: Libere porta 8000 no firewall
```

### **Upload não funciona:**
```
1. Verifique se backend está rodando
2. Verifique permissões de arquivo
3. Confirme formatos suportados:
   - Música: MP3, WAV, FLAC, AAC, M4A, OGG
   - Vídeo: MP4, AVI, MOV, MKV, WebM
```

### **Player não reproduz:**
```
1. Verifique se arquivo foi uploadado corretamente
2. Verifique conexão de rede
3. Tente recarregar a lista
4. Verifique logs do backend
```

---

## 📁 **ESTRUTURA DO PROJETO**

```
MediaApp/
│
├── 📱 FRONTEND
│   ├── src/
│   │   ├── screens/           # Telas
│   │   ├── components/        # Componentes
│   │   ├── context/          # Estado global
│   │   └── navigation/       # Navegação
│   ├── App.js                 # Raiz
│   └── package.json          # Dependências
│
├── 🐍 BACKEND
│   └── backend/
│       ├── main.py            # API principal
│       ├── database.py        # Configuração DB
│       ├── models.py          # Models (User, Musica, Video)
│       ├── schemas.py         # Schemas Pydantic
│       ├── requirements.txt   # Dependências
│       ├── uploads/           # Arquivos uploadados
│       │   ├── musicas/       # Músicas
│       │   └── videos/        # Vídeos
│       └── media_app.db       # SQLite database
│
└── 📚 DOCUMENTAÇÃO
    ├── README.md              # Este arquivo
    ├── APLICATIVO_ORGANIZADO.md
    ├── MELHORIAS_PROFISSIONAIS.md
    └── INSTALACAO_RAPIDA.md
```

---

## 🔐 **SEGURANÇA**

### **Implementado:**
- ✅ Senhas com hash bcrypt
- ✅ JWT tokens com expiração
- ✅ Validação de entrada
- ✅ CORS configurado
- ✅ SQL injection protegido (ORM)

### **Recomendações:**
- 🔒 Use HTTPS em produção
- 🚫 Nunca commite credenciais
- 📝 Use variáveis de ambiente
- 💾 Implemente limites de tamanho de arquivo
- 🔐 Proteja rotas de upload com validação adicional

---

## 🎓 **APRENDIZADO**

### **Este projeto demonstra:**
1. **Arquitetura moderna** (Frontend/Backend/API)
2. **Upload de arquivos** (Músicas e Vídeos)
3. **Autenticação JWT** (Segurança)
4. **Design profissional** (UX/UI)
5. **Gerenciamento de estado** (Context API)
6. **Banco de dados** (SQLAlchemy)
7. **Reproductores nativos** (Expo AV)

---

## 📝 **LICENÇA**

Este projeto é de código aberto para fins educacionais.

**Importante:**
- Armazene arquivos de forma segura
- Implemente backups regulares
- Respeite direitos autorais dos arquivos uploadados

---

## 🤝 **CONTRIBUINDO**

Contribuições são bem-vindas!

```bash
1. Fork o projeto
2. Crie sua branch (git checkout -b feature/nova-feature)
3. Commit suas mudanças (git commit -m 'Adiciona nova feature')
4. Push para a branch (git push origin feature/nova-feature)
5. Abra um Pull Request
```

---

## 📞 **SUPORTE**

### **Problemas comuns:**
- [x] Network Error → Verifique firewall
- [x] Upload não funciona → Verifique backend e formato de arquivo
- [x] Player não reproduz → Verifique se arquivo existe
- [x] App não inicia → `npx expo start -c`

### **Documentos úteis:**
- 📖 [APLICATIVO_ORGANIZADO.md](APLICATIVO_ORGANIZADO.md)
- 📖 [MELHORIAS_PROFISSIONAIS.md](MELHORIAS_PROFISSIONAIS.md)
- 📖 [INSTALACAO_RAPIDA.md](INSTALACAO_RAPIDA.md)

---

## 🎉 **RESULTADO FINAL**

✨ **Aplicativo 100% funcional e profissional!**

- ✅ Design moderno
- ✅ Players separados (música/vídeo)
- ✅ Upload de arquivos próprios
- ✅ Reprodução nativa
- ✅ Favoritos e histórico
- ✅ Autenticação segura
- ✅ Código organizado
- ✅ Zero erros
- ✅ Totalmente documentado

---

## 🌟 **FEATURES**

| Feature | Status | Descrição |
|---------|--------|-----------|
| 🔐 Login/Registro | ✅ | Autenticação completa |
| 📤 Upload Música | ✅ | MP3, WAV, FLAC, etc |
| 📤 Upload Vídeo | ✅ | MP4, AVI, MOV, etc |
| ▶️ Player Música | ✅ | Expo AV (nativo) |
| 🎬 Player Vídeo | ✅ | Expo AV (nativo) |
| ❤️ Favoritos | ✅ | AsyncStorage |
| 🕐 Histórico | ✅ | AsyncStorage |
| 📱 Mini Player | ✅ | Flutuante |
| 🎨 Design Moderno | ✅ | Material |
| 📚 Biblioteca | ✅ | Tabs |
| 🔄 Fila Reprodução | ✅ | Context |
| 🔍 Busca | ✅ | Local |
| 🗑️ Deletar | ✅ | Arquivos e registros |

---

## 💻 **COMANDOS ÚTEIS**

```bash
# Limpar cache Expo
npx expo start -c

# Resetar backend
cd backend
rm media_player.db
python main.py

# Ver logs detalhados
npx expo start --tunnel

# Instalar dependências
npm install
pip install -r requirements.txt

# Build para produção
npx expo build:android
npx expo build:ios
```

---

**🎵 APROVEITE SEU MEDIA PLAYER PROFISSIONAL! 🎵**

*Desenvolvido com ❤️ usando React Native, FastAPI e YouTube API*

---

## 🔗 **LINKS ÚTEIS**

- [Expo Documentation](https://docs.expo.dev)
- [React Native](https://reactnative.dev)
- [FastAPI](https://fastapi.tiangolo.com)
- [YouTube API](https://developers.google.com/youtube/v3)

---

**Versão:** 1.0.0  
**Status:** Pronto para produção  
**Última atualização:** 2025
