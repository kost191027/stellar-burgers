import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIsIngredientsLoading
} from '../../services/selectors/ingredients';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIsIngredientsLoading);

  useEffect(() => {
    if (!ingredients.length && !isLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, isLoading]);

  const ingredientData = useMemo(
    () => ingredients.find((ing) => ing._id === id),
    [ingredients, id]
  );

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
