import { twMerge } from 'tailwind-merge';

import type { PropsWithChildren } from 'react';

type Props = {
  variant: 'h1' | 'h2' | 'h3' | 'h4';
  id?: string;
  className?: string;
};

const Typography = ({
  variant,
  children,
  className,
  ...rest
}: PropsWithChildren<Props>) => {
  switch (variant) {
    case 'h1':
      return (
        <h1
          className={twMerge('mb-4 text-2xl font-medium', className)}
          {...rest}
        >
          {children}
        </h1>
      );

    case 'h2':
      return (
        <h2 className={twMerge('mb-2 text-xl', className)} {...rest}>
          {children}
        </h2>
      );

    case 'h3':
      return (
        <h3 className={twMerge('mb-1 text-lg', className)} {...rest}>
          {children}
        </h3>
      );

    case 'h4':
      return (
        <h4 className={twMerge('mb-0.5 text-md', className)} {...rest}>
          {children}
        </h4>
      );
  }
};

export default Typography;
