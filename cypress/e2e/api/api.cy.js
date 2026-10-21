describe('API de usuários - Testes funcionais', () => {
  it('GET /usuarios - consultar lista de usuários', () => {
    const inicio = Date.now();

    cy.request({
      method: 'GET',
      url: '/usuarios',
    }).then((response) => {
      const tempoResposta = Date.now() - inicio;
      const body = response.body;

      // Validar status HTTP
      expect(response.status).to.equal(200);

      // Validar tempo de resposta
      expect(tempoResposta).to.be.lessThan(3000);

      // Validar estrutura do retorno
      expect(body.quantidade).to.be.a('number');
      expect(body.usuarios).to.be.an('array');

      // Validar quantidade de usuários
      expect(body.quantidade).to.equal(body.usuarios.length);

      // Exibir informações no log
      cy.log(`Tempo de resposta: ${tempoResposta} ms`);
      cy.log(`Total de usuários: ${body.quantidade}`);

      console.log(`Tempo de resposta: ${tempoResposta} ms`);
      console.log(`Total de usuários: ${body.quantidade}`);
    });
  });
});

// npx cypress run --spec "cypress/e2e/api/api.cy.js"
