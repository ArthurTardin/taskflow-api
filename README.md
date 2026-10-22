# TaskFlow

API REST e aplicação web para gerenciamento de tarefas diárias de funcionários.

O projeto foi desenvolvido utilizando **Node.js, Express, MariaDB, HTML, CSS e JavaScript**, seguindo uma arquitetura separando o back-end da interface front-end.

## Tecnologias

### Back-end

- Node.js
- Express
- MariaDB
- JavaScript
- ES Modules
- REST API
- CORS
- Nodemon

### Front-end

- HTML5
- CSS3
- JavaScript
- Fetch API
- ES Modules
- Live Server

## Funcionalidades

O TaskFlow permite:

- Cadastrar tarefas;
- Consultar uma tarefa pelo ID;
- Listar tarefas por período;
- Atualizar tarefas;
- Excluir tarefas;
- Alterar o status de uma tarefa entre pendente e concluída;
- Visualizar indicadores de tarefas;
- Filtrar tarefas por período;
- Editar tarefas diretamente pela interface;
- Excluir tarefas pela interface.

## Estrutura do projeto

```text
tarefas-api/
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   └── app.js
│   │
│   └── index.html
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── Routes/
│   └── app.js
│
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Banco de dados

O sistema utiliza **MariaDB**.

O banco de dados deve se chamar:

```sql
tarefas_db
```

A tabela principal é:

```sql
tarefas
```

Com os seguintes campos:

| Campo | Descrição |
|---|---|
| `id` | Identificador único da tarefa |
| `nome` | Nome da tarefa |
| `descricao` | Descrição da tarefa |
| `responsavel` | Funcionário responsável |
| `data_tarefa` | Data da tarefa |
| `concluido` | Indica se a tarefa foi concluída |

## Pré-requisitos

Antes de executar o projeto, instale:

- [Node.js](https://nodejs.org/)
- MariaDB
- Git

Recomenda-se utilizar uma versão atual do Node.js.

## Configuração do banco de dados

Crie o banco de dados no MariaDB:

```sql
CREATE DATABASE tarefas_db;
```

Depois, selecione o banco:

```sql
USE tarefas_db;
```

Crie a tabela:

```sql
CREATE TABLE tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    responsavel VARCHAR(255) NOT NULL,
    data_tarefa DATE NOT NULL,
    concluido BOOLEAN NOT NULL DEFAULT FALSE
);
```

## Configuração das variáveis de ambiente

Na raiz do projeto existe um arquivo:

```text
.env.example
```

Faça uma cópia dele e renomeie para:

```text
.env
```

Configure os dados de acordo com seu ambiente:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=tarefas_db
```

> O arquivo `.env` não deve ser enviado para o GitHub, pois pode conter credenciais do banco de dados.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/tarefas-api.git
```

Entre na pasta:

```bash
cd tarefas-api
```

Instale as dependências:

```bash
npm install
```

## Executando o back-end

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

A API estará disponível em:

```text
http://localhost:3000
```

Caso o projeto esteja configurado para iniciar diretamente com Node.js:

```bash
npm start
```

## Executando o front-end

O front-end está localizado em:

```text
frontend/index.html
```

É recomendado utilizar o **Live Server** no VS Code.

No VS Code:

1. Abra `frontend/index.html`;
2. Clique com o botão direito no arquivo;
3. Selecione **Open with Live Server**.

O endereço normalmente será semelhante a:

```text
http://127.0.0.1:5500/frontend/index.html
```

## API

A API segue o padrão REST.

### Criar tarefa

**POST**

```text
/api/tarefas
```

Exemplo de corpo:

```json
{
    "nome": "Dar aula",
    "descricao": "Preparar e ministrar aula",
    "responsavel": "Luiz Henrique",
    "data_tarefa": "2026-10-28",
    "concluido": false
}
```

### Consultar tarefa por ID

**GET**

```text
/api/tarefas/:id
```

Exemplo:

```text
GET /api/tarefas/1
```

### Listar tarefas por período

**GET**

```text
/api/tarefas/periodo
```

Parâmetros:

```text
dataInicio
dataFim
```

Exemplo:

```text
GET /api/tarefas/periodo?dataInicio=2026-10-01&dataFim=2026-10-31
```

### Atualizar tarefa

**PUT**

```text
/api/tarefas/:id
```

Exemplo:

```text
PUT /api/tarefas/1
```

Corpo:

```json
{
    "nome": "Dar aula",
    "descricao": "Aula atualizada",
    "responsavel": "Luiz Henrique",
    "data_tarefa": "2026-10-28",
    "concluido": true
}
```

### Excluir tarefa

**DELETE**

```text
/api/tarefas/:id
```

Exemplo:

```text
DELETE /api/tarefas/1
```

## Testando a API

A API pode ser testada utilizando ferramentas como:

- Bruno
- Postman
- Insomnia

O front-end também utiliza a mesma API através da `Fetch API`.

## Fluxo da aplicação

O funcionamento básico do sistema é:

```text
┌─────────────────────┐
│      Front-end      │
│                     │
│ HTML + CSS + JS     │
└──────────┬──────────┘
           │
           │ HTTP / REST
           ▼
┌─────────────────────┐
│       Express       │
│                     │
│   Node.js API       │
└──────────┬──────────┘
           │
           │ SQL
           ▼
┌─────────────────────┐
│       MariaDB       │
│                     │
│     tarefas_db      │
└─────────────────────┘
```

## CRUD

O sistema implementa as quatro operações principais do CRUD:

| Operação | Método HTTP | Endpoint |
|---|---|---|
| Create | `POST` | `/api/tarefas` |
| Read | `GET` | `/api/tarefas/:id` |
| Read por período | `GET` | `/api/tarefas/periodo` |
| Update | `PUT` | `/api/tarefas/:id` |
| Delete | `DELETE` | `/api/tarefas/:id` |

## CORS

Como o front-end e o back-end são executados separadamente durante o desenvolvimento, a API possui configuração de **CORS** permitindo a comunicação entre o Live Server e o servidor Express.

Origens utilizadas no desenvolvimento:

```text
http://127.0.0.1:5500
http://localhost:5500
```

## Status do projeto

**Em desenvolvimento.**

O CRUD principal da aplicação está implementado, incluindo a integração entre o front-end, a API REST e o banco de dados MariaDB.

## Objetivo

O projeto tem como objetivo desenvolver uma aplicação para registro e gerenciamento das tarefas diárias dos funcionários, permitindo que os desenvolvedores front-end consumam uma API responsável pelo armazenamento e gerenciamento dos dados.

## Licença

Este projeto não possui uma licença open source definida no momento.