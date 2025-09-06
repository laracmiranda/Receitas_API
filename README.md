# 🍜 Receitas API 

API RESTful desenvolvida para gerenciar receitas, comentários e favoritos de usuários.  
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
- Autenticação de usuários com `JWT`
- Senhas criptografadas com `bcryptjs`
- Proteção de rotas com Bearer Token
- Redefinição de senha com token + email com `nodemailer`
- Usuários podem adicionar comentários nas receitas
- Usuários podem favoritas as receitas que mais gostaram
- Upload de imagens com `Cloudinary`

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

# ↪️ Rotas

## 👤 Usuários

### Admin/Público

| Método | Rota   | Autenticação | Descrição                        |
|--------|--------|--------------|----------------------------------|
| GET    | /users | Pública      | Lista todos os usuários          |
| GET    | /users/:id | Pública  | Busca usuário por ID             |
| POST   | /users | Pública      | Cria um novo usuário            |


### Usuário Autenticado

| Método | Rota   | Autenticação | Descrição                        |
|--------|--------|--------------|----------------------------------|
| GET    | /users/me | JWT Bearer | Retorna os dados do usuário logado |
| PUT    | /users/me | JWT Bearer | Atualiza os dados do usuário logado |
| DELETE | /users/me | JWT Bearer | Deleta a conta do usuário logado   |


### Segurança / Conta

| Método | Rota                    | Autenticação | Descrição                    |
|--------|-------------------------|--------------|------------------------------|
| PUT    | /users/me/change-password | JWT Bearer | Altera a senha do usuário logado |


### Recursos do Usuário

| Método | Rota                 | Autenticação | Descrição                          |
|--------|--------------------|--------------|------------------------------------|
| GET    | /users/me/recipes   | JWT Bearer   | Lista todas as receitas do usuário |
| GET    | /users/me/favorites | JWT Bearer   | Lista todos os favoritos do usuário |


### 📌 Observações
- **Autenticação JWT**: Todas as rotas com `JWT Bearer` exigem o token no header `Authorization: Bearer <token>`.  
- **Públicas**: Rotas de criação e consulta básica não precisam de autenticação.

---

## 🔐 Autenticação

### Login

| Método | Rota       | Autenticação | Descrição                     |
|--------|------------|--------------|-------------------------------|
| POST   | /login     | Pública      | Gera token JWT para o usuário |

### Redefinição de Senha

| Método | Rota                        | Autenticação | Descrição                                           |
|--------|----------------------------|--------------|---------------------------------------------------|
| POST   | /request-reset             | Pública      | Solicita link/token de redefinição de senha via e-mail |
| POST   | /reset-password/:token     | Pública      | Redefine a senha usando o token enviado por e-mail      |


### 📌 Observações
- Todas as rotas de autenticação são **públicas**, pois o usuário ainda não possui token.  
- A rota `/reset-password/:token` exige que o token enviado por e-mail seja válido.  
- Ao fazer login, o usuário recebe um **JWT** que será usado para acessar as rotas protegidas do sistema.

---

## 🥪 Receitas

### Manipulação de Receitas

| Método | Rota          | Autenticação | Descrição                             |
|--------|---------------|--------------|---------------------------------------|
| GET    | /recipes      | Pública      | Lista todas as receitas               |
| GET    | /recipes/:id  | Pública      | Busca uma receita pelo ID             |
| POST   | /recipes      | JWT Bearer   | Cria uma nova receita (com upload de imagem) |
| PUT    | /recipes/:id  | JWT Bearer   | Atualiza uma receita existente (com upload de imagem) |
| DELETE | /recipes/:id  | JWT Bearer   | Deleta uma receita existente          |

### Comentários

| Método | Rota                        | Autenticação | Descrição                               |
|--------|-----------------------------|--------------|----------------------------------------|
| GET    | /recipes/:recipeId/comments | Pública      | Lista todos os comentários de uma receita |
| POST   | /recipes/:recipeId/comments | JWT Bearer   | Adiciona um comentário à receita       |
| DELETE | /recipes/:recipeId/comments/:id | JWT Bearer | Remove um comentário da receita        |

### Favoritos

| Método | Rota                        | Autenticação | Descrição                               |
|--------|-----------------------------|--------------|----------------------------------------|
| POST   | /recipes/:recipeId/favorite | JWT Bearer   | Adiciona a receita aos favoritos do usuário |
| DELETE | /recipes/:recipeId/favorite | JWT Bearer   | Remove a receita dos favoritos do usuário |


### 📌 Observações
- **Rotas públicas**: qualquer pessoa pode visualizar receitas e comentários sem autenticação.  
- **Rotas protegidas (JWT Bearer)**: criação, edição e exclusão de receitas, comentários e favoritos exigem token JWT válido.  
- **Upload de imagens**: nas rotas de criação e atualização de receitas, o arquivo de imagem deve ser enviado no campo `image`.

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

## 👁️‍🗨️ Testando a API

Sugestão de fluxo no Insomnia ou Postman:

1. Criar usuário → POST `/users`
```json
{
	"name": "Teste",
	"email": "teste@gmail.com",
	"password": "12345678"
}
```

2. Fazer login → POST `/login`
```json
{
	"email": "lucas@gmail.com",
	"password": "12345678"
}
```

3. Criar receita → POST `/recipes` (autenticado)
- Selecionar `Form Data` para incluir os dados com envio de imagem.
**Exemplo de dados:**
```
name: Bolo de Chocolate
category: Sobremesa
ingredients: 2 ovos, 400g de farinha, 300g de nescau
steps: Misture tudo, unte uma forma e coloque para assar por 40 minutos
image: (upload de imagem)
```

4. Adicionar comentário → POST `/recipes/:recipeId/comments` (autenticado)
```json
{
	"content": "Gostei da receita"
}
```

5. Favoritar receita → POST `/recipes/:recipeId/favorite` (autenticado)
- Passar o id da receita no endpoint

---

## 🤝 Contribuição
1. Faça um fork deste repositório  
2. Crie uma branch com sua feature (`git checkout -b feature/nome-da-feature`)  
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)  
4. Push para a branch (`git push origin feature/nome-da-feature`)  
5. Abra um Pull Request explicando o que altera e por quê

---

## 🔴 Em andamento
- ~Redefinição de senha para usuários com token via e-mail~ ✅
- Deploy
- Documentação

## 📃 Licença

Este projeto está licenciado sob a licença **MIT** 
