const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://serverest.dev/',
  },
});


// npx cypress run --spec "cypress/e2e/usuarios.cy.js"