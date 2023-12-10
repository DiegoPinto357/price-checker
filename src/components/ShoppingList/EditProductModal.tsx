import { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';

export type ItemEdit = {
  name: string;
  newName?: string;
};

type Props = {
  isOpen: boolean;
  itemName: string;
  onClose: (itemData?: ItemEdit) => void;
};

const EditProductModal = ({ isOpen, itemName, onClose }: Props) => {
  const [itemNameValue, setItemNameValue] = useState<string>('');

  useEffect(() => {
    setItemNameValue(itemName);
  }, [itemName]);

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalContent>
        <ModalHeader>Editar item</ModalHeader>
        <ModalBody>
          <Input
            data-testid="edit-item-input"
            type="text"
            label="Nome"
            isClearable
            value={itemNameValue}
            onValueChange={setItemNameValue}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="light" onPress={() => onClose()}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={() => onClose({ name: itemName, newName: itemNameValue })}
          >
            Ok
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProductModal;
