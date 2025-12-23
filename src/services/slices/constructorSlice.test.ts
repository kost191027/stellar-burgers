import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp
} from './constructorSlice';

import type { TConstructorIngredient } from '@utils-types';

const createIngredient = (
  overrides: Partial<TConstructorIngredient>
): TConstructorIngredient => ({
  _id: 'test-id',
  name: 'test-name',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 1,
  image: 'test-image',
  image_large: 'test-image-large',
  image_mobile: 'test-image-mobile',
  id: 'constructor-id',
  ...overrides
});

describe('burgerConstructor reducer (constructorSlice)', () => {
  it('handles addIngredient (bun) - sets bun and does not add to fillings', () => {
    const bun = createIngredient({
      _id: 'bun-1',
      id: 'bun-instance-1',
      type: 'bun',
      name: 'Bun'
    });

    const state = constructorReducer(undefined, addIngredient(bun));

    const { id: _removedId, ...bunWithoutId } = bun;

    expect(state.bun).toEqual(bunWithoutId);
    expect(state.ingredients).toEqual([]);
  });

  it('handles addIngredient (filling) - pushes ingredient into ingredients array', () => {
    const main = createIngredient({
      _id: 'main-1',
      id: 'main-instance-1',
      type: 'main',
      name: 'Main'
    });

    const state = constructorReducer(undefined, addIngredient(main));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([main]);
  });

  it('handles removeIngredient - removes by constructor id', () => {
    const ing1 = createIngredient({ _id: 'main-1', id: 'id-1', name: 'A' });
    const ing2 = createIngredient({ _id: 'main-2', id: 'id-2', name: 'B' });

    const preloaded = {
      bun: null,
      ingredients: [ing1, ing2]
    };

    const state = constructorReducer(preloaded, removeIngredient('id-1'));

    expect(state.ingredients).toEqual([ing2]);
  });

  it('handles moveIngredientUp - swaps ingredient with previous one', () => {
    const ing1 = createIngredient({ id: 'id-1', name: '1' });
    const ing2 = createIngredient({ id: 'id-2', name: '2' });
    const ing3 = createIngredient({ id: 'id-3', name: '3' });

    const preloaded = {
      bun: null,
      ingredients: [ing1, ing2, ing3]
    };

    const state = constructorReducer(preloaded, moveIngredientUp(2));

    expect(state.ingredients.map((i) => i.id)).toEqual(['id-1', 'id-3', 'id-2']);
  });

  it('handles moveIngredientDown - swaps ingredient with next one', () => {
    const ing1 = createIngredient({ id: 'id-1', name: '1' });
    const ing2 = createIngredient({ id: 'id-2', name: '2' });
    const ing3 = createIngredient({ id: 'id-3', name: '3' });

    const preloaded = {
      bun: null,
      ingredients: [ing1, ing2, ing3]
    };

    const state = constructorReducer(preloaded, moveIngredientDown(0));

    expect(state.ingredients.map((i) => i.id)).toEqual(['id-2', 'id-1', 'id-3']);
  });
});
