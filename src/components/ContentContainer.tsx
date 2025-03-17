import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = PropsWithChildren & {
  className?: string;
  'data-testid'?: string;
};

const ContentContainer = ({
  children,
  className = '',
  'data-testid': dataTestId,
}: Props) => (
  <div
    className={twMerge('overflow-hidden h-full', className)}
    data-testid={dataTestId}
  >
    {children}
  </div>
);

export default ContentContainer;
