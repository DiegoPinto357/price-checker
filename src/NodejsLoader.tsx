import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { NodeJS } from 'capacitor-nodejs';

const platform = Capacitor.getPlatform();
const isMobile = platform !== 'web';

const NodejsLoader = () => {
  const [isNodeReady, setIsNodeReady] = useState<boolean>(false);

  useEffect(() => {
    if (isMobile) {
      NodeJS.whenReady().then(() => {
        setIsNodeReady(true);
      });

      return () => {
        NodeJS.removeAllListeners();
      };
    }
  }, []);

  return (
    <div>
      {isMobile ? (!isNodeReady ? 'Awaiting nodejs' : 'Node ready') : null}
    </div>
  );
};

export default NodejsLoader;
