import { cn, formatNumberWithDecimal } from '@/lib/utils';
import { format } from '@/lib/format';
const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  //console.log(typeof value);

  const stringValue = formatNumberWithDecimal(value);
  const [intValue, floatValue] = stringValue.split('.');
  return (
    <p className={cn('text-2xl', className)}>
      <span className='text-xs align-super'>$</span>
      {intValue}
      <span className='text-xs align-super'>
        {format.decimal}
        {floatValue}
      </span>
    </p>
  );
};
export default ProductPrice;
