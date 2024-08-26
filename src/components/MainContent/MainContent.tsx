import { PropsWithChildren, useState } from 'react';
import { useDisclosure } from '@nextui-org/react';
import Typography from '../lib/Typography';
import Menu from './Menu';
import ContentModal from './ContentModal';

import type { View } from './types';

type Props = PropsWithChildren & {
  title: string;
};

const MainContent = ({ title, children }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [view, setView] = useState<View>('settings');

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex gap-3 mx-4">
        <Menu onOpen={onOpen} onSetView={setView} />
        <Typography variant="h1">{title}</Typography>
      </div>

      {children}

      <ContentModal view={view} isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default MainContent;
