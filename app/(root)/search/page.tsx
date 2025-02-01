import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import {
  getAllProducts,
  getAllCategories,
} from '@/lib/actions/products.actions';
import { Product } from '@/types';
import Link from 'next/link';
import FilterBlock from '@/components/filter-block';
import Pagination from '@/components/shared/pagination';
import { redirect } from 'next/navigation';

const prices = [
  { label: '$1 to $50', value: '1-50' },
  { label: '$51 to $100', value: '51-100' },
  { label: '$101 to $200', value: '101-200' },
  { label: '$201 to $501', value: '201-500' },
  { label: '$501 to $1000', value: '501-1000' },
];

const ratings = [4, 3, 2, 1];

const sortOrders = ['newest', 'lowest', 'highest', 'rating'];

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
  } = await searchParams;

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet =
    category && category !== 'all' && category.trim() !== '';
  const isPriceSet = price && price !== 'all' && price.trim() !== '';
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `Search ${isQuerySet ? q : ''} 
      ${isCategorySet ? `: Category ${category}` : ''}
      ${isPriceSet ? `: Price ${price}` : ''}
      ${isRatingSet ? `: Rating ${rating}` : ''}`,
    };
  } else {
    return {
      title: 'Search Products',
    };
  }

  return {
    title: 'Search',
  };
}

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  // construct filter url
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    return `/search?${new URLSearchParams(params).toString()}`;
  };
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await searchParams;

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });
  if (products.filteredPages < Number(page) && products.filteredCount > 0) {
    redirect(
      getFilterUrl({ c: category, s: sort, p: price, r: rating, pg: '1' })
    );
  }
  const categories = await getAllCategories();
  const filteredPages = products.filteredPages;
  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      <div className='filter-links'>
        {/* Category links */}
        <FilterBlock headingText='Department' value={category}>
          <div className='mb-3'>
            <ul className='space-y-1'>
              <li className='ml-2'>
                <Link
                  className={`${
                    (category === 'all' || category === '') && 'font-bold'
                  }`}
                  href={getFilterUrl({ c: 'all' })}
                >
                  Any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.category} className='ml-2'>
                  <Link
                    className={`${category === c.category && 'font-bold'} `}
                    href={getFilterUrl({ c: c.category })}
                  >
                    {c.category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </FilterBlock>
        <FilterBlock headingText='Price' value={price}>
          <ul className='space-y-1'>
            <li className='ml-2'>
              <Link
                className={`${
                  (price === 'all' || price === '') && 'font-bold'
                }`}
                href={getFilterUrl({ p: 'all' })}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value} className='ml-2'>
                <Link
                  className={`${price === p.value && 'font-bold'} `}
                  href={getFilterUrl({ p: p.value })}
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </FilterBlock>
        <FilterBlock headingText='Rating' value={rating}>
          <ul className='space-y-1'>
            <li className='ml-2'>
              <Link
                className={`${
                  (rating === 'all' || rating === '') && 'font-bold'
                }`}
                href={getFilterUrl({ r: 'all' })}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r} className='ml-2'>
                <Link
                  className={`${Number(rating) === r && 'font-bold'} `}
                  href={getFilterUrl({ r: r.toString() })}
                >
                  {`${r} stars & up`}
                </Link>
              </li>
            ))}
          </ul>
        </FilterBlock>
      </div>
      <div className='space-y-4 md:col-span-4'>
        <div className='flex-between flex-col md:flex-row my-4'>
          <div className='flex items-center gap-2 text-sm'>
            {q !== 'all' && q !== '' && <span>{'Query: ' + q}</span>}
            {category !== 'all' && category !== '' && (
              <span>{'Category: ' + category}</span>
            )}
            {price !== 'all' && price !== '' && (
              <span>{'Price: ' + price}</span>
            )}
            {rating !== 'all' && rating !== '' && (
              <span>{'Rating: ' + rating + ' stars & up'}</span>
            )}
            &nbsp;
            {(q !== 'all' && q !== '') ||
            (category !== 'all' && category !== '') ||
            (price !== 'all' && price !== '') ||
            (rating !== 'all' && rating !== '') ? (
              <Button variant='outline' asChild className='text-md'>
                <Link href='/search'>Clear</Link>
              </Button>
            ) : null}
          </div>
          <div className='text-sm'>
            Sort by{' '}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-1 ${sort === s ? 'font-bold' : ''}`}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {products.data.length === 0 && <div>No products found</div>}
          {products.data.map((p: Product) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {filteredPages > 1 && (
          <Pagination page={page} totalPages={filteredPages} />
        )}
      </div>
    </div>
  );
};
export default SearchPage;
