import { FC, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../services/selectors/user';
import {
  selectConstructorBun,
  selectConstructorIngredients
} from '../../services/selectors/constructor';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorIngredients) || [];

  const constructorItems = useMemo(
    () => ({
      bun: bun ?? null,
      ingredients: ingredients ?? []
    }),
    [bun, ingredients]
  );

  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.order);

  const isAuth = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOrderClick = async () => {
    if (!bun || orderRequest) {
      return;
    }

    if (!isAuth) {
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      await dispatch(createOrder()).unwrap();
      dispatch(clearConstructor());
    } catch (_) {
      // Ошибку показываем из slice.order.error в UI
    }
  };

  const handleCloseOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) =>
          sum + ingredient.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};
