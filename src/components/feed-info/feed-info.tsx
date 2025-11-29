import { FC } from 'react';

import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';
import {
  selectFeedOrders,
  selectFeedTotals
} from '../../services/selectors/feed';

const getOrdersNumbersByStatus = (
  statusOrders: string,
  orders: ReturnType<typeof selectFeedOrders>
): number[] =>
  orders
    .filter((order) => order.status === statusOrders)
    .map((order) => order.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useSelector(selectFeedOrders);
  const feedTotals = useSelector(selectFeedTotals);

  const readyOrders = getOrdersNumbersByStatus('done', orders);
  const pendingOrders = getOrdersNumbersByStatus('pending', orders);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feedTotals}
    />
  );
};
