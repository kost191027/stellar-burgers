import { userOrdersReducer, fetchUserOrders } from './userOrdersSlice';

import type { TOrder } from '@utils-types';

describe('userOrdersSlice reducer', () => {
  const initialState = userOrdersReducer(undefined, { type: 'UNKNOWN' });

  it('sets isLoading=true on fetchUserOrders.pending', () => {
    const state = userOrdersReducer(
      { ...initialState, error: 'prev error' },
      fetchUserOrders.pending('request-id', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores orders and sets isLoading=false on fetchUserOrders.fulfilled', () => {
    const orders: TOrder[] = [
      {
        _id: 'order-1',
        status: 'done',
        name: 'Order 1',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        number: 1,
        ingredients: ['ing-1']
      }
    ];

    const state = userOrdersReducer(
      { ...initialState, isLoading: true },
      fetchUserOrders.fulfilled(orders, 'request-id', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(orders);
  });

  it('stores error and sets isLoading=false on fetchUserOrders.rejected', () => {
    const state = userOrdersReducer(
      { ...initialState, isLoading: true },
      fetchUserOrders.rejected(new Error('fail'), 'request-id', undefined, 'Ошибка')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
