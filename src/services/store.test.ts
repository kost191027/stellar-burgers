import store from './store';

import { ingredientsReducer } from './slices/ingredientsSlice';
import { userReducer } from './slices/userSlice';
import { constructorReducer } from './slices/constructorSlice';
import { orderReducer } from './slices/orderSlice';
import { feedReducer } from './slices/feedSlice';
import { userOrdersReducer } from './slices/userOrdersSlice';

describe('rootReducer', () => {
  it('initializes all slices with correct initial state', () => {
    const state = store.getState();
    const unknownAction = { type: 'UNKNOWN' };

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, unknownAction),
      user: userReducer(undefined, unknownAction),
      burgerConstructor: constructorReducer(undefined, unknownAction),
      order: orderReducer(undefined, unknownAction),
      feed: feedReducer(undefined, unknownAction),
      userOrders: userOrdersReducer(undefined, unknownAction)
    });
  });
});
