import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrderSummary } from '@/lib/actions/order.actions';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { BadgeDollarSign, CreditCard } from 'lucide-react';
import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

const AdminOverviewPage = async () => {
  const session = await auth();

  if (session?.user?.role !== 'admin')
    throw new Error('User is not authorized');
  const summary = await getOrderSummary();
  console.log(summary);
  console.log(
    summary?.totalSales?._sum?.totalPrice,
    typeof summary?.totalSales?._sum?.totalPrice
  );

  return (
    <div className='space-y-2'>
      <h1 className='h2-bold'>Dashboard</h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <InfoCard title='Total Revenue' icon={<BadgeDollarSign />}>
          <div className='text-2xl font-bold'>
            {formatCurrency(summary.totalSales._sum.totalPrice)}
          </div>
        </InfoCard>
        <InfoCard title='Sales' icon={<CreditCard />}>
          <div className='text-2xl font-bold'>
            {formatNumber(summary.ordersCount)}
          </div>
        </InfoCard>
      </div>
    </div>
  );
};

const InfoCard = ({
  title,
  icon,
  children,
}: PropsWithChildren<{ title: string; icon: React.ReactNode }>) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
export default AdminOverviewPage;
