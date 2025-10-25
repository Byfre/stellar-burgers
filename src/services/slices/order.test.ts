import reducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  orderBurger
} from './order';

// Тестовые данные
const mockBun = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0,
  id: 'bun1'
};

const mockIngredient1 = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  __v: 0,
  id: 'ing1'
};

const mockIngredient2 = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  __v: 0,
  id: 'ing2'
};

const mockIngredient3 = {
  _id: '60d3b41abdacab0026a733c9',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'https://code.s3.yandex.net/react/code/meat-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
  __v: 0,
  id: 'ing3'
};

const mockOrder = {
  _id: 'order1',
  number: 12345,
  status: 'done',
  name: 'Space флюоресцентный бургер',
  ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

describe('slice burgerConstructor reducer', () => {
  const initialState = {
    constructorItems: {
      bun: null,
      ingredients: []
    },
    isOrderRequesting: false,
    orderError: '',
    orderModalData: null
  };

  describe('Обработка добавления ингредиента', () => {
    test('добавляет булку в конструктор', () => {
      const action = addBun(mockBun);
      const state = reducer(initialState, action);

      expect(state.constructorItems.bun).toEqual(mockBun);
      expect(state.constructorItems.ingredients).toHaveLength(0);
    });

    test('добавляет начинку в конструктор', () => {
      const action = addIngredient(mockIngredient1);
      const state = reducer(initialState, action);

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toEqual(mockIngredient1);
    });

    test('добавляет несколько начинок в конструктор', () => {
      let state = reducer(initialState, addIngredient(mockIngredient1));
      state = reducer(state, addIngredient(mockIngredient2));

      expect(state.constructorItems.ingredients).toHaveLength(2);
      expect(state.constructorItems.ingredients[0]).toEqual(mockIngredient1);
      expect(state.constructorItems.ingredients[1]).toEqual(mockIngredient2);
    });
  });

  describe('Обработка удаления ингредиента', () => {
    test('удаляет начинку по id', () => {
      let state = reducer(initialState, addIngredient(mockIngredient1));
      state = reducer(state, addIngredient(mockIngredient2));

      expect(state.constructorItems.ingredients).toHaveLength(2);

      state = reducer(state, removeIngredient(mockIngredient1));

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toEqual(mockIngredient2);
    });

    test('не удаляет начинку если id не совпадает', () => {
      let state = reducer(initialState, addIngredient(mockIngredient1));
      const unknownIngredient = { ...mockIngredient2, id: 'unknown' };

      state = reducer(state, removeIngredient(unknownIngredient));

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toEqual(mockIngredient1);
    });
  });

  describe('Обработка изменения порядка ингредиентов', () => {
    test('перемещает ингредиент вверх', () => {
      let state = reducer(initialState, addIngredient(mockIngredient1));
      state = reducer(state, addIngredient(mockIngredient2));
      state = reducer(state, addIngredient(mockIngredient3));

      // Исходный порядок: [ing1, ing2, ing3]
      state = reducer(state, moveIngredientUp(1)); // Перемещаем ing2 вверх

      // Ожидаемый порядок: [ing2, ing1, ing3]
      expect(state.constructorItems.ingredients[0]).toEqual(mockIngredient2);
      expect(state.constructorItems.ingredients[1]).toEqual(mockIngredient1);
      expect(state.constructorItems.ingredients[2]).toEqual(mockIngredient3);
    });

    test('перемещает ингредиент вниз', () => {
      let state = reducer(initialState, addIngredient(mockIngredient1));
      state = reducer(state, addIngredient(mockIngredient2));
      state = reducer(state, addIngredient(mockIngredient3));

      // Исходный порядок: [ing1, ing2, ing3]
      state = reducer(state, moveIngredientDown(0)); // Перемещаем ing1 вниз

      // Ожидаемый порядок: [ing2, ing1, ing3]
      expect(state.constructorItems.ingredients[0]).toEqual(mockIngredient2);
      expect(state.constructorItems.ingredients[1]).toEqual(mockIngredient1);
      expect(state.constructorItems.ingredients[2]).toEqual(mockIngredient3);
    });
  });

  describe('orderBurger reducer async actions', () => {
    test('при pending устанавливает isOrderRequesting в true и очищает ошибку', () => {
      const stateWithError = {
        ...initialState,
        orderError: 'Предыдущая ошибка'
      };

      const action = { type: orderBurger.pending.type };
      const state = reducer(stateWithError, action);

      expect(state.isOrderRequesting).toBe(true);
      expect(state.orderError).toBe('');
      expect(state.orderModalData).toBeNull();
    });

    test('при fulfilled сохраняет заказ, очищает конструктор и устанавливает isOrderRequesting в false', () => {
      const stateWithIngredients = {
        constructorItems: {
          bun: mockBun,
          ingredients: [mockIngredient1, mockIngredient2]
        },
        isOrderRequesting: true,
        orderError: '',
        orderModalData: null
      };

      const action = {
        type: orderBurger.fulfilled.type,
        payload: { order: mockOrder }
      };
      const state = reducer(stateWithIngredients, action);

      expect(state.isOrderRequesting).toBe(false);
      expect(state.orderError).toBe('');
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.constructorItems.bun).toBeNull();
      expect(state.constructorItems.ingredients).toHaveLength(0);
    });

    test('при rejected устанавливает isOrderRequesting в false и сохраняет ошибку', () => {
      const stateWithRequesting = {
        ...initialState,
        isOrderRequesting: true
      };

      const action = { type: orderBurger.rejected.type };
      const state = reducer(stateWithRequesting, action);

      expect(state.isOrderRequesting).toBe(false);
      expect(state.orderError).toBe('Не удалось оформить заказ');
      expect(state.orderModalData).toBeNull();
    });
  });
});
