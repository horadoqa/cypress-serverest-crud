# Instalar o Cypress

## 1. Instale o Node.js

Se ainda não tiver o Node.js instalado:

- Acesse o site oficial: [Node.js](<https://nodejs.org/?utm_source=chatgpt.com>)
- Baixe uma versão LTS e instale.

Depois, abra o terminal do VS Code e verifique a instalação:


```bash
node -v
npm -v
```

Se os dois comandos retornarem números de versão, você está pronto para continuar.

## 2. Crie ou acesse a pasta do projeto

Se você já criou a pasta do projeto, entre nela pelo terminal:


```bash
cd cypress-serverest-crud
```

Se ainda não criou a pasta localmente:

bash
```
mkdir cypress-serverest-crud
cd cypress-serverest-crud
```

## 3. Inicialize o projeto Node.js

Execute:

```bash
npm init -y
```

Esse comando cria o arquivo `package.json`, que registra as informações e as dependências do projeto.

## 4. Instale o Cypress

Execute o comando abaixo no terminal, dentro da pasta do projeto:

```bash
npm install cypress --save-dev
```

O Cypress será instalado como uma dependência de desenvolvimento.

## 5. Abra o Cypress

Após a instalação, execute:


```bash
npx cypress open
```

Uma janela do Cypress deverá abrir. Na primeira execução:

1. Selecione E2E Testing.
2. Clique em Continue.
3. Escolha um navegador disponível.
4. Conclua a configuração inicial.

O Cypress criará os arquivos básicos de configuração e a estrutura de testes.

## 6. Verifique a estrutura do projeto

Depois da configuração, sua estrutura poderá ficar semelhante a esta:

```bash
cypress-serverest-crud/
├── cypress/
│   ├── e2e/        # Testes automatizados
│   ├── fixtures/   # Dados de teste
│   └── support/    # Comandos e configurações auxiliares
├── changelog.md
├── cypress.config.js
├── package.json
├── package-lock.json
└── README.md
```

## 7. Execute os testes

Quando começar a criar seus testes de API para o ServeRest, você poderá executar o Cypress de duas formas:

Modo visual:


```bash
npx cypress open
```

Modo headless (pelo terminal):

```bash
npx cypress run
```

O modo visual é ótimo para desenvolver e depurar os testes; o headless é útil para executar a suíte inteira e, futuramente, integrar o projeto a um pipeline de CI/CD.

Próximo passo recomendado: criar seu primeiro teste de API para cadastrar um usuário na ServeRest, validar o status HTTP e verificar os dados retornados.

Documentação oficial: [Instalação do Cypress](<https://docs.cypress.io/app/get-started/install-cypress?utm_source=chatgpt.com>).