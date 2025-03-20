import { useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from '@heroui/react';
import { LuMenu } from 'react-icons/lu';
import { GoGear } from 'react-icons/go';
import ContentModal from './ContentModal';

import type { View } from './types';

const Menu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [view, setView] = useState<View>('settings');

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button aria-label="menu" variant="light" size="sm" isIconOnly>
            <LuMenu className="w-7 h-7 text-gray-600" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="menu actions"
          variant="bordered"
          onAction={key => {
            setView(key as View);
            onOpen();
          }}
        >
          <DropdownItem key="settings" startContent={<GoGear />}>
            Configurações
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <ContentModal view={view} isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Menu;
