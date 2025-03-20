import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from '@heroui/react';

export type ConfirmDialogUserAction = 'close' | 'cancel' | 'accept';

type Props = {
  title: string;
  isOpen: boolean;
  onClose: (userAction: ConfirmDialogUserAction) => void;
};

const ConfirmDialog = ({ title, isOpen, onClose }: Props) => (
  <Modal isOpen={isOpen} onClose={() => onClose('close')}>
    <ModalContent>
      <ModalHeader>{title}</ModalHeader>
      <ModalFooter>
        <Button
          color="primary"
          variant="light"
          onPress={() => onClose('cancel')}
        >
          Cancelar
        </Button>
        <Button color="primary" onPress={() => onClose('accept')}>
          Ok
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ConfirmDialog;
