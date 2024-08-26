import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { LuMenu } from 'react-icons/lu';
import { GoGear } from 'react-icons/go';

import type { View } from './types';

type Props = {
  onOpen: () => void;
  onSetView: (view: View) => void;
};

const Menu = ({ onOpen, onSetView }: Props) => {
  return (
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
          onSetView(key as View);
          onOpen();
        }}
      >
        <DropdownItem key="settings" startContent={<GoGear />}>
          Configurações
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default Menu;
