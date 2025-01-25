import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
import { ShippingAddress } from '@/types';
import OrderDetailsTable from './order-details-table';

export const metadata: Metadata = {
  title: 'Order Details',
};
const OrderPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();
  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress, // notwendig, weil shippingAddress ein JSONType von Prisma ist - und der nicht ohne weiteres einem ShippingAddress Attribut genügt
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
    />
  );
};
export default OrderPage;
