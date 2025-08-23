# 🍜 Receitas API 

API desenvolvida para gerenciar receitas, comentários e favoritos de usuários.  
Permite criar, visualizar, atualizar e deletar receitas, adicionar comentários e favoritar receitas.  

</br>

<p align="left"> 
  <img src="https://img.shields.io/badge/Node.js-bc1a3c.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-bc1a3c?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-bc1a3c.svg?style=for-the-badge&logo=Prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-bc1a3c.svg?style=for-the-badge&logo=PostgreSQL&logoColor=white" />
  <img src="https://img.shields.io/badge/Neon-bc1a3c?style=for-the-badge&logo=neon&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-bc1a3c.svg?style=for-the-badge&logo=Cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-bc1a3c?style=for-the-badge&logo=jsonwebtoken&logoColor=white" />
  <img src="https://img.shields.io/badge/bcryptjs-bc1a3c?style=for-the-badge&logo=bcryptjs&logoColor=white" />
</p>

---

## 📲 Funcionalidades

- CRUD de usuários e receitas
- Autenticação de usuários com JWT
- Proteção de rotas com Bearer Token
- Usuários podem adicionar comentários nas receitas
- Usuários podem favoritas as receitas que mais gostaram
- Upload de imagens com cloudinary

---

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/laracmiranda/Receitas_API.git
````

2. Entre na pasta do projeto:

```bash
cd Receitas_API
```

3. Instale as dependências:

```bash
npm install
```

4. Configure as variáveis de ambiente no arquivo `.env`:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
SECRET_JWT=SuaChaveSecreta
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
PORT=sua_porta
```

5. Rode as migrations do Prisma:

```bash
npx prisma migrate dev
```

6. Inicie a API:

```bash
npm run dev
```

Caso não defina uma rota personalizada, a API estará disponível em `http://localhost:3000`.

---

## ↪️ Rotas

### 👤 Usuários

| Método | Rota         | Descrição                |
| ------ | ------------ | ------------------------ |
| GET    | `/users`     | Listar todos os usuários |
| GET    | `/user/:id`  | Buscar usuário por ID    |
| POST   | `/users`     | Criar usuário            |
| PUT    | `/users/:id` | Atualizar usuário        |
| DELETE | `/users/:id` | Deletar usuário          |

### 🔐 Login

| Método | Rota     | Descrição                            |
| ------ | -------- | ------------------------------------ |
| POST   | `/login` | Autenticar usuário e gerar token JWT |

### 🥪 Receitas

| Método | Rota            | Descrição                                                |
| ------ | --------------- | -------------------------------------------------------- |
| GET    | `/recipes`      | Listar todas as receitas                                 |
| GET    | `/recipe/:id`   | Buscar receita por ID                                    |
| GET    | `/recipes/user` | Listar receitas do usuário logado (autenticado)          |
| POST   | `/recipes`      | Criar receita (autenticado, envio de imagem obrigatório) |
| PUT    | `/recipes/:id`  | Atualizar receita (autenticado)                          |
| DELETE | `/recipes/:id`  | Deletar receita (autenticado)                            |

### 💬 Comentários

| Método | Rota                              | Descrição                                       |
| ------ | --------------------------------- | ----------------------------------------------- |
| GET    | `/recipes/:recipeId/comments`     | Listar comentários de uma receita               |
| POST   | `/recipes/:recipeId/comments`     | Criar comentário (autenticado)                  |
| DELETE | `/recipes/:recipeId/comments/:id` | Deletar comentário (autenticado, dono apenas)   |

### ❤️ Favoritos

| Método | Rota                          | Descrição                                          |
| ------ | ----------------------------- | -------------------------------------------------- |
| GET    | `/favorites`                  | Listar receitas favoritas do usuário (autenticado) |
| POST   | `/recipes/:recipeId/favorite` | Adicionar receita aos favoritos (autenticado)      |
| DELETE | `/favorites/:id`              | Remover favorito (autenticado, dono apenas)        |

---

## 🛡️ Autenticação

As rotas de criação, atualização e exclusão de receitas, comentários e favoritos exigem **Bearer Token**:

```
Authorization: Bearer SEU_TOKEN
```

O token é obtido através do login.

---

## 📂 Estrutura do Banco de Dados (Prisma)

* **User**: id, name, email, password, recipes\[], favorites\[], comments\[]
* **Recipe**: id, name, category, ingredients\[], steps, image, userId, favorites\[], comments\[]
* **Favorite**: id, userId, recipeId, creationDate
* **Comment**: id, content, userId, recipeId, creationDate

---

## Observações

* O upload de imagens das receitas é feito via **Cloudinary**.
* Senhas de usuários são armazenadas **criptografadas** com bcryptjs.
* Tokens JWT expiram em 1 hora.
* Não é permitido favoritar a mesma receita mais de uma vez.

---

## 👁️‍🗨️ Testando a API

Sugestão de fluxo no Insomnia ou Postman:

1. Criar usuário → POST `/users`
2. Fazer login → POST `/login`
3. Criar receita → POST `/recipes` (autenticado)
4. Adicionar comentário → POST `/recipes/:recipeId/comments` (autenticado)
5. Favoritar receita → POST `/recipes/:recipeId/favorite` (autenticado)
6. Listar favoritos → GET `/favorites` (autenticado)
7. Deletar favorito → DELETE `/favorites/:id` (autenticado)

---

## 🔴 Em andamento

- Redefinição de senha para usuários com token via e-mail
- Deploy
- Documentação