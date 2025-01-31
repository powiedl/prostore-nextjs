import { auth } from '@/auth';
import { Metadata } from 'next';
import { getAllOrders } from '@/lib/actions/order.actions';
import OrderTable from '@/components/shared/order/order-table';
export const metadata: Metadata = {
  title: 'Admin Orders',
};
const AdminOrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  const { page = '1', query } = await searchParams;
  const session = await auth();
  if (session?.user?.role !== 'admin')
    throw new Error('User is not authorized');
  const orders = await getAllOrders({
    page: Number(page),
    query,
  });
  //console.log(orders);
  return (
    <OrderTable
      orders={orders}
      page={Number(page)}
      withDelete={true}
      query={query}
    />
  );
};
export default AdminOrdersPage;
