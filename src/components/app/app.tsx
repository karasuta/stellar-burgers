import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { getUser } from '../../services/slices/userSlice';
import { getCookie } from '../../utils/cookie';
import {
  ConstructorPage,
  Feed,
  NotFound404,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@pages';
import { IngredientDetails, Modal, OrderInfo } from '@components';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { OnlyGuestRoute } from '../onlyGuestRoute';
import { ProtectedRoute } from '../protectedRoute';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    if (getCookie('accessToken')) {
      dispatch(getUser());
    }
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background ?? location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/ingredients/:id'
          element={
            <div className={`${styles.detailPageWrap} ${styles.detailHeader}`}>
              <h2 className={`text text_type_main-large ${styles.title}`}>
                Детали ингредиента
              </h2>
              <IngredientDetails />
            </div>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <div className={`${styles.detailPageWrap}`}>
              <h2
                className={`text text_type_digits-medium  ${styles.detailHeader}`}
              >
                #
                {String(Number(location.pathname.split('/').pop())).padStart(
                  6,
                  '0'
                )}
              </h2>
              <OrderInfo />
            </div>
          }
        />
        <Route path='/*' element={<NotFound404 />} />
        {/* для неавторизованных */}
        <Route element={<OnlyGuestRoute />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        {/* для авторизованных */}
        <Route element={<ProtectedRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route
            path='/profile/orders/:number'
            element={
              <div className={`${styles.detailPageWrap} `}>
                <h2
                  className={`text text_type_digits-medium ${styles.detailHeader}`}
                >
                  #
                  {String(Number(location.pathname.split('/').pop())).padStart(
                    6,
                    '0'
                  )}
                </h2>
                <OrderInfo />
              </div>
            }
          />
        </Route>
      </Routes>
      {/* модалки */}
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={() => navigate(-1)}>
                <span
                  className={`text text_type_digits-default ${styles.orderNumberModalLeft}`}
                >
                  #
                  {String(Number(location.pathname.split('/').pop())).padStart(
                    6,
                    '0'
                  )}
                </span>
                <OrderInfo />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal title='' onClose={() => navigate(-1)}>
                  <span
                    className={`text text_type_digits-default ${styles.orderNumberModalLeft}`}
                  >
                    #
                    {String(
                      Number(location.pathname.split('/').pop())
                    ).padStart(6, '0')}
                  </span>
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
