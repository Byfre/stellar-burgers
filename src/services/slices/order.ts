import { orderBurgerApi } from '@api';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';

export type TConstructorItems = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export interface OrderState {
  constructorItems: TConstructorItems;
  isOrderRequesting: boolean;
  orderError: string;
  orderModalData: TOrder | null;
}

const initialState: OrderState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  isOrderRequesting: false,
  orderError: '',
  orderModalData: null
};

export const orderBurger = createAsyncThunk(
  'burgerconstructor/orderBurger',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

const constructorSlice = createSlice({
  name: 'burgerconstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.bun = action.payload;
    },

    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => action.payload.id !== ingredient.id
        );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0 && index < state.constructorItems.ingredients.length) {
        // Меняем местами элементы
        const temp = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] =
          state.constructorItems.ingredients[index - 1];
        state.constructorItems.ingredients[index - 1] = temp;
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.constructorItems.ingredients.length - 1) {
        // Меняем местами элементы
        const temp = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] =
          state.constructorItems.ingredients[index + 1];
        state.constructorItems.ingredients[index + 1] = temp;
      }
    },
    clearOrderData: (state) => {
      state.orderModalData = null;
      state.orderError = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(orderBurger.pending, (state) => {
      state.isOrderRequesting = true;
      state.orderError = '';
      state.orderModalData = null;
    });
    builder.addCase(orderBurger.fulfilled, (state, action) => {
      state.isOrderRequesting = false;
      state.orderError = '';
      state.orderModalData = action.payload.order;
      //Очистка конструктора ингредиентов после успешной отпраки заказа
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    });
    builder.addCase(orderBurger.rejected, (state) => {
      state.isOrderRequesting = false;
      state.orderError = 'Не удалось оформить заказ';
    });
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  clearOrderData,
  moveIngredientUp,
  moveIngredientDown
} = constructorSlice.actions;

export default constructorSlice.reducer;
