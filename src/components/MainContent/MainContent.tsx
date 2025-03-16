import { PropsWithChildren } from 'react';

import Typography from '../lib/Typography';
import Menu from './Menu';

type Props = PropsWithChildren & {
  title: string;
};

const MainContent = ({ title, children }: Props) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex gap-3 mx-4">
        <Menu />
        <Typography variant="h1">{title}</Typography>
      </div>

      <div className="overflow-hidden h-full">{children}</div>
    </div>
  );
};

export default MainContent;
