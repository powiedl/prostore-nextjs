import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOrderSummary } from '@/lib/actions/order.actions';
import { formatCurrency, formatDateTime, formatNumber } from '@/lib/utils';
import { BadgeDollarSign, Barcode, CreditCard, Users } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
export const metadata: Metadata = {
  title: 'Admin Dashboard',
};
import Charts from './charts';

const AdminOverviewPage = async () => {
  const session = await auth();

  if (session?.user?.role !== 'admin')
    throw new Error('User is not authorized');
  const summary = await getOrderSummary();

  return (
    <div className='space-y-2'>
      <h1 className='h2-bold'>Dashboard</h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Link
          href='/admin/orders'
          className='text-sm font-medium transition-colors'
        >
          <InfoCard title='Total Revenue' icon={<BadgeDollarSign />}>
            <div className='text-2xl font-bold'>
              {formatCurrency(summary.totalSales._sum.totalPrice)}
            </div>
          </InfoCard>
        </Link>
        <Link
          href='/admin/orders'
          className='text-sm font-medium transition-colors'
        >
          <InfoCard title='Sales' icon={<CreditCard />}>
            <div className='text-2xl font-bold'>
              {formatNumber(summary.ordersCount)}
            </div>
          </InfoCard>
        </Link>
        <Link
          href='/admin/users'
          className='text-sm font-medium transition-colors'
        >
          <InfoCard title='Customers' icon={<Users />}>
            <div className='text-2xl font-bold'>
              {formatNumber(summary.usersCount)}
            </div>
          </InfoCard>
        </Link>
        <Link
          href='/admin/products'
          className='text-sm font-medium transition-colors'
        >
          <InfoCard title='Products' icon={<Barcode />}>
            <div className='text-2xl font-bold'>
              {formatNumber(summary.productsCount)}
            </div>
          </InfoCard>
        </Link>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts data={{ salesData: summary.salesData }} />
          </CardContent>
        </Card>
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BUYER</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead className='text-right'>TOTAL</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.user?.name ? order.user.name : 'Deleted User'}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(order.createdAt).dateOnly}
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatCurrency(order.totalPrice)}
                    </TableCell>
                    <TableCell>
                      <Link href={`/order/${order.id}`}>Details</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const InfoCard = ({
  title,
  icon,
  children,
}: PropsWithChildren<{
  title: string;
  icon: React.ReactNode;
}>) => {
  return (
    <Card className='hover:cursor-pointer hover:scale-95 hover:bg-muted'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
export default AdminOverviewPage;
