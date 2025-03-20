import { useState, useCallback } from 'react';
import { Button } from '@heroui/react';
import Typography from '../lib/Typography';
import Loader from '../lib/Loader';
import dataSync from '../../dataSync';
import HapticFeedback from './Debug/HapticFeedback';

const Settings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSyncButtonClick = useCallback(async () => {
    setIsLoading(true);
    await dataSync.startSync();
    setIsLoading(false);
  }, []);

  return (
    <div data-testid="settings">
      <Typography variant="h2">Debug</Typography>

      <div className="flex flex-col gap-8">
        <div>
          <Typography variant="h3">Banco de dados</Typography>
          <Button
            className="w-full md:w-1/3"
            color="primary"
            onPress={handleSyncButtonClick}
          >
            Sincronizar
          </Button>
        </div>

        <HapticFeedback />
      </div>

      {isLoading && <Loader />}
    </div>
  );
};

export default Settings;
