import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredientById } from '../../services/slices/ingredients';
import { Modal } from '../modal';

export const IngredientDetails: FC = () => {
  /** TODO: загружать данные ингредиентов */
  const { id } = useParams();
  const ingredientData = useSelector(getIngredientById(id));
  const navigate = useNavigate();
  const location = useLocation();

  if (!ingredientData) {
    return <Preloader />;
  }

  if (!location.state?.background) {
    return <IngredientDetailsUI ingredientData={ingredientData} />;
  }
  return (
    <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </Modal>
  );
};
