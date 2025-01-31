// wird derzeit nicht verwendet
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import Link from 'next/link';
import Pagination from '../pagination';
import { OrdersTableDataType } from '@/types';
import DeleteDialog from '@/components/shared/delete-dialog';
import { Button } from '@/components/ui/button';
import { deleteOrder } from '@/lib/actions/order.actions';

const OrderTable = ({
  orders,
  page,
  withDelete = false,
  query,
}: {
  orders: { data: OrdersTableDataType[]; totalPages: number };
  page?: number;
  withDelete?: boolean;
  query?: string;
}) => {
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-3'>
        <h2 className='h2-bold'>Orders</h2>
        {withDelete && query && (
          <div>
            Filtered by <i>&quot;{query}&quot;</i>{' '}
            <Link href='/admin/orders'>
              <Button variant='outline' size='sm'>
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              {withDelete && <TableHead>BUYER</TableHead>}
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                {withDelete && <TableCell>{order?.user?.name || ''}</TableCell>}
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'Not Paid'}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'Not Delivered'}
                </TableCell>
                <TableCell>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>
                  {withDelete && (
                    <DeleteDialog id={order.id} action={deleteOrder} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={orders.totalPages} />
        )}
      </div>
    </div>
  );
};
export default OrderTable;
