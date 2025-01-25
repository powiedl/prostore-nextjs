'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { formUrlQuery } from '@/lib/utils';
import {
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
} from 'lucide-react';
type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};
const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleClick = (btnType: string) => {
    let pageValue;
    switch (btnType) {
      case 'first':
        pageValue = 1;
        break;
      case 'prev':
        pageValue = Number(page) - 1;
        break;
      case 'next':
        pageValue = Number(page) + 1;
        break;
      case 'last':
        pageValue = totalPages;
        break;
      default:
        pageValue = 1;
    }
    //const pageValue = btnType === 'next' ? Number(page + 1) : Number(page) - 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    });
    router.push(newUrl);
  };

  return (
    <div className='flex gap-2'>
      <Button
        size='icon'
        variant='default'
        disabled={Number(page) <= 1}
        onClick={() => handleClick('first')}
      >
        <ChevronFirst />
      </Button>
      <Button
        size='icon'
        variant='default'
        disabled={Number(page) <= 1}
        onClick={() => handleClick('prev')}
      >
        <ChevronLeft />
      </Button>
      <div className='rounded-lg border-2 min-w-10 px-2 flex items-center justify-center text-lg'>
        {page || 1} / {totalPages}
      </div>
      <Button
        size='icon'
        variant='default'
        disabled={Number(page) >= totalPages}
        onClick={() => handleClick('next')}
      >
        <ChevronRight />
      </Button>
      <Button
        size='icon'
        variant='default'
        disabled={Number(page) >= totalPages}
        onClick={() => handleClick('last')}
      >
        <ChevronLast />
      </Button>
    </div>
  );
};
export default Pagination;
