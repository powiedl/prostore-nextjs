import NotFound from '@/app/not-found';
import ProductForm from '@/components/admin/product.fom';
import { getProductById } from '@/lib/actions/products.actions';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Update Product',
};
const AdminProductUpdatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return NotFound();
  return (
    <div className='space-y-8 max-w-5xl mx-auto'>
      <h1 className='h2-bold'>Update Product</h1>
      <ProductForm type='Update' product={product} productId={product.id} />
    </div>
  );
};
export default AdminProductUpdatePage;
