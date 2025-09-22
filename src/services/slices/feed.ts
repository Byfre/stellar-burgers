import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { type TOrder, TOrdersData } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi } from '@api';

export const fetchOrders = createAsyncThunk<TOrdersData>(
  'feed/fetchall',
  async () => await getFeedsApi()
);

export const fetchOrderByNumber = createAsyncThunk(
  'feed/fetchOrderByNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

type TOrderState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isOrdersLoading: boolean;
  selectedOrder: TOrder | null;
  isSelectedOrderLoading: boolean;
};

const initialState: TOrderState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isOrdersLoading: false,
  selectedOrder: null,
  isSelectedOrderLoading: false
};

const ordersSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    selectOrder: (state, action: PayloadAction<TOrder>) => {
      state.selectedOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.pending, (state) => {
      state.orders = [];
      state.isOrdersLoading = true;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.isOrdersLoading = false;

      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    });
    //GetOrderByNumber
    builder.addCase(fetchOrderByNumber.pending, (state) => {
      state.isSelectedOrderLoading = true;
    });
    builder.addCase(fetchOrderByNumber.fulfilled, (state, action) => {
      state.isSelectedOrderLoading = false;
      state.selectedOrder = action.payload.orders[0];
    });
    builder.addCase(fetchOrderByNumber.rejected, (state) => {
      state.isSelectedOrderLoading = false;
    });
  }
});

export const { selectOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
