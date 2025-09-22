import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { fetchOrders } from '../../services/slices/feed';
import { useDispatch } from '../../services/store';
import { useSelector } from '../../services/store';
import { useEffect } from 'react';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const { orders } = useSelector((state) => state.feed);

  const dispatch = useDispatch();
  // const orders: TOrder[] = [];
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchOrders())} />
  );
};
