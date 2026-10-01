import { expect, test, describe } from '@jest/globals';
import ingredientsSlice, {
  initialState,
  fetchIngredients
} from './ingredientsSlice';
import mockResponse from '../../test-data/ingredients.json';

const mockIngredients = mockResponse.data;

describe('тестирование ingredientsSlice reducer', () => {
  test('возвращает initialState при неизвестном экшене и undefined state', () => {
    const result = ingredientsSlice(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('не меняет состояние при неизвестном экшене', () => {
    const state = {
      items: mockIngredients,
      isIngredientsLoading: false,
      error: null
    };
    const result = ingredientsSlice(state, { type: 'UNKNOWN' });
    expect(result).toEqual(state);
  });

  test('обрабатывает fetchIngredients.pending', () => {
    const state = {
      items: [],
      isIngredientsLoading: false,
      error: 'старая ошибка'
    };
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsSlice(state, action);
    expect(result.isIngredientsLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('обрабатывает fetchIngredients.fulfilled', () => {
    const state = { items: [], isIngredientsLoading: true, error: null };
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const result = ingredientsSlice(state, action);
    expect(result.isIngredientsLoading).toBe(false);
    expect(result.items).toEqual(mockIngredients);
    expect(result.items).toHaveLength(15);
  });

  test('обрабатывает fetchIngredients.rejected с payload', () => {
    const state = { items: [], isIngredientsLoading: true, error: null };
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'Ошибка загрузки'
    };
    const result = ingredientsSlice(state, action);
    expect(result.isIngredientsLoading).toBe(false);
    expect(result.error).toBe('Ошибка загрузки');
  });

  test('обрабатывает fetchIngredients.rejected без payload', () => {
    const state = { items: [], isIngredientsLoading: true, error: null };
    const action = {
      type: fetchIngredients.rejected.type,
      payload: undefined
    };
    const result = ingredientsSlice(state, action);
    expect(result.isIngredientsLoading).toBe(false);
    expect(result.error).toBe('Не удалось загрузить ингредиенты');
  });
});
