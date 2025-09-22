import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { type TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { RootState } from '../store';

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchall',
  async () => await getIngredientsApi()
);

export const getIngredientById = (id?: string) => (state: RootState) =>
  state.ingredients.data.find((ingredient) => ingredient._id === id);

type TIngredientsState = {
  data: TIngredient[];
  isIngredientsLoading: boolean;
  selectedIngredient: TIngredient | null;
};

const initialState: TIngredientsState = {
  data: [],
  isIngredientsLoading: false,
  selectedIngredient: null
};

const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    selectIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.selectedIngredient = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.pending, (state) => {
      state.isIngredientsLoading = true;
    });
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isIngredientsLoading = false;
    });
  }
});

export default ingredientSlice.reducer;
