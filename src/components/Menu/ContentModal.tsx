import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import Typography from '../lib/Typography';
import Settings from '../Settings';

import type { View } from './types';

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

const renderView = (view: View) => {
  const View = viewByMenuKey[view].component;
  return <View />;
};

type Props = {
  view: View;
  isOpen: boolean;
  onClose: () => void;
};

const ContentModal = ({ view, isOpen, onClose }: Props) => {
  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <Typography variant="h1" className="mb-0">
                {viewByMenuKey[view].title}
              </Typography>
            </ModalHeader>
            <ModalBody>{renderView(view)}</ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Ok
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ContentModal;
