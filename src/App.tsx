import { useEffect, useCallback, useState } from 'react';
import { NodeJS } from 'capacitor-nodejs';
import core from './core';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [isNodeReady, setIsNodeReady] = useState<boolean>(false);
  const [items, setItems] = useState();

  useEffect(() => {
    NodeJS.whenReady().then(() => {
      setIsNodeReady(true);
    });

    // return () => NodeJS.removeAllListeners();
  }, []);

  const onButtonClick = useCallback(async () => {
    const data = await core.getNfData(
      '43230401438784002060650050002209661478083301|2|1|1|5a7b0201011ca0acc439ef3ea9358b64131234e4'
    );
    console.log(data);
    setItems(data);
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <br />
      {!isNodeReady ? 'Awaiting nodejs' : 'Node ready'}
      <br />
      <button onClick={onButtonClick}>Parse NF</button>
      <br />
      <code>{JSON.stringify(items, null, 2)}</code>
    </>
  );
}

export default App;
