import { expect, test, describe } from '@jest/globals';
import constructorReducer, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import mockResponse from '../../test-data/ingredients.json';

const ingredients = mockResponse.data;

const rawBun = ingredients.find((i) => i.type === 'bun')!;
const rawMain = ingredients.find((i) => i.type === 'main')!;
const rawSauce = ingredients.find((i) => i.type === 'sauce')!;
const rawSecondBun = ingredients.find(
  (i) => i.type === 'bun' && i._id !== rawBun._id
)!;
const rawSecondMain = ingredients.find(
  (i) => i.type === 'main' && i._id !== rawMain._id
)!;
const rawSecondSauce = ingredients.find(
  (i) => i.type === 'sauce' && i._id !== rawSauce._id
)!;

const withId = (ingredient: (typeof ingredients)[0], id: string) => ({
  ...ingredient,
  id
});

describe('тест constructorSlice reducer', () => {
  test('возвращает initialState при неизвестном экшене и undefined state', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('не меняет состояние при неизвестном экшене', () => {
    const state = {
      bun: withId(rawBun, 'test-bun-id'),
      ingredients: [withId(rawMain, 'test-main-id')]
    };
    const result = constructorReducer(state, { type: 'UNKNOWN' });
    expect(result).toEqual(state);
  });

  describe('экшен addIngredient', () => {
    test('добавляет булку в state.bun', () => {
      const action = addIngredient(rawBun);
      const result = constructorReducer(initialState, action);

      expect(result.bun).not.toBeNull();
      expect(result.bun?._id).toBe(rawBun._id);
      expect(result.bun).toHaveProperty('id');
      expect(result.ingredients).toEqual([]);
    });

    test('заменяет старую булку на новую', () => {
      const state = { ...initialState, bun: withId(rawBun, 'old-bun') };
      const action = addIngredient(rawSecondBun);
      const result = constructorReducer(state, action);

      expect(result.bun?._id).toBe(rawSecondBun._id);
      expect(result.bun?.id).not.toBe('old-bun');
    });

    test('добавляет начинку в массив ingredients', () => {
      const action = addIngredient(rawMain);
      const result = constructorReducer(initialState, action);

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]._id).toBe(rawMain._id);
      expect(result.ingredients[0]).toHaveProperty('id');
    });

    test('добавляет соус в массив ingredients', () => {
      const action = addIngredient(rawSauce);
      const result = constructorReducer(initialState, action);

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]._id).toBe(rawSauce._id);
    });

    test('добавляет несколько ингредиентов в массив', () => {
      let state = constructorReducer(initialState, addIngredient(rawMain));
      state = constructorReducer(state, addIngredient(rawSauce));
      state = constructorReducer(state, addIngredient(rawSecondMain));
      state = constructorReducer(state, addIngredient(rawSecondSauce));

      expect(state.ingredients).toHaveLength(4);
    });
  });

  describe('экшен removeIngredient', () => {
    test('удаляет ингредиент по id', () => {
      const state = {
        bun: null,
        ingredients: [withId(rawMain, 'id-1'), withId(rawSauce, 'id-2')]
      };
      const action = removeIngredient('id-1');
      const result = constructorReducer(state, action);

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0].id).toBe('id-2');
    });
  });

  describe('экшен moveIngredient', () => {
    test('перемещает ингредиент вперёд', () => {
      const state = {
        bun: null,
        ingredients: [
          withId(rawMain, 'a'),
          withId(rawSauce, 'b'),
          withId(rawSecondMain, 'c')
        ]
      };
      const action = moveIngredient({ from: 0, to: 2 });
      const result = constructorReducer(state, action);

      expect(result.ingredients.map((i) => i.id)).toEqual(['b', 'c', 'a']);
    });

    test('перемещает ингредиент назад', () => {
      const state = {
        bun: null,
        ingredients: [
          withId(rawMain, 'a'),
          withId(rawSauce, 'b'),
          withId(rawSecondSauce, 'c')
        ]
      };
      const action = moveIngredient({ from: 2, to: 0 });
      const result = constructorReducer(state, action);

      expect(result.ingredients.map((i) => i.id)).toEqual(['c', 'a', 'b']);
    });
  });

  describe('экшен clearConstructor', () => {
    test('очищает конструктор', () => {
      const state = {
        bun: withId(rawBun, 'bun-1'),
        ingredients: [withId(rawMain, 'ing-1'), withId(rawSauce, 'ing-2')]
      };
      const action = clearConstructor();
      const result = constructorReducer(state, action);

      expect(result.bun).toBeNull();
      expect(result.ingredients).toEqual([]);
    });
  });
});
