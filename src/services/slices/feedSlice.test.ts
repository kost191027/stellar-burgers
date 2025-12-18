import { feedReducer, fetchFeed } from './feedSlice';

import type { TOrdersData } from '@utils-types';

describe('feedSlice reducer', () => {
  const initialState = feedReducer(undefined, { type: 'UNKNOWN' });

  it('sets isLoading=true on fetchFeed.pending', () => {
    const state = feedReducer(
      { ...initialState, error: 'prev error' },
      fetchFeed.pending('request-id', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores feed data and sets isLoading=false on fetchFeed.fulfilled', () => {
    const payload: TOrdersData = {
      orders: [
        {
          _id: 'order-1',
          status: 'done',
          name: 'Order 1',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
          number: 1,
          ingredients: ['ing-1']
        }
      ],
      total: 10,
      totalToday: 3
    };

    const state = feedReducer(
      { ...initialState, isLoading: true },
      fetchFeed.fulfilled(payload, 'request-id', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(payload.orders);
    expect(state.total).toBe(payload.total);
    expect(state.totalToday).toBe(payload.totalToday);
  });

  it('stores error and sets isLoading=false on fetchFeed.rejected', () => {
    const state = feedReducer(
      { ...initialState, isLoading: true },
      fetchFeed.rejected(new Error('fail'), 'request-id', undefined, 'Ошибка')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
