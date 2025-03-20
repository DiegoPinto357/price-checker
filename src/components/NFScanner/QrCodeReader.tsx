import { useCallback, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Button } from '@heroui/react';
import { IoClose } from 'react-icons/io5';

export interface QrCodeReaderProps {
  onClose: (data?: string) => void;
}

const QrCodeReader = ({ onClose }: QrCodeReaderProps) => {
  const startQrReader = useCallback(async () => {
    await BarcodeScanner.checkPermission({ force: true });
    BarcodeScanner.hideBackground();
    return await BarcodeScanner.startScan({
      cameraDirection: 'back',
      targetedFormats: ['QR_CODE'],
    });
  }, []);

  const stopQrReader = useCallback(() => {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    onClose();
  }, [onClose]);

  useEffect(() => {
    const readQrCode = async () => {
      const result = await startQrReader();
      stopQrReader();

      if (result.hasContent) {
        const qrCodeData = result.content.replace('"', '');
        return onClose(qrCodeData);
      }

      onClose();
    };

    readQrCode();

    return () => {
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
    };
  }, [startQrReader, stopQrReader, onClose]);

  const fullScreenClasses = 'absolute top-0 left-0 w-full h-full';

  return (
    <>
      <div className={`${fullScreenClasses} flex flex-col p-8 z-10`}>
        <Button className="self-start z-20" onPress={stopQrReader} isIconOnly>
          <IoClose className="w-5 h-5" />
        </Button>
        <div
          className="z-10 m-auto"
          style={{
            width: '70vw',
            height: '70vw',
            border: '4px solid white',
            borderRadius: '10px',
            boxShadow: '0 0 0 99999px rgba(0, 0, 0, .6)',
          }}
        />
      </div>
    </>
  );
};

export default QrCodeReader;
