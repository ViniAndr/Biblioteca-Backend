# Biblioteca API

### Descrição do Repositório

Este repositório contém o backend para uma aplicação de gerenciamento de biblioteca. A aplicação oferece rotas para lidar com clientes, funcionários, administradores, autores, categorias, editoras, livros e empréstimos.

A autenticação é feita com JWT, e o acesso às rotas é controlado com base no papel do usuário.

#### Tipos de Usuários

**Cliente:**  
Pode solicitar empréstimos de livros. O cadastro pode ser feito presencialmente na biblioteca com informações básicas ou online com um cadastro mais detalhado. Clientes cadastrados presencialmente também podem acessar suas contas online.

**Funcionário:**  
Pode adicionar, editar e excluir livros, autores e categorias. Também pode gerenciar empréstimos e monitorar o status dos empréstimos.

**Administrador:**  
Gerencia toda a biblioteca, incluindo a criação e exclusão de funcionários. Tem acesso a todos os dados da biblioteca e controla as operações gerais.

A aplicação é projetada para gerenciar todos os aspectos da biblioteca, desde o cadastro de clientes e funcionários até o controle de livros e empréstimos.

## Tecnologias Utilizadas

[![My Skills](https://skillicons.dev/icons?i=js,nodejs,postgres,postman,prisma,express)](https://skillicons.dev)

### Bibliotecas Utilizadas no Node.js

![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)
![bcrypt](https://img.shields.io/badge/bcrypt-4A5568?style=for-the-badge&logo=npm)
![dotenv](https://img.shields.io/badge/dotenv-2B6CB0?style=for-the-badge&logo=npm)
![express](https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express)
![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-2D3748?style=for-the-badge&logo=json-web-tokens)

## Rotas

### Cliente

| Método | Rota                     | Acesso      | Login Obrigatório | Descrição                                                                                                                            |
| ------ | ------------------------ | ----------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| POST   | `/client/verify`         | Público     | Não               | Verifica se o cliente já existe e adiciona email e senha. Usado para caso o cliente faça o cadastro simples e queira acessar o site. |
| POST   | `/client/create`         | Público     | Não               | Cria um novo cliente com cadastro completo (no site).                                                                                |
| POST   | `/client/create/simple`  | Público     | Não               | Cria um novo cliente com cadastro simples (o cadastro na biblioteca física).                                                         |
| POST   | `/client/login`          | Público     | Não               | Realiza o login do cliente.                                                                                                          |
| PUT    | `/client/update/address` | Cliente     | Sim               | Atualiza o endereço do cliente.                                                                                                      |
| PUT    | `/client/update/profile` | Cliente     | Sim               | Atualiza os dados do perfil do cliente.                                                                                              |
| DELETE | `/client/delete`         | Cliente     | Sim               | Deleta a conta do cliente.                                                                                                           |
| GET    | `/client/all`            | Funcionário | Sim               | Lista todos os clientes.                                                                                                             |
| GET    | `/client/:id`            | Funcionário | Sim               | Obtém os dados de um cliente por ID.                                                                                                 |

### Funcionário

| Método | Rota                   | Acesso      | Login Obrigatório | Descrição                                     |
| ------ | ---------------------- | ----------- | ----------------- | --------------------------------------------- |
| POST   | `/employee/create`     | Admin       | Sim               | Cria um novo funcionário.                     |
| POST   | `/employee/login`      | Público     | Não               | Realiza o login do funcionário.               |
| PUT    | `/employee/update`     | Funcionário | Sim               | Atualiza os dados de registro do funcionário. |
| GET    | `/employee/profile`    | Funcionário | Sim               | Obtém o perfil do funcionário autenticado.    |
| GET    | `/employee/all`        | Admin       | Sim               | Obtém a lista de todos os funcionários.       |
| GET    | `/employee/:id`        | Admin       | Sim               | Obtém os dados de um funcionário por ID.      |
| DELETE | `/employee/delete/:id` | Admin       | Sim               | Deleta um funcionário por ID.                 |

### Admin

| Método | Rota             | Acesso  | Login Obrigatório | Descrição                               |
| ------ | ---------------- | ------- | ----------------- | --------------------------------------- |
| POST   | `/admin/login`   | Público | Não               | Realiza o login do admin.               |
| PUT    | `/admin/update`  | Admin   | Sim               | Atualiza os dados do admin autenticado. |
| GET    | `/admin/profile` | Admin   | Sim               | Retorna o perfil do admin autenticado.  |

- **Nota**: Existe uma rota comentada para a criação de um Admin com email e senha padrão, que deve ser feita pelo desenvolvedor. Recomenda-se que o Admin altere login e senha no primeiro acesso.

### Livro

| Método | Rota               | Acesso      | Login Obrigatório | Descrição                                                |
| ------ | ------------------ | ----------- | ----------------- | -------------------------------------------------------- |
| POST   | `/book/create`     | Funcionário | Sim               | Cria um novo livro.                                      |
| GET    | `/book/all`        | Público     | Não               | Obtém todos os livros com paginação e filtros opcionais. |
| GET    | `/book/:id`        | Público     | Não               | Mostra um livro específico pelo ID.                      |
| PUT    | `/book/update/:id` | Funcionário | Sim               | Atualiza os dados de um livro específico pelo ID.        |
| DELETE | `/book/delete/:id` | Funcionário | Sim               | Deleta um livro específico pelo ID.                      |

#### Observações

- **Rota GET /book/all**: Permite a aplicação de filtros e parâmetros de consulta para personalizar os resultados.

  - **Parâmetros de Consulta**:
    - `page` (opcional): Número da página a ser exibida. O padrão é 1 se não fornecido.
    - `author` (opcional): ID do autor para filtrar livros. Use este parâmetro para listar livros de um autor específico.
    - `category` (opcional): ID da categoria para filtrar livros. Utilize este parâmetro para restringir a lista a uma categoria específica.
    - `publisher` (opcional): ID da editora para filtrar livros. Filtra os livros com base na editora especificada.

- **Exemplos de Requisição**:
  - **Sem filtros**: Obtém a primeira página de livros. `GET /book/all?page=1`
  - **Com filtro por autor e categoria**: Obtém livros da página 2 filtrados por um autor específico e uma categoria. `GET /book/all?page=2&author=1&category=3`
  - **Com filtro por editora**: Obtém livros da página 1 filtrados por uma editora específica. `GET /book/all?page=1&publisher=5`
  - **Com múltiplos filtros**: Obtém livros da página 3 filtrados por autor, categoria e editora. `GET /book/all?page=3&author=2&category=4&publisher=6`

### Autor

| Método | Rota                 | Acesso      | Login Obrigatório | Descrição                             |
| ------ | -------------------- | ----------- | ----------------- | ------------------------------------- |
| POST   | `/author/create`     | Funcionário | Sim               | Cria um novo autor.                   |
| GET    | `/author/all`        | Público     | Não               | Obtem todos os autores.               |
| PUT    | `/author/update/:id` | Funcionário | Sim               | Atualiza um autor específico pelo ID. |
| DELETE | `/author/delete/:id` | Funcionário | Sim               | Deleta um autor específico pelo ID.   |

### Categoria

| Método | Rota                   | Acesso      | Login Obrigatório | Descrição                                  |
| ------ | ---------------------- | ----------- | ----------------- | ------------------------------------------ |
| POST   | `/category/create`     | Funcionário | Sim               | Cria uma nova categoria.                   |
| GET    | `/category/all`        | Funcionário | Sim               | Obtem todas as categorias.                 |
| PUT    | `/category/update/:id` | Funcionário | Sim               | Atualiza uma categoria específica pelo ID. |
| DELETE | `/category/delete/:id` | Funcionário | Sim               | Deleta uma categoria específica pelo ID.   |

### Editora

| Método | Rota                    | Acesso      | Login Obrigatório | Descrição                                |
| ------ | ----------------------- | ----------- | ----------------- | ---------------------------------------- |
| POST   | `/publisher/create`     | Funcionário | Sim               | Cria uma nova editora.                   |
| GET    | `/publisher/all`        | Funcionário | Sim               | Obtem todas as editoras.                 |
| PUT    | `/publisher/update/:id` | Funcionário | Sim               | Atualiza uma editora específica pelo ID. |
| DELETE | `/publisher/delete/:id` | Funcionário | Sim               | Deleta uma editora específica pelo ID.   |

### Emprestimo

| Método | Rota               | Acesso              | Login Obrigatório | Descrição                                                                  |
| ------ | ------------------ | ------------------- | ----------------- | -------------------------------------------------------------------------- |
| POST   | `loan/create`      | Cliente/Funcionário | Sim               | Cria um novo empréstimo.                                                   |
| PUT    | `loan/:id/confirm` | Funcionário         | Sim               | Confirma a retirada do livro para um empréstimo específico.                |
| GET    | `loan/all`         | Funcionário         | Sim               | Ver todos os empréstimos ou filtrar por cliente/status.                    |
| GET    | `loan/client`      | Cliente             | Sim               | Ver todos os empréstimos do cliente autenticado e pode filtrar por status. |
| PUT    | `loan/:id/cancel`  | Cliente             | Sim               | Cancela um empréstimo específico.                                          |

#### Exemplos de URL

- **Sem filtros**: Obtém todos os empréstimos.  
  `GET /loan/all`
- **Filtro por status**: Lista empréstimos com um status específico, como "pending" (pendente).  
  `GET /loan/all?status=pending`
- **Filtro por cliente**: Obtém empréstimos relacionados a um cliente específico identificado pelo `clientId` (ID do cliente).  
  `GET /loan/all?clientId=123`
- **Filtros combinados**: Lista empréstimos filtrados por status e cliente. Por exemplo, obtém empréstimos pendentes para o cliente com ID 123.  
  `GET /loan/all?status=pending&clientId=123`

## Middlewares

- **authRequired**: Verifica se o usuário está autenticado através do token JWT.
- **controllerAccess**: Controla o acesso às rotas com base no papel do usuário.
