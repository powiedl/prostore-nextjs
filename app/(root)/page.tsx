import ProductList from '@/components/shared/product/product-list';
import {
  getLatestProducts,
  getFeaturedProducts,
} from '@/lib/actions/products.actions';
import ProductCarousel from '@/components/shared/product/product-carousel';
import ViewAllProductsButton from '@/components/view-all-products-button';

//const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  //  await delay(2000);
  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts} title='Newest Arrivals' />
      <ViewAllProductsButton />
    </>
  );
};
export default Homepage;
