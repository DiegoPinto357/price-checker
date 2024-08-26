import { PropsWithChildren, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import { LuMenu } from 'react-icons/lu';
import { GoGear } from 'react-icons/go';
import Typography from '../lib/Typography';
import Settings from '../Settings';

type View = 'settings';

type ModalEntry = {
  title: string;
  component: () => JSX.Element;
};

const viewByMenuKey: Record<View, ModalEntry> = {
  settings: {
    title: 'Configurações',
    component: Settings,
  },
};

type Props = PropsWithChildren & {
  title: string;
};

const MainContent = ({ title, children }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [view, setView] = useState<View>('settings');

  const renderView = () => {
    const View = viewByMenuKey[view].component;
    return <View />;
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex gap-3 mx-4">
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

        <Typography variant="h1">{title}</Typography>
      </div>

      {children}

      <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <Typography variant="h1" className="mb-0">
                  {viewByMenuKey[view].title}
                </Typography>
              </ModalHeader>
              <ModalBody>{renderView()}</ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Ok
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MainContent;
