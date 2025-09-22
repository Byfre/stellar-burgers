import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { TAppHeaderUIItem } from '../ui/app-header/type';
import {
  BurgerIcon,
  ListIcon,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { useSelector } from '../../services/store';

const items: TAppHeaderUIItem[] = [
  {
    label: 'Конструктор',
    href: '/',
    icon: <BurgerIcon type={'primary'} />
  },
  {
    label: 'Лента заказов',
    href: '/feed',
    icon: <ListIcon type={'primary'} />
  }
];

export const AppHeader: FC = () => {
  const user = useSelector((state) => state.user.user);
  return <AppHeaderUI userName={user?.name || ''} items={items} />;
};
