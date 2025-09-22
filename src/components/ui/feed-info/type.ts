import { TOrder } from '@utils-types';

export type TFeedInfo = {
  total: number;
  totalToday: number;
  isLoading?: boolean;
  error?: string | null;
  orders?: TOrder[];
};

export type FeedInfoUIProps = {
  feed: TFeedInfo;
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
