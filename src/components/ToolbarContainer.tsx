import { PropsWithChildren } from 'react';
import Menu from './MainContainer/Menu';
import Typography from './lib/Typography';

type Props = PropsWithChildren & {
  title: string;
};

const ToolbarContainer = ({ title, children }: Props) => (
  <div className="flex gap-3 mx-4">
    <Menu />
    <Typography variant="h1">{title}</Typography>
    {children}
  </div>
);

export default ToolbarContainer;
