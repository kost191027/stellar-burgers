import React, { FC, useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIsAuthenticated,
  selectIsAuthChecked
} from '../../services/selectors/user';
import { getUser } from '../../services/slices/userSlice';

import '../../index.css';
import styles from './app.module.css';

type TProtectedRouteProps = {
  element: JSX.Element;
  /**
   * Роут только для неавторизованных пользователей
   * (например, /login, /register, /forgot-password, /reset-password)
   */
  onlyUnAuth?: boolean;
};

const ProtectedRouteElement: FC<TProtectedRouteProps> = ({
  element,
  onlyUnAuth
}) => {
  const isAuth = useSelector(selectIsAuthenticated);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return (
      <div className='mt-30' style={{ textAlign: 'center' }}>
        <Preloader />
      </div>
    );
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuth) {
    return <Navigate to='/' replace />;
  }

  return element;
};

const App: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Глобальная инициализация ингредиентов, чтобы модалки сработали на любой странице
  useEffect(() => {
    // Ленивая подгрузка: импортируем здесь, чтобы избежать циклических зависимостей
    // и не тянуть thunk в бандл дважды
    import('../../services/slices/ingredientsSlice').then(
      ({ fetchIngredients }) => {
        dispatch(fetchIngredients());
      }
    );
  }, [dispatch]);

  const state = location.state as
    | { backgroundLocation?: Location; background?: Location }
    | undefined;
  const backgroundLocation = state?.backgroundLocation || state?.background;

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRouteElement element={<OrderInfo />} />}
        />

        <Route
          path='/login'
          element={<ProtectedRouteElement onlyUnAuth element={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRouteElement onlyUnAuth element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRouteElement onlyUnAuth element={<ForgotPassword />} />
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRouteElement onlyUnAuth element={<ResetPassword />} />
          }
        />

        <Route
          path='/profile'
          element={<ProtectedRouteElement element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRouteElement element={<ProfileOrders />} />}
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRouteElement
                element={
                  <Modal title='' onClose={handleCloseModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
