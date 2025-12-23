import { userReducer, getUser } from './userSlice';

import type { TUser } from '@utils-types';

describe('userSlice reducer', () => {
  const initialState = userReducer(undefined, { type: 'UNKNOWN' });

  it('sets isLoading=true on getUser.pending', () => {
    const state = userReducer(
      { ...initialState, error: 'prev error' },
      getUser.pending('request-id', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores user, sets isLoading=false and isAuthChecked=true on getUser.fulfilled', () => {
    const user: TUser = {
      email: 'test@example.com',
      name: 'Test'
    };

    const state = userReducer(
      { ...initialState, isLoading: true },
      getUser.fulfilled(user, 'request-id', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toEqual(user);
  });

  it('stores error, sets isLoading=false and isAuthChecked=true on getUser.rejected', () => {
    const state = userReducer(
      { ...initialState, isLoading: true },
      getUser.rejected(new Error('fail'), 'request-id', undefined, 'Ошибка')
    );

    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe('Ошибка');
  });
});
