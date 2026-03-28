const SELECTORS = {
  INGREDIENT_ITEM: '[data-testid=ingredient-item]',
  BURGER_CONSTRUCTOR: '[data-testid="burger-constructor"]',
  MODAL_CLOSE: '[data-testid=modal-close]',
  ORDER_BUTTON: '[data-testid=order-button]',
  BUN_ELEMENT: '[data-testid=bun-element]',
  CONSTRUCTOR_FILLINGS: '[data-testid=constructor-fillings]',
  NO_BUNS: '[data-testid=no-buns]',
  NO_FILLINGS: '[data-testid=no-fillings]'
};

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
    cy.visit('/');
    // Ждем завершения запроса ингредиентов
    cy.wait('@getIngredients');
  });

  // Добавление булок и начинок
  describe('Adding ingredients to constructor', () => {
    it('should add specific bun to constructor', () => {
      // Читаем данные из фикстуры и добавляем конкретную булку
      cy.fixture('ingredients.json').then((ingredients) => {
        const bun = ingredients.data.find(
          (ingredient: any) => ingredient.type === 'bun'
        );

        // Добавляем конкретную булку
        cy.contains(bun.name)
          .parent()
          .within(() => {
            cy.contains('button', 'Добавить').click();
          });

        // Проверяем что именно эта булка добавилась в конструктор
        cy.get(SELECTORS.BURGER_CONSTRUCTOR).within(() => {
          cy.contains(`${bun.name} (верх)`).should('exist');
          cy.contains(`${bun.name} (низ)`).should('exist');
          cy.contains(bun.price).should('exist');
        });
      });
    });

    it('should add specific main ingredient to constructor', () => {
      // Читаем данные из фикстуры и добавляем конкретную начинку
      cy.fixture('ingredients.json').then((ingredients) => {
        const mainIngredient = ingredients.data.find(
          (ingredient: any) => ingredient.type === 'main'
        );

        // Добавляем конкретную начинку
        cy.contains(mainIngredient.name)
          .parent()
          .within(() => {
            cy.contains('button', 'Добавить').click();
          });

        // Проверяем что именно эта начинка добавилась в конструктор
        cy.get(SELECTORS.BURGER_CONSTRUCTOR).within(() => {
          cy.contains(mainIngredient.name).should('exist');
          cy.contains(mainIngredient.price).should('exist');
        });
      });
    });
  });

  // Работа модального окна ингредиента
  describe('Ingredient Modal', () => {
    it('opens and closes ingredient modal with close button', () => {
      // Читаем данные из фикстуры и открываем модалку
      cy.fixture('ingredients.json').then((ingredients) => {
        const firstIngredient = ingredients.data[0];

        // Открываем модалку конкретного ингредиента
        cy.contains(firstIngredient.name).click();

        // Проверяем, что модалка открылась
        cy.contains('Детали ингредиента').should('be.visible');

        // Проверяем что в модалке отображаются детали именно этого ингредиента
        cy.contains(firstIngredient.name).should('be.visible');
        cy.contains(firstIngredient.calories).should('exist');
        cy.contains(firstIngredient.proteins).should('exist');
        cy.contains(firstIngredient.fat).should('exist');
        cy.contains(firstIngredient.carbohydrates).should('exist');

        // Закрываем через data-testid
        cy.get(SELECTORS.MODAL_CLOSE).click();

        // Проверяем что модалка закрылась и ингредиент снова виден в списке
        cy.contains('Детали ингредиента').should('not.exist');
        cy.contains(firstIngredient.name).should('be.visible');
      });
    });

    it('opens and closes ingredient modal with overlay click', () => {
      // Читаем данные из фикстуры и открываем модалку
      cy.fixture('ingredients.json').then((ingredients) => {
        const firstIngredient = ingredients.data[0];

        // Открываем модалку конкретного ингредиента
        cy.contains(firstIngredient.name).click();

        // Проверяем, что модалка открылась
        cy.contains('Детали ингредиента').should('be.visible');

        // Проверяем что в модалке отображаются детали именно этого ингредиента
        cy.contains(firstIngredient.name).should('be.visible');
        cy.contains(firstIngredient.calories).should('exist');
        cy.contains(firstIngredient.proteins).should('exist');
        cy.contains(firstIngredient.fat).should('exist');
        cy.contains(firstIngredient.carbohydrates).should('exist');

        // Закрываем кликом в углу экрана (оверлей)
        cy.get('body').click(10, 10);

        // Проверяем что модалка закрылась и ингредиент снова виден в списке
        cy.contains('Детали ингредиента').should('not.exist');
        cy.contains(firstIngredient.name).should('be.visible');
      });
    });
  });

  // Создание заказа
  describe('Create Order', () => {
    it('should create order successfully', () => {
      // 1. Добавляем булку
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .contains('булка')
        .first()
        .closest(SELECTORS.INGREDIENT_ITEM)
        .within(() => {
          cy.contains('button', 'Добавить').click();
        });

      // 2. Добавляем начинку
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .not(':contains("булка")')
        .first()
        .within(() => {
          cy.contains('button', 'Добавить').click();
        });

      // 3. Проверяем что конструктор заполнен
      cy.get(SELECTORS.BUN_ELEMENT).should('exist');
      cy.get(SELECTORS.CONSTRUCTOR_FILLINGS).should('exist');

      // 4. Нажимаем кнопку заказа
      cy.get(SELECTORS.ORDER_BUTTON).click();

      // 5. Ждем запрос и проверяем модальное окно
      cy.wait('@createOrder');
      cy.contains('Ваш заказ начали готовить').should('be.visible');

      // 6. Проверяем номер заказа
      cy.contains('91470').should('exist');

      // 7. Закрываем модальное окно
      cy.get(SELECTORS.MODAL_CLOSE).click();

      // 8. Проверяем очистку конструктора
      cy.get(SELECTORS.NO_BUNS).should('exist');
      cy.get(SELECTORS.NO_FILLINGS).should('exist');
    });
  });
});
