import { useState, useCallback } from 'react';
import { Button } from '@nextui-org/react';
import Typography from '../lib/Typography';
import Loader from '../Loader';
import dataSync from '../../dataSync';

const Settings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSyncButtonClick = useCallback(async () => {
    setIsLoading(true);
    await dataSync.startSync();
    setIsLoading(false);
  }, []);

  return (
    <div data-testid="settings">
      <Typography variant="h1">Configurações</Typography>

      <Typography variant="h2">Debug</Typography>

      <Button
        className="w-full md:w-1/3"
        color="primary"
        onPress={handleSyncButtonClick}
      >
        Sincronizar Banco de Dados
      </Button>

      {isLoading && <Loader />}
    </div>
  );
};

export default Settings;
