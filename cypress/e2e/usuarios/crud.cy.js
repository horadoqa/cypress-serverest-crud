
const usuario = {
  nome: 'Hora do QA',
  email: 'horadoqa@qa.com.br',
  password: '1q2w3e4r',
  administrador: 'true',
};

describe('CRUD de usuários - ServeRest', () => {
  let usuarioId;

  // 1. Create - cadastrar usuário
  it('1. Create - cadastrar usuário', () => {
    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: usuario,
    }).then((response) => {
      expect(response.status).to.equal(201);

      expect(response.body.message).to.equal(
        'Cadastro realizado com sucesso'
      );

      expect(response.body._id).to.be.a('string').and.not.be.empty;

      // Salva o ID para utilizar nos próximos testes
      usuarioId = response.body._id;
    });
  });

  // 2. Read - consultar usuário criado
  it('2. Read - consultar usuário criado', () => {
    expect(usuarioId).to.be.a('string').and.not.be.empty;

    cy.request('GET', `/usuarios/${usuarioId}`).then((response) => {
      expect(response.status).to.equal(200);

      expect(response.body).to.include({
        nome: usuario.nome,
        email: usuario.email,
        password: usuario.password,
        administrador: usuario.administrador,
      });
    });
  });

  // 3. Login - autenticar usuário
  it('3. Login - autenticar usuário', () => {
    cy.request({
      method: 'POST',
      url: '/login',
      body: {
        email: usuario.email,
        password: usuario.password,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);

      expect(response.body.message).to.equal(
        'Login realizado com sucesso'
      );

      expect(response.body.authorization).to.be.a('string').and.not.be.empty;

      expect(response.body.authorization).to.match(/^Bearer\s+\S+/);
    });
  });

  // 4. Update - atualizar nome do usuário
  it('4. Update - atualizar nome do usuário', () => {
    cy.request({
      method: 'PUT',
      url: `/usuarios/${usuarioId}`,
      body: {
        ...usuario,
        nome: 'Hora do QA Atualizado',
      },
    }).then((response) => {
      expect(response.status).to.equal(200);

      expect(response.body.message).to.equal(
        'Registro alterado com sucesso'
      );
    });

    // Confirma a alteração consultando novamente o usuário
    cy.request('GET', `/usuarios/${usuarioId}`).then((consulta) => {
      expect(consulta.status).to.equal(200);

      expect(consulta.body.nome).to.equal('Hora do QA Atualizado');
    });
  });

  // 5. Delete - excluir usuário criado
  it('5. Delete - excluir usuário criado', () => {
    cy.request('DELETE', `/usuarios/${usuarioId}`).then((response) => {
      expect(response.status).to.equal(200);

      expect(response.body.message).to.equal(
        'Registro excluído com sucesso'
      );
    });

    // Confirma que o usuário não existe mais
    cy.request({
      method: 'GET',
      url: `/usuarios/${usuarioId}`,
      failOnStatusCode: false,
    }).then((consulta) => {
      expect(consulta.status).to.equal(400);

      expect(consulta.body.message).to.equal('Usuário não encontrado');
    });
  });
});
// npx cypress run --spec "cypress/e2e/usuarios/crud.cy.js"
// npx cypress run --spec "cypress/e2e/usuarios/crud.cy.js" --browser chrome