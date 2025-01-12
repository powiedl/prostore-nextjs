import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/products.actions';

//const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  //  await delay(2000);
  return (
    <>
      <ProductList data={latestProducts} title='Newest Arrivals' />
    </>
  );
};
export default Homepage;
