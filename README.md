# 🍜 Receitas API 

<p align="left"> 

![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)
![Express](https://img.shields.io/badge/Express-5.1-black.svg)
![PrismaORM](https://img.shields.io/badge/Prisma-6.13-purple.svg)
![PostgreSQL](https://img.shields.io/badge/Banco-PostgreSQL-blue.svg)
![Neon](https://img.shields.io/badge/Banco-Neon-green.svg)
![JWT](https://img.shields.io/badge/JWT-Auth-orange.svg)
![Bcrypt](https://img.shields.io/badge/Bcrypt-3.0.2-red.svg)
![LICENSE](https://img.shields.io/badge/License-MIT-yellow.svg)

API RESTful desenvolvida para gerenciar receitas, comentários e favoritos de usuários.  
Permite criar, visualizar, atualizar e deletar receitas, adicionar comentários e favoritar receitas.  

📌 **Observações**
- Você pode conferir a API diretamente aqui! - [Receitas API](https://receitas-api-6a7p.onrender.com/)
- Documentação completa disponível em [Documentação](https://receitas-api-6a7p.onrender.com/docs/)
- Testes podem ser feitos **diretamente pela documentação**, sem a necessidade rodar localmente!

---

## 📲 Funcionalidades

### 👤 **Usuários**

- Cadastro e login de usuários
- Autenticação `JWT` com expiração
- Senhas criptografadas com `bcryptjs`
- Atualização de perfil
- Perfil do usuário com biografia, quantidade de receitas cadastradas e curtidas 
- Redefinição de senha via e-mail com token com `nodemailer`

### 🥪 **Receitas**

- CRUD completo (GET, POST, PUT, DELETE)
- Upload de imagens com `Cloudinary`
- Exibição das receitas cadastradas para o usuário autenticado
- Paginação para a exibição da lista de receitas
- Exibição formatada para evitar duplicação de dados
- Exibição da quantidade de likes e avaliações da receita

### 💬 **Comentários**

- Usuários autenticados podem adicionar comentários nas receitas
- Comentários podem ser deletados por quem os fez
- Exibição da lista de comentários com paginação por receita

### ❤️ **Favoritos**

- Usuários autenticados podem favoritar receitas
- As receitas favoritadas podem ser removidas quando desejar
- Paginação para a exibição da lista de receitas favoritadas

### ⭐ **Avaliações**
- Usuários autenticados podem deixar avaliações de 1 à 5 nas receitas
- As receitas possuem média de avaliações
- Só pode ser feita uma avaliação por usuário

---

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Neon** (PostgreSQL) - Banco de dados na nuvem
- **JWT** - Autenticação
- **Bcrypt** - Criptografia de senhas
- **Joi** - Validação de dados
- **Nodemailer** - E-mail para redefinição de senha
- **PrismaORM** - Comunicação com Banco de Dados
- **Cloudinary** - Upload de imagens
- **Swagger** - Documentação da API

</br>
Você pode aprender algumas etapas desse projeto nesses repositórios feitos por mim!

👉 [Armazenando imagens em banco relacional](https://github.com/laracmiranda/Estudos_Gerais/tree/main/Armazenamento%20de%20Imagens)
👉 [Redefinir senha com nodemailer](https://github.com/laracmiranda/Estudos_Gerais/tree/main/Redefini%C3%A7%C3%A3o%20de%20Senha%20com%20nodemailer)

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
EMAIL_USER=email_completo_nodemailer
EMAIL_PASS=senha_app_nodemailer
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

## 📂 Estrutura do Banco de Dados (Prisma)

* **User**: id, name, email, password, recipes\[], favorites\[], comments\[]
* **Recipe**: id, name, category, ingredients\[], steps[], difficulty, portion, prepTime, status, image, userId, favorites\[], comments\[]
* **Favorite**: id, userId, recipeId, creationDate
* **Comment**: id, content, userId, recipeId, creationDate
* **Rating**: id, value, userId, recipeId

---

## 📝 Testando a API

Sugestão de fluxo no **Insomnia** ou **Postman**:

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
	"email": "teste@gmail.com",
	"password": "12345678"
}
```

3. Criar receita → POST `/recipes` (autenticado)
- Selecionar `Form Data` para incluir os dados com envio de imagem.
**Exemplo de dados:**
```
name: Bolo de Chocolate
category: Sobremesa
description: "Receita de vó"
prepTime: "1h30"
portions: 5
difficulty: "Iniciante"
status: "Publicada"
ingredients: 2 ovos, 400g de farinha, 300g de nescau
steps: Misture tudo, unte uma forma e coloque para assar por 40 minutos
image: (upload de imagem)
```

4. Adicionar comentário → POST `/comments/:recipeId` (autenticado)
```json
{
	"content": "Gostei da receita"
}
```

5. Favoritar receita → POST `/favorite/:recipeId` (autenticado)
- Passar o id da receita no endpoint

6. Deixar uma avaliação → POST `/rating/:recipeId` (autenticado)
- Passar o id da receita no endpoint

---

## 🤝 Contribuição
1. Faça um fork deste repositório  
2. Crie uma branch com sua feature (`git checkout -b feature/nome-da-feature`)  
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)  
4. Push para a branch (`git push origin feature/nome-da-feature`)  
5. Abra um Pull Request explicando o que altera e por quê

---

## 📃 Licença

Este projeto está licenciado sob a licença **MIT** 
