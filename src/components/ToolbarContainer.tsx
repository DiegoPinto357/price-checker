import { PropsWithChildren } from 'react';
import Menu from './Menu';
import Typography from './lib/Typography';

type Props = PropsWithChildren & {
  title: string;
};

const ToolbarContainer = ({ title, children }: Props) => (
  <div className="flex gap-3 mx-4">
    <div className="flex gap-3 w-full">
      <Menu />
      <Typography variant="h1">{title}</Typography>
    </div>
    <div className="flex gap-2">{children}</div>
  </div>
);

export default ToolbarContainer;
