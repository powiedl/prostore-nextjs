'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateOrderToPaid } from '@/lib/actions/order.actions';
import { formatError } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LocalhostMarkAsPaid = ({
  orderId,
  paymentIntentId,
  status,
  email_address,
  amount,
}: {
  orderId: string;
  paymentIntentId: string;
  status: string;
  email_address: string;
  amount: number;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleLocalhostMarkAsPaid = async () => {
    const paymentResult = {
      id: paymentIntentId,
      status,
      email_address,
      pricePaid: (amount / 100).toString(),
    };
    try {
      setIsSubmitting(true);
      await updateOrderToPaid({ orderId, paymentResult });
      toast({ description: 'Order marked as paid' });
      router.refresh();
    } catch (error) {
      toast({ variant: 'destructive', description: formatError(error) });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Button
      variant='destructive'
      onClick={handleLocalhostMarkAsPaid}
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Marking as paid ...' : 'Mark as Paid (DEVELOPMENT MODE)'}
    </Button>
  );
};
export default LocalhostMarkAsPaid;
