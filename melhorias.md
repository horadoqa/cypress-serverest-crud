# Melhorias

## 1. Estrutura de pastas sugerida

```bash

cypress-serverest-crud/
├── cypress/
│   ├── e2e/
│   │   └── usuarios/
│   │       ├── api.cy.js
│   │       ├── crud.cy.js
│   │       ├── contrato.cy.js
│   │       └── negativos.cy.js
│   ├── fixtures/
│   │   └── usuarios.json
│   └── support/
│       ├── commands.js
│       └── e2e.js
├── src/
│   ├── config/
│   │   └── env.js
│   ├── factories/
│   │   └── usuario.factory.js
│   ├── services/
│   │   └── usuarios.service.js
│   └── schemas/
│       └── usuario.schema.json
├── .github/
│   └── workflows/
│       └── tests.yml
├── .env.example
├── .gitignore
├── cypress.config.js
├── package.json
└── README.md
```

## 2. Equivalentes de Playwright para Cypress

| Recurso no Playwright | Alternativa no Cypress |
| --- | --- |
| `playwright.config.ts` | `cypress.config.js` |
| `request.get()` | `cy.request()` |
| Fixtures do Playwright | `cy.fixture()` e comandos personalizados |
| `@faker-js/faker` | `@faker-js/faker` |
| `allure-playwright` | `allure-cypress` |
| TypeScript interfaces | Objetos JavaScript e validações; JSDoc opcional |
| `playwright test` | `cypress run` |
| Reporter Playwright | Reporter e integração compatíveis com Cypress |
| GitHub Actions | GitHub Actions com Cypress |

## 3. Configuração centralizada

Instale as dependências:

```bash
npm install --save-dev cypress dotenv @faker-js/faker ajv
```

No arquivo `cypress.config.js`:

```javascript

const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.API_URL || 'https://serverest.dev',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
  },
  env: {
    apiUrl: process.env.API_URL || 'https://serverest.dev',
  },
});
```

Crie o arquivo `.env.example`:


```dotenv
API_URL=https://serverest.dev
```

No `.gitignore`, inclua:


```gitignore
.env
node_modules/
cypress/videos/
cypress/screenshots/
allure-results/
allure-report/
```

O `.env.example` pode ser versionado; o `.env` com configurações locais deve ficar fora do Git.

## 4. Gerar usuários com Faker

Instale a biblioteca Faker, caso ainda não tenha feito isso:


```bash
npm install --save-dev @faker-js/faker
```

Crie `src/factories/usuario.factory.js`:


```javascript

const { faker } = require('@faker-js/faker/locale/pt_BR');

function criarUsuario() {
  return {
    nome: faker.person.fullName(),
    email: `qa_${faker.string.uuid()}@qa.com.br`,
    password: 'SenhaQA123',
    administrador: 'true',
  };
}

module.exports = { criarUsuario };
```

O e-mail único reduz conflitos de cadastro duplicado entre execuções.

## 5. Centralizar as chamadas da API

Crie `src/services/usuarios.service.js`:


```javascript

function cadastrarUsuario(usuario) {
  return cy.request({
    method: 'POST',
    url: '/usuarios',
    body: usuario,
    failOnStatusCode: false,
  });
}

function consultarUsuarios() {
  return cy.request('GET', '/usuarios');
}

function consultarUsuarioPorId(id) {
  return cy.request('GET', `/usuarios/${id}`, {
    failOnStatusCode: false,
  });
}

function atualizarUsuario(id, usuario) {
  return cy.request({
    method: 'PUT',
    url: `/usuarios/${id}`,
    body: usuario,
    failOnStatusCode: false,
  });
}

function excluirUsuario(id) {
  return cy.request({
    method: 'DELETE',
    url: `/usuarios/${id}`,
    failOnStatusCode: false,
  });
}

module.exports = {
  cadastrarUsuario,
  consultarUsuarios,
  consultarUsuarioPorId,
  atualizarUsuario,
  excluirUsuario,
};
```

Assim, os testes reutilizam as operações, enquanto as asserções continuam nos arquivos de teste.

## 6. Exemplo de teste CRUD isolado

Crie `cypress/e2e/usuarios/crud.cy.js`:


