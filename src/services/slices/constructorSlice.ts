import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const ensureIngredientsArray = (state: TConstructorState) => {
  if (!state.ingredients) {
    state.ingredients = [];
  }
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      ensureIngredientsArray(state);
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.bun = ingredient;
        return;
      }

      const constructorIngredient: TConstructorIngredient = {
        ...ingredient,
        id: uuidv4()
      };
      state.ingredients.push(constructorIngredient);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      ensureIngredientsArray(state);
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      ensureIngredientsArray(state);
      const index = action.payload;
      if (index <= 0 || index >= state.ingredients.length) {
        return;
      }
      const ingredients = [...state.ingredients];
      const temp = ingredients[index - 1];
      ingredients[index - 1] = ingredients[index];
      ingredients[index] = temp;
      state.ingredients = ingredients;
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      ensureIngredientsArray(state);
      const index = action.payload;
      if (index < 0 || index >= state.ingredients.length - 1) {
        return;
      }
      const ingredients = [...state.ingredients];
      const temp = ingredients[index + 1];
      ingredients[index + 1] = ingredients[index];
      ingredients[index] = temp;
      state.ingredients = ingredients;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
