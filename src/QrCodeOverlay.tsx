import { Button } from '@nextui-org/react';

interface QrCodeOverlayProps {
  onCloseButtonClick: () => void;
}

const QrCodeOverlay = ({ onCloseButtonClick }: QrCodeOverlayProps) => {
  return (
    <div style={{ position: 'relative' }}>
      <Button
        style={{ position: 'absolute', zIndex: 100 }}
        onPress={onCloseButtonClick}
      >
        Close
      </Button>
    </div>
  );
};

export default QrCodeOverlay;
