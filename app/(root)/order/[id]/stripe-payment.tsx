import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useTheme } from 'next-themes';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { SERVER_URL } from '@/lib/constants';

const StripeForm = ({
  priceInCents,
  userEmail,
  orderId,
}: {
  priceInCents: number;
  userEmail: string;
  orderId: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState(userEmail);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (stripe === null || elements === null || email === null) return;
    setIsLoading(true);
    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
        },
      })
      .then((o) => {
        console.log('stripe.confirmPayment.then,o', o);
      })
      .catch((error) => {
        if (
          error?.type === 'card_error' ||
          error?.type === 'validation_error'
        ) {
          setErrorMessage(error?.message ?? 'An unknown error occured');
        } else if (error) {
          setErrorMessage('An unknown error occured');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <div className='text-xl'>Stipe Checkout</div>
      {errorMessage && <div className='text-destructive'>{errorMessage}</div>}
      <PaymentElement />
      <LinkAuthenticationElement
        onChange={(e) => setEmail(e.value.email)}
        options={{ defaultValues: { email } }}
      />
      <Button
        className='w-full'
        size='lg'
        disabled={stripe === null || elements === null || isLoading}
      >
        {isLoading
          ? 'Purchasing...'
          : `Purchase ${formatCurrency(priceInCents / 100)}`}
      </Button>
    </form>
  );
};
const StripePayment = ({
  priceInCents,
  orderId,
  clientSecret,
  userEmail,
}: {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
  userEmail: string;
}) => {
  const { theme, systemTheme } = useTheme();
  const [stripePromise /*, setStripePromise*/] = useState(() =>
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
  );

  return (
    <Elements
      key={clientSecret}
      options={{
        clientSecret,
        appearance: {
          theme:
            theme === 'dark'
              ? 'night'
              : theme === 'light'
              ? 'stripe'
              : systemTheme === 'light'
              ? 'stripe'
              : 'night',
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm
        priceInCents={priceInCents}
        userEmail={userEmail}
        orderId={orderId}
      />
    </Elements>
  );
};
export default StripePayment;
