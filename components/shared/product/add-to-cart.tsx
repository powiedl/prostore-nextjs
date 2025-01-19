'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Loader } from 'lucide-react';
import { Cart, CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useTransition } from 'react';

type AddToCartProps = {
  cart?: Cart;
  item: CartItem;
  options?: {
    toast?: {
      success?: boolean;
      failure?: boolean;
    };
  };
};
const AddToCart = ({
  cart,
  item,
  options = { toast: { success: true, failure: true } },
}: AddToCartProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        //console.log('something went wrong');
        if (options?.toast?.failure)
          toast({ variant: 'destructive', description: res.message });
        return;
      }
      // handle success add to cart
      //console.log('nothing went wrong');
      if (options?.toast?.success)
        toast({
          description: res.message,
          action: (
            <ToastAction
              className='bg-primary text-white hover:bg-gray-800'
              altText='Go To Cart'
              onClick={() => router.push('/cart')}
            >
              Go To Cart
            </ToastAction>
          ),
        });
    });
  };
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (!res.success) {
        //console.log('something went wrong');
        if (options?.toast?.failure)
          toast({ variant: 'destructive', description: res.message });
        return;
      }
      // handle success add to cart
      //console.log('nothing went wrong');
      if (options?.toast?.success)
        toast({
          description: res.message,
          action: (
            <ToastAction
              className='bg-primary text-white hover:bg-gray-800'
              altText='Go To Cart'
              onClick={() => router.push('/cart')}
            >
              Go To Cart
            </ToastAction>
          ),
        });

      return;
    });
  };
  // check if item is in cart
  const existItem =
    cart && cart.items.find((el) => el.productId === item.productId);

  return existItem ? (
    <div>
      <Button
        type='button'
        variant='outline'
        onClick={handleRemoveFromCart}
        disabled={isPending}
      >
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Minus className='h-4 w-4' />
        )}
      </Button>
      <span className='px-2'>{existItem.qty}</span>
      <Button
        type='button'
        variant='outline'
        onClick={handleAddToCart}
        disabled={isPending}
      >
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Plus className='h-4 w-4' />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className='w-full'
      type='button'
      onClick={handleAddToCart}
      disabled={isPending}
    >
      {isPending ? (
        <Loader className='w-4 h-4 animate-spin' />
      ) : (
        <Plus className='h-4 w-4' />
      )}
      AddToCart
    </Button>
  );
};
export default AddToCart;