```javascript

const { criarUsuario } = require('../../../src/factories/usuario.factory');
const usuariosService = require('../../../src/services/usuarios.service');

describe('CRUD de usuários - ServeRest', () => {
  it('deve cadastrar, consultar, atualizar e excluir um usuário', () => {
    const usuario = criarUsuario();
    let usuarioId;

    // CREATE
    usuariosService.cadastrarUsuario(usuario).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal(
        'Cadastro realizado com sucesso'
      );

      usuarioId = response.body._id;
      expect(usuarioId).to.be.a('string').and.not.be.empty;

      // READ
      return usuariosService.consultarUsuarioPorId(usuarioId);
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.email).to.equal(usuario.email);

      // UPDATE
      return usuariosService.atualizarUsuario(usuarioId, {
        ...usuario,
        nome: 'Usuário QA Atualizado',
      });
    }).then((response) => {
      expect(response.status).to.equal(200);

      // Confirmar atualização
      return usuariosService.consultarUsuarioPorId(usuarioId);
    }).then((response) => {
      expect(response.body.nome).to.equal('Usuário QA Atualizado');

      // DELETE
      return usuariosService.excluirUsuario(usuarioId);
    }).then((response) => {
      expect(response.status).to.equal(200);

      // Confirmar exclusão
      return usuariosService.consultarUsuarioPorId(usuarioId);
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Usuário não encontrado');
    });
  });
});
```

Por que agrupar as operações neste exemplo? O cenário demonstra um fluxo CRUD completo em uma única execução e evita que o ID dependa de uma variável compartilhada entre testes independentes. Para uma suíte maior, também vale manter testes separados por operação, cada um preparando e limpando seus próprios dados.

## 7. Relatórios com Allure

Para Cypress, use a integração específica do Cypress, em vez de `allure-playwright`.

Instale:


```bash
npm install --save-dev allure-cypress
```

A configuração e os comandos de geração do relatório devem seguir a versão do `allure-cypress` escolhida, pois diferem dos usados pelo Playwright. Consulte a documentação oficial: [Allure Cypress](<https://allurereport.org/docs/cypress/?utm_source=chatgpt.com>).

Também é recomendável registrar método, endpoint, status HTTP e mensagens de falha sem imprimir senhas, tokens ou dados sensíveis.

## 8. Testes negativos e contratos

Organize cenários específicos para:

- Cadastro com e-mail duplicado.
- Cadastro sem campos obrigatórios.
- Login com senha incorreta.
- Consulta de ID inexistente.
- Atualização com dados inválidos.
- Validação da estrutura JSON com Ajv.

O Ajv permite validar o contrato com JSON Schema, incluindo propriedades obrigatórias, tipos e restrições. Instale-o com o comando de dependências da seção 3 e mantenha os schemas em `src/schemas/`.

## 9. Scripts no package.json

Adicione ou adapte a seção `scripts`:


```json

{
  "scripts": {
    "test": "cypress run",
    "test:api": "cypress run --spec \"cypress/e2e/usuarios/api.cy.js\"",
    "test:crud": "cypress run --spec \"cypress/e2e/usuarios/crud.cy.js\"",
    "test:contract": "cypress run --spec \"cypress/e2e/usuarios/contrato.cy.js\"",
    "test:negative": "cypress run --spec \"cypress/e2e/usuarios/negativos.cy.js\"",
    "test:open": "cypress open"
  }
}
```

Os caminhos pressupõem os arquivos sugeridos acima. Ajuste-os à estrutura real do seu projeto.

## 10. GitHub Actions

Crie `.github/workflows/tests.yml`:


```yaml

name: Testes Cypress - ServeRest

on:
  push:
  pull_request:

jobs:
  cypress:
    runs-on: ubuntu-latest

    steps:
      - name: Baixar repositório
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Instalar dependências
        run: npm ci

      - name: Executar testes
        run: npm test
```

O fluxo instala as dependências e executa os testes em cada `push` ou `pull request`. Se você adicionar relatórios, poderá configurar o upload dos artefatos mesmo quando algum teste falhar.

## Plano de implementação

## Checklist de evolução

0 de 9

[ ] Centralizar URL e configurações - Essencial

[ ] Adicionar Faker para dados dinâmicos - Essencial

[ ] Criar serviços reutilizáveis - Essencial

[ ] Isolar testes e preparar limpeza dos dados - Essencial

[ ] Integrar Allure Report - Relatórios

[ ] Adicionar testes negativos - Cobertura

[ ] Validar contratos com JSON Schema e Ajv - Cobertura

[ ] Configurar GitHub Actions - CI/CD

[ ] Documentar instalação e execução no README - Documentação


Minha recomendação: comece por configuração centralizada, Faker, serviços reutilizáveis e isolamento dos testes. Depois adicione Ajv e Allure e finalize com GitHub Actions e documentação. Isso cria uma base de automação de API com Cypress mais sustentável, sem precisar implementar toda a arquitetura de uma só vez.