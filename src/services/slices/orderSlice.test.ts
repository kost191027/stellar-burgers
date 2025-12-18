import { orderReducer, createOrder, clearOrder } from './orderSlice';

import type { TOrder } from '@utils-types';

describe('orderSlice reducer', () => {
  const initialState = orderReducer(undefined, { type: 'UNKNOWN' });

  it('sets orderRequest=true on createOrder.pending', () => {
    const state = orderReducer(
      { ...initialState, error: 'prev error' },
      createOrder.pending('request-id', undefined)
    );

    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores order and sets orderRequest=false on createOrder.fulfilled', () => {
    const order: TOrder = {
      _id: 'order-1',
      status: 'done',
      name: 'Order 1',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      number: 123,
      ingredients: ['bun-1', 'main-1', 'bun-1']
    };

    const state = orderReducer(
      { ...initialState, orderRequest: true },
      createOrder.fulfilled(order, 'request-id', undefined)
    );

    expect(state.orderRequest).toBe(false);
    expect(state.order).toEqual(order);
  });

  it('stores error and sets orderRequest=false on createOrder.rejected', () => {
    const state = orderReducer(
      { ...initialState, orderRequest: true },
      createOrder.rejected(new Error('fail'), 'request-id', undefined, 'Ошибка')
    );

    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Ошибка');
  });

  it('clears order and error on clearOrder', () => {
    const preloaded = {
      ...initialState,
      order: {
        _id: 'order-1',
        status: 'done',
        name: 'Order 1',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        number: 123,
        ingredients: []
      },
      error: 'err'
    };

    const state = orderReducer(preloaded, clearOrder());

    expect(state.order).toBeNull();
    expect(state.error).toBeNull();
  });
});
