import reducer, { fetchIngredients, initialState } from './ingredients';

// Тестовые данные
const mockIngredients = [
  {
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
    __v: 0
  },
  {
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
    __v: 0
  }
];

describe('ingredients reducer async actions', () => {
  test('при pending устанавливает isIngredientsLoading в true', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);

    expect(state.isIngredientsLoading).toBe(true);
  });

  test('при fulfilled сохраняет данные и устанавливает isIngredientsLoading в false', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer(initialState, action);

    expect(state.isIngredientsLoading).toBe(false);
    expect(state.data).toEqual(mockIngredients);
  });

  test('при rejected сохраняет ошибку и устанавливает isIngredientsLoading в false', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const state = reducer(initialState, action);

    expect(state.isIngredientsLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
