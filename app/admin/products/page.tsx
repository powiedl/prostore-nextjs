import { Metadata } from 'next';
import Link from 'next/link';
import { deleteProduct, getAllProducts } from '@/lib/actions/products.actions';
import { formatCurrency, formatId } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/shared/pagination';
import DeleteDialog from '@/components/shared/delete-dialog';

export const metadata: Metadata = {
  title: 'Admin Products',
};
const AdminProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) => {
  const { page = '1', query = '', category = '' } = await searchParams;

  const products = await getAllProducts({
    query,
    page: Number(page),
    category,
  });
  return (
    <div className='space-y-2'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
          <h1 className='h2-bold'>Products</h1>
          {query && (
            <div>
              Filtered by <i>&quot;{query}&quot;</i>{' '}
              <Link href='/admin/products'>
                <Button variant='outline' size='sm'>
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button asChild variant='default'>
          <Link href='/admin/products/create'>Create Product</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className='text-right'>PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className='w-[100px]'>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((p) => (
            <TableRow key={p.id} className='text-base'>
              <TableCell>{formatId(p.id)}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell className='text-right'>
                {formatCurrency(p.price)}
              </TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>{p.rating}</TableCell>
              <TableCell className='flex gap-1'>
                <Button asChild variant='outline' size='sm'>
                  <Link href={`/admin/products/${p.id}`}>Edit</Link>
                </Button>
                {/* DELETE */}
                <DeleteDialog id={p.id} action={deleteProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {products?.totalPages > 1 && (
        <Pagination page={page} totalPages={products.totalPages} />
      )}
    </div>
  );
};
export default AdminProductsPage;
