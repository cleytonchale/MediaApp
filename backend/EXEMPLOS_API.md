# 📡 Exemplos de Uso da API

## 🔐 Autenticação

### 1. Registrar Novo Usuário

**Requisição:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "username": "meuusuario",
    "password": "senha123"
  }'
```

**Resposta (201 Created):**
```json
{
  "id": 1,
  "email": "usuario@example.com",
  "username": "meuusuario",
  "created_at": "2025-10-29T12:00:00"
}
```

---

### 2. Fazer Login

**Requisição:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=usuario@example.com&password=senha123"
```

**Resposta (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### 3. Login como Convidado

**Requisição:**
```bash
curl -X POST http://localhost:8000/auth/guest
```

**Resposta (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### 4. Obter Dados do Usuário Atual

**Requisição:**
```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "email": "usuario@example.com",
  "username": "meuusuario",
  "created_at": "2025-10-29T12:00:00"
}
```

---

## 🎬 YouTube

### 5. Buscar Vídeos/Músicas

**Requisição:**
```bash
curl -X GET "http://localhost:8000/youtube/search?query=rock&max_results=10" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta (200 OK):**
```json
{
  "items": [
    {
      "id": {
        "videoId": "dQw4w9WgXcQ"
      },
      "snippet": {
        "title": "Rick Astley - Never Gonna Give You Up",
        "channelTitle": "Rick Astley",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg"
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg"
          },
          "high": {
            "url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
          }
        },
        "publishedAt": "2009-10-25T06:57:33Z"
      }
    }
  ],
  "nextPageToken": "CAUQAA",
  "prevPageToken": null
}
```

---

### 6. Detalhes de um Vídeo

**Requisição:**
```bash
curl -X GET http://localhost:8000/youtube/video/dQw4w9WgXcQ \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta (200 OK):**
```json
{
  "id": "dQw4w9WgXcQ",
  "snippet": {
    "title": "Rick Astley - Never Gonna Give You Up",
    "description": "The official video for "Never Gonna Give You Up"...",
    "channelTitle": "Rick Astley",
    "tags": ["rick astley", "Never Gonna Give You Up", "nggyu"],
    "categoryId": "10"
  },
  "contentDetails": {
    "duration": "PT3M33S",
    "dimension": "2d",
    "definition": "hd"
  },
  "statistics": {
    "viewCount": "1400000000",
    "likeCount": "16000000",
    "commentCount": "2000000"
  }
}
```

---

## 🔗 Exemplos com JavaScript (Axios)

### Login
```javascript
import axios from 'axios';

const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await axios.post(
    'http://localhost:8000/auth/login',
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  const token = response.data.access_token;
  console.log('Token:', token);
  return token;
};
```

### Registro
```javascript
const register = async (email, username, password) => {
  const response = await axios.post(
    'http://localhost:8000/auth/register',
    {
      email,
      username,
      password
    }
  );

  console.log('Usuário criado:', response.data);
  return response.data;
};
```

### Buscar Vídeos
```javascript
const searchVideos = async (query, token) => {
  const response = await axios.get(
    'http://localhost:8000/youtube/search',
    {
      params: {
        query: query,
        max_results: 20
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  console.log('Vídeos encontrados:', response.data.items.length);
  return response.data.items;
};
```

---

## 🐍 Exemplos com Python (requests)

### Login
```python
import requests

def login(email, password):
    url = 'http://localhost:8000/auth/login'
    data = {
        'username': email,
        'password': password
    }
    
    response = requests.post(url, data=data)
    token = response.json()['access_token']
    print(f'Token: {token}')
    return token
```

### Registro
```python
def register(email, username, password):
    url = 'http://localhost:8000/auth/register'
    data = {
        'email': email,
        'username': username,
        'password': password
    }
    
    response = requests.post(url, json=data)
    user = response.json()
    print(f'Usuário criado: {user["username"]}')
    return user
```

### Buscar Vídeos
```python
def search_videos(query, token, max_results=20):
    url = 'http://localhost:8000/youtube/search'
    params = {
        'query': query,
        'max_results': max_results
    }
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    response = requests.get(url, params=params, headers=headers)
    videos = response.json()['items']
    print(f'Encontrados {len(videos)} vídeos')
    return videos
```

---

## ⚠️ Tratamento de Erros

### Erro 400 - Bad Request
```json
{
  "detail": "Email já registrado"
}
```

### Erro 401 - Unauthorized
```json
{
  "detail": "Não foi possível validar as credenciais"
}
```

### Erro 403 - Forbidden
```json
{
  "detail": "Quota da API do YouTube excedida"
}
```

### Erro 404 - Not Found
```json
{
  "detail": "Vídeo não encontrado"
}
```

### Erro 500 - Internal Server Error
```json
{
  "detail": "Erro interno do servidor"
}
```

