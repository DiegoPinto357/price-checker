import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { NodeJS } from 'capacitor-nodejs';
import Loader from './lib/Loader';

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

  return isMobile && !isNodeReady ? <Loader fullscreen /> : null;
};

export default NodejsLoader;
