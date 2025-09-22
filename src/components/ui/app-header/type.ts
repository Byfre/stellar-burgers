import { ReactNode } from 'react';
export type TAppHeaderUIItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

export type TAppHeaderUIProps = {
  userName: string | undefined;
  items: TAppHeaderUIItem[];
};
