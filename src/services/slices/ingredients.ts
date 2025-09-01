import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { type TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchall',
  async () => {
    const response = await getIngredientsApi();
    console.log(response);
    return [];
  }
);

type TIngredientsState = {
  items: TIngredient[];
  isIngredientsLoading: boolean;
};

const initialState: TIngredientsState = {
  items: [],
  isIngredientsLoading: false
};

const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    console.log('ping');
    builder.addCase(fetchIngredients.pending, (state) => {
      state.isIngredientsLoading = true;
      console.log(state);
    });
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      // state.items = action.payload;
      state.isIngredientsLoading = false;
      console.log(state, action);
    });
  }
});

export default ingredientSlice.reducer;
