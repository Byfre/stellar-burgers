import { getOrdersApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TUserOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string;
};

const initialState: TUserOrdersState = {
  orders: [],
  isLoading: false,
  error: ''
};

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Ошибка загрузки заказов';
      return rejectWithValue(errorMessage);
    }
  }
);

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    clearUserOrders: (state) => {
      state.orders = [];
      state.error = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = '';
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Не удалось загрузить историю заказов';
        state.orders = [];
      });
  }
});

export const { clearUserOrders } = userOrdersSlice.actions;
export default userOrdersSlice.reducer;
