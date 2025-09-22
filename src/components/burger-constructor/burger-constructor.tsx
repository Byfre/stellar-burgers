import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { clearOrderData, orderBurger } from '../../services/slices/order';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора  */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { constructorItems, orderModalData, isOrderRequesting } = useSelector(
    (state) => state.order
  );
  const isAuth = useSelector((state) => state.user.isAuth);

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || isOrderRequesting) return;
    const order = [];
    order.push(constructorItems.bun._id);
    constructorItems.ingredients.forEach((ingreient) => {
      order.push(ingreient._id);
    });
    order.push(constructorItems.bun._id);

    dispatch(orderBurger(order));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isOrderRequesting}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
