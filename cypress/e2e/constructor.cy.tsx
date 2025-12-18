describe('Constructor page', () => {
  const bunId = 'bun-test-1';
  const mainId = 'main-test-1';

  const bunName = 'Булка тестовая';
  const mainName = 'Начинка тестовая';
  const sauceName = 'Соус тестовый';

  const accessToken = 'Bearer test-access-token';
  const refreshToken = 'test-refresh-token';

  describe('Unauthenticated', () => {
    beforeEach(() => {
      // Make tests deterministic: no real network.
      cy.intercept('GET', '**/auth/user*', {
        statusCode: 401,
        body: { message: 'Unauthorised' }
      }).as('getUser');

          cy.intercept('GET', '**/ingredients*', {
        fixture: 'ingredients.json'
      }).as('getIngredients');

      cy.visit('/');
      cy.wait('@getIngredients');
    });

    it('renders ingredients from the mocked API', () => {
      cy.contains('h1', 'Соберите бургер').should('be.visible');

      // First category is visible by default
      cy.contains('h3', 'Булки').should('be.visible');
      cy.contains('p', bunName).should('be.visible');

      // Other categories are inside a scrollable container
      cy.contains('h3', 'Начинки').scrollIntoView().should('be.visible');
      cy.contains('p', mainName).should('be.visible');

      cy.contains('h3', 'Соусы').scrollIntoView().should('be.visible');
      cy.contains('p', sauceName).should('be.visible');
    });

    it('adds bun and filling into the constructor', () => {
      // Add bun
      cy.contains('h3', 'Булки')
        .next('ul')
        .contains('p', bunName)
        .closest('li')
        .contains('button', 'Добавить')
        .click();

      cy.contains('button', 'Оформить заказ')
        .closest('section')
        .should('contain.text', `${bunName} (верх)`)
        .and('contain.text', `${bunName} (низ)`);

      // Add main ingredient
      cy.contains('h3', 'Начинки')
        .scrollIntoView()
        .next('ul')
        .contains('p', mainName)
        .closest('li')
        .contains('button', 'Добавить')
        .click();

      cy.contains('button', 'Оформить заказ')
        .closest('section')
        .should('contain.text', mainName);
    });

    describe('Modal windows', () => {
      it('opens ingredient modal and displays details', () => {
        cy.contains('h3', 'Начинки').scrollIntoView();
        cy.contains('p', mainName).click();
        cy.location('pathname').should('eq', `/ingredients/${mainId}`);

        cy.get('#modals').within(() => {
          cy.contains('h3', 'Детали ингредиента').should('be.visible');
          cy.contains('h3', mainName).should('be.visible');

          cy.contains('p', 'Калории, ккал').should('be.visible');
          cy.contains('p', 'Белки, г').should('be.visible');
          cy.contains('p', 'Жиры, г').should('be.visible');
          cy.contains('p', 'Углеводы, г').should('be.visible');
        });
      });

      it('closes modal by clicking the close icon', () => {
        cy.contains('h3', 'Начинки').scrollIntoView();
        cy.contains('p', mainName).click();
        cy.location('pathname').should('eq', `/ingredients/${mainId}`);

        // onClose is attached to the CloseIcon, so click the icon itself
        cy.get('#modals')
          .find('button[type="button"]')
          .first()
          .children()
          .first()
          .click();

        cy.location('pathname').should('eq', '/');
        cy.get('#modals').children().should('have.length', 0);
      });

      it('closes modal by clicking the overlay', () => {
        cy.contains('p', bunName).click();
        cy.location('pathname').should('eq', `/ingredients/${bunId}`);

        // Overlay is the last child in the portal
        cy.get('#modals').children().last().click({ force: true });

        cy.location('pathname').should('eq', '/');
        cy.get('#modals').children().should('have.length', 0);
      });
    });
  });

  describe('Authenticated', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/auth/user*', (req) => {
        const auth =
          (req.headers as any)['authorization'] ||
          (req.headers as any)['Authorization'];
        expect(auth).to.eq(accessToken);

        req.reply({ fixture: 'user.json' });
      }).as('getUser');

      cy.intercept('GET', '**/api/ingredients*', {
        fixture: 'ingredients.json'
      }).as('getIngredients');

      cy.intercept('POST', '**/orders*', (req) => {
        const auth =
          (req.headers as any)['authorization'] ||
          (req.headers as any)['Authorization'];
        expect(auth).to.eq(accessToken);

        const body =
          typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

        expect(body).to.have.property('ingredients');
        expect(body.ingredients).to.deep.equal([bunId, mainId, bunId]);

        req.reply({ fixture: 'order.json' });
      }).as('createOrder');

      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('refreshToken', refreshToken);
          win.document.cookie = `accessToken=${encodeURIComponent(accessToken)}; path=/`;
        }
      });

      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });

    it('creates an order and clears the constructor', () => {
      // Assemble burger
      cy.contains('h3', 'Булки')
        .next('ul')
        .contains('p', bunName)
        .closest('li')
        .contains('button', 'Добавить')
        .click();

      cy.contains('h3', 'Начинки')
        .scrollIntoView()
        .next('ul')
        .contains('p', mainName)
        .closest('li')
        .contains('button', 'Добавить')
        .click();

      // Create order
      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      // Modal opened and order number is correct
      cy.get('#modals').within(() => {
        cy.contains('h2', '12345').should('be.visible');
        cy.contains('p', 'идентификатор заказа').should('be.visible');
      });

      // Close modal
      cy.get('#modals')
        .find('button[type="button"]')
        .first()
        .children()
        .first()
        .click();

      cy.get('#modals').children().should('have.length', 0);

      // Constructor is empty
      cy.contains('button', 'Оформить заказ')
        .closest('section')
        .should('contain.text', 'Выберите булки')
        .and('contain.text', 'Выберите начинку')
        .and('not.contain.text', bunName)
        .and('not.contain.text', mainName);
    });
  });
});
