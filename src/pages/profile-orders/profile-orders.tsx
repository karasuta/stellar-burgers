import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  useDispatch,
  useSelector,
  selectUserOrders,
  selectIsLoadingOrders,
  selectErrorOrders
} from '../../services/store';
import { fetchUserOrders } from '../../services/slices/userSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectUserOrders);
  const isLoading = useSelector(selectIsLoadingOrders);
  const error = useSelector(selectErrorOrders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
