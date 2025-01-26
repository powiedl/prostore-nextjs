import { Metadata } from 'next';
import { getMyOrders } from '@/lib/actions/order.actions';
import { OrdersTableDataType } from '@/types';
import OrderTable from '@/components/shared/order/order-table';
export const metadata: Metadata = {
  title: 'My Orders',
};

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await searchParams;
  const orders: { data: OrdersTableDataType[]; totalPages: number } =
    await getMyOrders({
      page: Number(page) || 1,
    });
  return <OrderTable orders={orders} page={Number(page)} />;
};
export default OrdersPage;
