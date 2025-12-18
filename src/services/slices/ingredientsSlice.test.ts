import { ingredientsReducer, fetchIngredients } from './ingredientsSlice';

import type { TIngredient } from '@utils-types';

describe('ingredientsSlice reducer', () => {
  const initialState = ingredientsReducer(undefined, { type: 'UNKNOWN' });

  it('sets isLoading=true on fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      { ...initialState, error: 'prev error' },
      fetchIngredients.pending('request-id', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores ingredients and sets isLoading=false on fetchIngredients.fulfilled', () => {
    const ingredients: TIngredient[] = [
      {
        _id: 'ing-1',
        name: 'Ingredient 1',
        type: 'main',
        proteins: 1,
        fat: 1,
        carbohydrates: 1,
        calories: 1,
        price: 10,
        image: 'img',
        image_large: 'img_large',
        image_mobile: 'img_mobile'
      }
    ];

    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.fulfilled(ingredients, 'request-id', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(ingredients);
  });

  it('stores error and sets isLoading=false on fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.rejected(
        new Error('fail'),
        'request-id',
        undefined,
        'Ошибка загрузки ингредиентов'
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
  });
});
