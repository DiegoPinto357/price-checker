import type { ReactNode } from 'react';

type Props = {
  variant: 'h1' | 'h2';
  children: ReactNode;
};

const Typography = ({ variant, children }: Props) => {
  switch (variant) {
    case 'h1':
      return <h1 className="mb-4 text-2xl">{children}</h1>;

    case 'h2':
      return <h2 className="mb-2 text-xl">{children}</h2>;
  }
};

export default Typography;
