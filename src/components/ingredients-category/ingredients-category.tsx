import { forwardRef, useMemo } from 'react';

import { useSelector } from '../../services/store';
import { selectConstructorState } from '../../services/selectors/constructor';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const constructorState = useSelector(selectConstructorState);

  const ingredientsCounters = useMemo(() => {
    if (!constructorState) {
      return {} as { [key: string]: number };
    }

    const { bun, ingredients: constructorIngredients = [] } = constructorState;
    const counters: { [key: string]: number } = {};

    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) {
        counters[ingredient._id] = 0;
      }
      counters[ingredient._id] += 1;
    });

    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [constructorState]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
