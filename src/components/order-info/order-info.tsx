import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchOrderByNumber, selectOrder } from '../../services/slices/feed';
import { Modal } from '../modal';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const orders = useSelector((state) => state.feed.orders);
  const ingredients = useSelector((state) => state.ingredients.data);
  const userOrders = useSelector((state) => state.userOrders.orders);
  const orderData = useSelector((state) => state.feed.selectedOrder);
  const isSelectedOrderLoading = useSelector(
    (state) => state.feed.isSelectedOrderLoading
  );

  // Получаем из url
  const { id } = useParams<{ id: string }>();
  // Преобразуем в число
  const orderNumber = id ? parseInt(id) : null;

  // Ищем заказ либо в общих заказах, либо в заказах пользователя

  // Сначала ищем в общих заказах
  const orderFromFeed = orders.find((order) => order.number === orderNumber);
  if (orderFromFeed) {
    dispatch(selectOrder(orderFromFeed));
  }
  // Если не нашли, ищем в заказах пользователя
  const orderFromUser = userOrders.find(
    (order) => order.number === orderNumber
  );
  if (orderFromUser) {
    dispatch(selectOrder(orderFromUser));
  }
  if (!orderData && orderNumber) {
    dispatch(fetchOrderByNumber(orderNumber));
  }

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  if (!location.state?.background) {
    return <OrderInfoUI orderInfo={orderInfo} />;
  }

  return (
    <Modal title='Детали заказа' onClose={() => navigate(-1)}>
      <OrderInfoUI orderInfo={orderInfo} />
    </Modal>
  );
};
