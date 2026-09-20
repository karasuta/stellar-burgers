import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  useSelector,
  useDispatch,
  selectFeedOrders,
  selectFeedLoading
} from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const loading = useSelector(selectFeedLoading);

  useEffect(() => {
    dispatch(fetchFeed())
      .unwrap()
      .catch((err) => {
        console.error(
          'Ошибка при загрузке ленты заказов:',
          err instanceof Error ? err.message : err
        );
      });
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }
  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() =>
        dispatch(fetchFeed())
          .unwrap()
          .catch((err) =>
            console.error(
              'Ошибка при повторной загрузке ленты:',
              err instanceof Error ? err.message : err
            )
          )
      }
    />
  );
};
