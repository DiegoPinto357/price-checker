import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Button,
  Modal,
  Input,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';

import type { KeyboardEvent } from 'react';

type Props = {
  isOpen: boolean;
  title: string;
  inputLabel: string;
  onClose: (value?: string) => void;
};

const TextInputModal = ({ isOpen, title, inputLabel, onClose }: Props) => {
  const [value, setValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleInputKeyPress = useCallback(
    (e: KeyboardEvent) => {
      console.log('handleInputKeyPress');
      if (e.key === 'Enter') {
        onClose(value);
      }
    },
    [onClose, value]
  );

  console.log({ isOpen });

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          console.log('on close');
          return onClose();
        }}
      >
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            <Input
              data-testid="edit-item-input"
              ref={inputRef}
              type="text"
              label={inputLabel}
              isClearable
              labelPlacement="outside"
              variant="bordered"
              value={value}
              onValueChange={setValue}
              onKeyDown={handleInputKeyPress}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" variant="light" onPress={() => onClose()}>
              Cancelar
            </Button>

            <Button color="primary" onPress={() => onClose(value)}>
              Ok
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TextInputModal;
