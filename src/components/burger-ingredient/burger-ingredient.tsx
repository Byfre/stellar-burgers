import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addBun, addIngredient } from '../../services/slices/order';
import { TConstructorIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();

    const dispatch = useDispatch();

    const handleAdd = () => {
      const timestamp = Date.now();
      const ingredientWithId: TConstructorIngredient = {
        ...ingredient,
        id:
          ingredient.type === 'bun'
            ? `bun-${timestamp}`
            : `${ingredient._id}-${timestamp}`
      };

      ingredient.type === 'bun'
        ? dispatch(addBun(ingredientWithId))
        : dispatch(addIngredient(ingredientWithId));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
