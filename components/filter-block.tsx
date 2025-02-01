'use client';
import { cn } from '@/lib/utils';
import { PropsWithChildren, useState } from 'react';
import { CircleChevronRight, CircleChevronDown } from 'lucide-react';
const FilterBlock = ({
  headingText,
  value,
  children,
}: PropsWithChildren<{ headingText: string; value: string }>) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className='mb-3'>
      <FilterHeading
        text={headingText}
        isCollapsed={isCollapsed}
        value={value}
        onChangeCollapse={() => setIsCollapsed((p) => !p)}
      />
      {!isCollapsed && <div className='ml-2'>{children}</div>}
    </div>
  );
};

export default FilterBlock;

const FilterHeading = ({
  text,
  isCollapsed = false,
  value,
  className,
  onChangeCollapse,
}: {
  text: string;
  isCollapsed?: boolean;
  value?: string;
  className?: string;
  onChangeCollapse: () => void;
}) => {
  return (
    <div
      className={cn('text-xl mb-1 hover:cursor-pointer', className)}
      onClick={onChangeCollapse}
    >
      {isCollapsed ? (
        <CircleChevronRight className='inline-block' />
      ) : (
        <CircleChevronDown className='inline-block' />
      )}{' '}
      {text} {isCollapsed && ` (${value})`}
    </div>
  );
};
