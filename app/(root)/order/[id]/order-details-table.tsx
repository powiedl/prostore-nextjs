'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  createPayPalOrder,
  approvePayPalOrder,
  updateOrderToPaidCOD,
  deliverOrder,
} from '@/lib/actions/order.actions';
import { useToast } from '@/hooks/use-toast';
import ProductPrice from '@/components/shared/product/product-price';
import { useTransition } from 'react';
import StripePayment from './stripe-payment';

const MarkAsPaidButton = ({ orderId }: { orderId: string }) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  return (
    <Button
      type='button'
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await updateOrderToPaidCOD(orderId);
          toast({
            variant: res.success ? 'default' : 'destructive',
            description: res.message,
          });
        })
      }
    >
      {isPending ? 'processing ...' : 'Mark As Paid'}
    </Button>
  );
};

const MarkAsDeliveredButton = ({ orderId }: { orderId: string }) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  return (
    <Button
      type='button'
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await deliverOrder(orderId);
          toast({
            variant: res.success ? 'default' : 'destructive',
            description: res.message,
          });
        })
      }
    >
      {isPending ? 'processing ...' : 'Mark As Delivered'}
    </Button>
  );
};

const PrintLoadingState = () => {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  let status = '';
  if (isPending) {
    status = 'Loading PayPal...';
  } else if (isRejected) {
    status = 'Error Loading PayPal';
  }
  return status;
};

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Omit<Order, 'paymentResult'>;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) => {
  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;
  const { toast } = useToast();

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);
    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
    }
    return res.data;
  };
  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);

    toast({
      variant: res.success ? 'default' : 'destructive',
      description: res.message,
    });
  };
  return (
    <>
      <h1 className='py-4 text-2xl'>Order {formatId(id)}</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='col-span-2 space-y-4 overflow-x-auto'>
          <Card>
            <CardContent className='p-4 gap-4 flex flex-row justify-between'>
              <div>
                <h2 className='text-xl pb-4'>Payment Method</h2>
                <p className='mb-2'>{paymentMethod}</p>
                {isPaid ? (
                  <Badge variant='secondary'>
                    {' '}
                    Paid at {formatDateTime(paidAt!).dateTime}
                  </Badge>
                ) : (
                  <Badge variant='destructive'>Not paid</Badge>
                )}
              </div>
              {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                <MarkAsPaidButton orderId={order.id} />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4 gap-4 flex flex-row justify-between'>
              <div>
                <h2 className='text-xl pb-4'>Shipping Address</h2>
                <p>{shippingAddress.fullName}</p>
                <p>
                  {shippingAddress.streetAddress}, {shippingAddress.city}
                </p>
                <p className='mb-2'>
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
                {isDelivered ? (
                  <Badge variant='secondary'>
                    {' '}
                    Delivered at {formatDateTime(deliveredAt!).dateTime}
                  </Badge>
                ) : (
                  <Badge variant='destructive'>Not delivered</Badge>
                )}
              </div>
              {isAdmin && isPaid && !isDelivered && (
                <MarkAsDeliveredButton orderId={order.id} />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item </TableHead>
                    <TableHead>Quantity </TableHead>
                    <TableHead className='text-right'>Price </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug} className='text-base'>
                      <TableCell>
                        <Link href={`/product/{item.slug}`}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className='px-2'>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className='px-2'>{item.qty}</span>
                      </TableCell>
                      <TableCell>
                        <ProductPrice
                          value={Number(item.price)}
                          className='text-right text-base'
                        />
                        {/* <span className='text-right'>
                          {formatCurrency(item.price)}
                        </span> */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className='p-4 gap-4 space-y-4'>
              <div className='flex justify-between'>
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className='flex justify-between border-b-2 pb-2'>
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className='flex justify-between text-xl font-semibold'>
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              {/* PayPal Payment */}
              {!isPaid && paymentMethod === 'PayPal' && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      // onApprove={handleApprovePayPalOrder}
                      onApprove={(p) =>
                        handleApprovePayPalOrder(
                          p // as { orderID: string }
                        )
                      }
                    />
                  </PayPalScriptProvider>
                  <hr className='mt-6' />
                  <div>
                    <div className='flex flex-col gap-y-4'>
                      <h2 className='text-lg font-semibold mt-3'>
                        PayPal Sandbox User
                      </h2>
                      <div className='flex justify-between text-xs gap-4'>
                        <span>eMail</span>
                        <span>sb-47bsrv37187982@personal.example.com</span>
                      </div>
                      <div className='flex justify-between  text-xs gap-4'>
                        <span>Password</span>
                        <span>{'8"B$uU/.'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Stripe Payment */}
              {!isPaid && paymentMethod === 'Stripe' && stripeClientSecret && (
                <StripePayment
                  priceInCents={Number(order.totalPrice) * 100}
                  orderId={order.id}
                  clientSecret={stripeClientSecret}
                  userEmail={order?.user?.email || ''}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
