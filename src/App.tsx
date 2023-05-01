import { useCallback, useState } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState();

  const onButtonClick = useCallback(async () => {
    const { data } = await axios.get(
      'http://127.0.0.1:3001/items?key=43230401438784002060650050002209661478083301|2|1|1|5a7b0201011ca0acc439ef3ea9358b64131234e4'
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
      <button onClick={onButtonClick}>Parse NF</button>
      <br />
      <code>{JSON.stringify(items, null, 2)}</code>
    </>
  );
}

export default App;
