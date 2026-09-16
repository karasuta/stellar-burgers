import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {
  useSelector,
  // selectIngredientById,
  selectIngredientsItems
} from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  // if (!id) {
  //   return <Preloader />;
  // }
  const items = useSelector(selectIngredientsItems);

  /** TODO: взять переменную из стора */
  // const ingredientData = useSelector((state) =>
  //   selectIngredientById(state, id)
  // );
  const ingredientData = items.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
