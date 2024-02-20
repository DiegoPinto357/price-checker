import type { PropsWithChildren } from 'react';

type Props = {
  variant: 'h1' | 'h2' | 'h3';
  className?: string;
};

const Typography = ({
  variant,
  children,
  className,
}: PropsWithChildren<Props>) => {
  switch (variant) {
    case 'h1':
      return <h1 className={`mb-4 text-2xl ${className}`}>{children}</h1>;

    case 'h2':
      return <h2 className={`mb-2 text-xl ${className}`}>{children}</h2>;

    case 'h3':
      return <h3 className={`mb-1 text-lg ${className}`}>{children}</h3>;
  }
};

export default Typography;
