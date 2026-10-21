
describe('Contrato da API - Usuários', () => {
  it('GET /usuarios - validar estrutura e tipos', () => {
    cy.request('GET', '/usuarios').then((response) => {
      expect(response.status).to.equal(200);

      const body = response.body;

      // Validar a estrutura principal
      expect(body).to.have.all.keys('quantidade', 'usuarios');

      expect(body.quantidade).to.be.a('number');
      expect(body.usuarios).to.be.an('array');

      // Validar quantidade de usuários
      expect(body.quantidade).to.be.at.least(0);
      expect(body.quantidade).to.equal(body.usuarios.length);

      // Validar contrato de cada usuário
      body.usuarios.forEach((usuario) => {
        expect(usuario).to.include({
          nome: usuario.nome,
          email: usuario.email,
          password: usuario.password,
          administrador: usuario.administrador,
        });

        expect(usuario._id).to.be.a('string');
        expect(usuario.nome).to.be.a('string');
        expect(usuario.email).to.be.a('string');
        expect(usuario.password).to.be.a('string');

        expect(usuario.administrador).to.match(/^(true|false)$/);
      });
    });
  });

  it('GET /usuarios/:id - validar contrato individual', () => {
    cy.request('GET', '/usuarios').then((listaResponse) => {
      expect(listaResponse.status).to.equal(200);

      const lista = listaResponse.body;

      // Não há usuários cadastrados para validar
      if (lista.usuarios.length === 0) {
        cy.log(
          'Não existem usuários cadastrados para validar o contrato.'
        );
        return;
      }

      const id = lista.usuarios[0]._id;

      cy.request('GET', `/usuarios/${id}`).then((response) => {
        expect(response.status).to.equal(200);

        const body = response.body;

        // Validar contrato individual
        expect(body.nome).to.be.a('string');
        expect(body.email).to.be.a('string');
        expect(body.password).to.be.a('string');

        expect(body.administrador).to.be.a('string');
        expect(body.administrador).to.match(/^(true|false)$/);
      });
    });
  });
});
// npx cypress run --spec "cypress/e2e/usuarios/contrato.cy.js"