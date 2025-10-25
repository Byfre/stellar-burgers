import reducer, { fetchOrders, fetchOrderByNumber } from './feed';

// Тестовые данные для заказов
const mockOrdersData = {
  orders: [
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
  ],
  total: 100,
  totalToday: 10
};

const mockOrderByNumber = {
  orders: [
    {
      _id: '1',
      status: 'done',
      name: 'Space флюоресцентный бургер',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      number: 12345,
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
    }
  ]
};

describe('feed reducer async actions', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isOrdersLoading: false,
    selectedOrder: null,
    isSelectedOrderLoading: false
  };

  describe('fetchOrders', () => {
    test('при pending устанавливает isOrdersLoading в true и очищает orders', () => {
      const stateWithOrders = {
        ...initialState,
        orders: mockOrdersData.orders
      };

      const action = { type: fetchOrders.pending.type };
      const state = reducer(stateWithOrders, action);

      expect(state.isOrdersLoading).toBe(true);
      expect(state.orders).toEqual([]);
    });

    test('при fulfilled сохраняет данные и устанавливает isOrdersLoading в false', () => {
      const action = {
        type: fetchOrders.fulfilled.type,
        payload: mockOrdersData
      };
      const state = reducer(initialState, action);

      expect(state.isOrdersLoading).toBe(false);
      expect(state.orders).toEqual(mockOrdersData.orders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
    });

    test('при rejected устанавливает isOrdersLoading в false и очищает данные', () => {
      const stateWithData = {
        ...initialState,
        orders: mockOrdersData.orders,
        total: 100,
        totalToday: 10,
        isOrdersLoading: true
      };

      const action = { type: fetchOrders.rejected.type };
      const state = reducer(stateWithData, action);

      expect(state.isOrdersLoading).toBe(false);
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });
  });

  describe('fetchOrderByNumber', () => {
    test('при pending устанавливает isSelectedOrderLoading в true', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = reducer(initialState, action);

      expect(state.isSelectedOrderLoading).toBe(true);
    });

    test('при fulfilled сохраняет заказ и устанавливает isSelectedOrderLoading в false', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrderByNumber
      };
      const state = reducer(initialState, action);

      expect(state.isSelectedOrderLoading).toBe(false);
      expect(state.selectedOrder).toEqual(mockOrderByNumber.orders[0]);
    });

    test('при rejected устанавливает isSelectedOrderLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isSelectedOrderLoading: true
      };

      const action = { type: fetchOrderByNumber.rejected.type };
      const state = reducer(stateWithLoading, action);

      expect(state.isSelectedOrderLoading).toBe(false);
    });
  });
});
