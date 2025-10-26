import reducer, { fetchUserOrders, initialState } from './userOrders';

// Тестовые данные для заказов пользователя
const mockUserOrders = [
  {
    _id: '1',
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
  },
  {
    _id: '2',
    status: 'pending',
    name: 'Марсианский традиционный бургер',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
    number: 12346,
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0942']
  }
];

describe('userOrders reducer async actions', () => {
  describe('fetchUserOrders', () => {
    test('при pending устанавливает isLoading в true и очищает ошибку', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };

      const action = { type: fetchUserOrders.pending.type };
      const state = reducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe('');
    });

    test('при fulfilled сохраняет заказы и устанавливает isLoading в false', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockUserOrders
      };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockUserOrders);
      expect(state.error).toBe('');
    });

    test('при rejected устанавливает isLoading в false, сохраняет ошибку и очищает заказы', () => {
      const stateWithOrders = {
        orders: mockUserOrders,
        isLoading: true,
        error: ''
      };

      const action = {
        type: fetchUserOrders.rejected.type,
        payload: 'Ошибка сети'
      };
      const state = reducer(stateWithOrders, action);

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual([]);
      expect(state.error).toBe('Ошибка сети');
    });

    test('при rejected использует дефолтное сообщение если payload отсутствует', () => {
      const action = {
        type: fetchUserOrders.rejected.type,
        payload: undefined
      };
      const state = reducer(initialState, action);

      expect(state.error).toBe('Не удалось загрузить историю заказов');
    });
  });
});
