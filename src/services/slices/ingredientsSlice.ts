import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import type { TIngredient } from '@utils-types';

type TIngredientState = {
  items: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | null;
};

const initialState: TIngredientState = {
  items: [],
  isIngredientsLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (err) {
    const message =
      typeof err === 'object' && err != null && 'message' in err
        ? (err as { message: string }).message
        : String(err);
    return rejectWithValue(message);
  }
});

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить ингредиенты';
      });
  }
});

export default ingredientsSlice.reducer;