---

## 🧪 Testar com Postman

### 1. Importar Coleção

Crie uma nova coleção no Postman com estas requisições:

**Collection: Media Player API**

#### Request 1: Register
- Method: POST
- URL: `{{base_url}}/auth/register`
- Body (JSON):
```json
{
  "email": "test@test.com",
  "username": "testuser",
  "password": "test123"
}
```

#### Request 2: Login
- Method: POST
- URL: `{{base_url}}/auth/login`
- Body (x-www-form-urlencoded):
  - username: `test@test.com`
  - password: `test123`

#### Request 3: Search Videos
- Method: GET
- URL: `{{base_url}}/youtube/search?query=music&max_results=10`
- Headers:
  - Authorization: `Bearer {{token}}`

#### Request 4: Get Video Details
- Method: GET
- URL: `{{base_url}}/youtube/video/dQw4w9WgXcQ`
- Headers:
  - Authorization: `Bearer {{token}}`

### 2. Variáveis de Ambiente

```
base_url: http://localhost:8000
token: (será preenchido após login)
```

### 3. Scripts de Teste (Tests tab no Postman)

**Para Login:**
```javascript
// Salvar token automaticamente
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.access_token);
    console.log("Token salvo:", jsonData.access_token);
}
```

---

## 🔄 Fluxo Completo de Uso

### Cenário: Novo usuário busca e reproduz música

```javascript
async function fullFlow() {
  // 1. Registrar
  const user = await register(
    'novo@email.com',
    'novousuario',
    'senha123'
  );
  
  // 2. Login (ou auto-login após registro)
  const token = await login('novo@email.com', 'senha123');
  
  // 3. Buscar músicas
  const videos = await searchVideos('rock nacional', token);
  
  // 4. Selecionar primeiro vídeo
  const videoId = videos[0].id.videoId;
  
  // 5. Obter detalhes
  const details = await getVideoDetails(videoId, token);
  
  console.log('Reproduzindo:', details.snippet.title);
  
  // 6. No app, navegar para PlayerScreen com videoId
  // navigation.navigate('Player', { videoId, title: details.snippet.title });
}
```

---

## 📊 Rate Limits e Quotas

### Por Usuário
```
Login:        Sem limite
Registro:     Sem limite
Busca:        Limitado pela quota do YouTube
Detalhes:     Limitado pela quota do YouTube
```

### YouTube API
```
Quota diária: 10.000 unidades
Busca:        100 unidades cada
Detalhes:     1 unidade cada

Máximo aproximado por dia:
- 100 buscas
- 10.000 detalhes
```

---

## 🔧 Configuração de Cliente HTTP

### Headers Recomendados

```javascript
const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'User-Agent': 'MediaPlayerApp/1.0',
  },
  timeout: 10000, // 10 segundos
};
```

### Interceptors (Axios)

```javascript
// Adicionar token automaticamente
axios.interceptors.request.use(
  config => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Tratamento de erro global
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado, fazer logout
      logout();
    }
    return Promise.reject(error);
  }
);
```

---

## 📝 Notas Importantes

1. **Tokens JWT expiram em 7 dias**
   - Após expirar, fazer login novamente
   
2. **Convidados têm acesso limitado**
   - Podem buscar e assistir
   - Não salvam histórico (futuro)
   
3. **Busca do YouTube é case-insensitive**
   - "Rock" = "rock" = "ROCK"
   
4. **IDs de vídeo do YouTube têm 11 caracteres**
   - Exemplo: `dQw4w9WgXcQ`
   
5. **Thumbnails têm 3 tamanhos**
   - default: 120x90
   - medium: 320x180
   - high: 480x360

---

## 🎯 Boas Práticas

1. **Sempre armazene tokens com segurança**
   ```javascript
   // React Native
   await SecureStore.setItemAsync('token', token);
   
   // Web
   localStorage.setItem('token', token); // Apenas dev
   // Use httpOnly cookies em produção
   ```

2. **Valide entrada do usuário**
   ```javascript
   if (!email || !password) {
     throw new Error('Preencha todos os campos');
   }
   ```

3. **Trate erros apropriadamente**
   ```javascript
   try {
     await login(email, password);
   } catch (error) {
     if (error.response?.status === 401) {
       alert('Email ou senha incorretos');
     } else {
       alert('Erro ao fazer login');
     }
   }
   ```

4. **Implemente retry logic**
   ```javascript
   const maxRetries = 3;
   let retries = 0;
   
   while (retries < maxRetries) {
     try {
       return await searchVideos(query, token);
     } catch (error) {
       retries++;
       if (retries >= maxRetries) throw error;
       await sleep(1000 * retries); // backoff exponencial
     }
   }
   ```

---

**Documentação de API - Versão 1.0**

