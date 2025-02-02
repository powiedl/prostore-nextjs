import { Button } from '@/components/ui/button';
import { getOrderById } from '@/lib/actions/order.actions';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Stripe from 'stripe';
import { SERVER_URL } from '@/lib/constants';
import LocalhostMarkAsPaid from './localhost-mark-as-paid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const StripePaymentSuccessPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string; redirect_status: string }>;
}) => {
  const { id } = await params;
  const { payment_intent: paymentIntentId, redirect_status: status } =
    await searchParams;

  // fetch the order
  const order = await getOrderById(id);
  if (!order) notFound();

  // retrieve the payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  // check if payment intent is valid
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    return notFound();
  }

  // check if payment is successful
  const isSuccess = paymentIntent.status === 'succeeded';
  if (!isSuccess) return redirect(`/order/${id}`);

  return (
    <div className='max-w-4xl w-full mx-auto space-y-8'>
      <div className='flex flex-col gap-6 items-center'>
        <h1 className='h1-bold'>Thanks for your purchase</h1>
        <div>We are processing your order.</div>
        <Button asChild>
          <Link href={`/order/${id}`}>View Order</Link>
        </Button>
        {SERVER_URL.indexOf('http://localhost') > -1 && !order.isPaid && (
          <LocalhostMarkAsPaid
            orderId={order.id}
            paymentIntentId={paymentIntentId}
            status={status}
            email_address={order?.user?.email || 'unknown@unknown.local'}
            amount={paymentIntent.amount}
          />
        )}
      </div>
    </div>
  );
};
export default StripePaymentSuccessPage;
