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
  error: string;
};

export const initialState: TIngredientsState = {
  data: [],
  isIngredientsLoading: false,
  selectedIngredient: null,
  error: ''
};

const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    selectIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.selectedIngredient = action.payload;
    },
    clearError: (state) => {
      state.error = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.pending, (state) => {
      state.isIngredientsLoading = true;
      state.error = '';
    });
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isIngredientsLoading = false;
      state.error = '';
    });
    builder.addCase(fetchIngredients.rejected, (state, action) => {
      state.data = [];
      state.isIngredientsLoading = false;
      state.error = action.error.message || 'Не удалось загрузить ингредиенты';
    });
  }
});

export const { clearError } = ingredientSlice.actions;
export default ingredientSlice.reducer;
