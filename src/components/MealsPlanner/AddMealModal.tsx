import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';

import type { KeyboardEvent } from 'react';

type Props = {
  isOpen: boolean;
  onClose: (mealName?: string) => void;
};

const AddMealModal = ({ isOpen, onClose }: Props) => {
  const [mealNameValue, setMealNameValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleInputKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onClose(mealNameValue);
      }
    },
    [mealNameValue, onClose]
  );

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalContent>
        <ModalHeader>Adicionar item</ModalHeader>
        <ModalBody>
          <Input
            data-testid="item-name-input"
            ref={inputRef}
            type="text"
            label="Nome"
            isClearable
            labelPlacement="outside"
            variant="bordered"
            value={mealNameValue}
            onValueChange={setMealNameValue}
            onKeyDown={handleInputKeyPress}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="light" onPress={() => onClose()}>
            Cancelar
          </Button>

          <Button color="primary" onPress={() => onClose(mealNameValue)}>
            Adicionar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddMealModal;
