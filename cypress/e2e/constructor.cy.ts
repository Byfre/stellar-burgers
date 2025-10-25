describe('Burger Constructor Page', () => {
  beforeEach(() => {
    // Настраиваем перехват запросов
    cy.intercept('GET', '**/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    // Устанавливаем токен
    cy.setCookie('accessToken', 'mock-access-token');
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');
    // Открываем страницу конструктора бургера
    cy.visit('http://localhost:4000/');
    // Ждем завершения запроса ингредиентов
    cy.wait('@getIngredients');
  });

  // Добавление булок и начинок
  describe('Burger Constructor - Buns and Fillings', () => {
    it('should add bun to constructor', () => {
      cy.get('[data-testid=ingredient-item]')
        .contains('булка')
        .first()
        .closest('[data-testid=ingredient-item]')
        .within(() => {
          cy.contains('button', 'Добавить').click();
        });

      cy.get('[data-testid=burger-constructor]')
        .find('[data-testid=bun-element]')
        .should('exist');
    });
    it('should add ingredient to constructor', () => {
      cy.get('[data-testid=ingredient-item]')
        .not(':contains("булка")')
        .first()
        .within(() => {
          cy.contains('button', 'Добавить').click();
        });

      cy.get('[data-testid=burger-constructor]')
        .find('[data-testid=constructor-fillings]')
        .should('exist');
    });
  });

  // Работа модального окна ингредиента
  describe('Ingredient Modal', () => {
    it('opens and closes ingredient modal', () => {
      // Открываем модалку
      cy.get('[data-testid=ingredient-item]').first().click();
      cy.contains('Детали ингредиента').should('be.visible');

      // Закрываем через data-testid
      cy.get('[data-testid=modal-close]').click();

      cy.contains('Детали ингредиента').should('not.exist');
    });

    it('closes modal by overlay', () => {
      cy.get('[data-testid=ingredient-item]').first().click();
      cy.contains('Детали ингредиента').should('be.visible');

      // Закрываем кликом в углу экрана (оверлей)
      cy.get('body').click(10, 10);

      cy.contains('Детали ингредиента').should('not.exist');
    });
  });

  // Создание заказа
  describe('Create Order', () => {
    it('should create order successfully', () => {
      // 1. Добавляем булку
      cy.get('[data-testid=ingredient-item]')
        .contains('булка')
        .first()
        .closest('[data-testid=ingredient-item]')
        .within(() => {
          cy.contains('button', 'Добавить').click();
        });

      // 2. Добавляем начинку
      cy.get('[data-testid=ingredient-item]')
        .not(':contains("булка")')
        .first()
        .within(() => {
          cy.contains('button', 'Добавить').click();
        });

      // 3. Проверяем что конструктор заполнен
      cy.get('[data-testid=bun-element]').should('exist');
      cy.get('[data-testid=constructor-fillings]').should('exist');

      // 4. Нажимаем кнопку заказа
      cy.get('[data-testid=order-button]').click();

      // 5. Ждем запрос и проверяем модальное окно
      cy.wait('@createOrder');
      cy.contains('Ваш заказ начали готовить').should('be.visible');

      // 6. Проверяем номер заказа
      cy.contains('91470').should('exist');

      // 7. Закрываем модальное окно
      cy.get('[data-testid=modal-close]').click();

      // 8. Проверяем очистку конструктора
      cy.get('[data-testid=no-buns]').should('exist');
      cy.get('[data-testid=no-fillings]').should('exist');
    });
  });
});
