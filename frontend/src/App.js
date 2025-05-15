import React, { useState } from 'react';
import './App.css';

function App() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState(null);

  const handleOperation = async (op) => {
    try {
      let body;

      // Handle single-input operations
      if (['sqrt', 'absolute', 'factorial', 'square'].includes(op)) {
        body = { a: parseFloat(a) };
      } else {
        body = { a: parseFloat(a), b: parseFloat(b) };
      }

      const response = await fetch(`http://localhost:3001/api/${op}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      setResult(data.result ?? data.error);
    } catch (error) {
      setResult('Error connecting to server');
    }
  };

  return (
    <div className="App">
      <h1>Calculator</h1>
      <input
        type="number"
        value={a}
        onChange={e => setA(e.target.value)}
        placeholder="Enter number A"
      />
      <input
        type="number"
        value={b}
        onChange={e => setB(e.target.value)}
        placeholder="Enter number B"
      />
      <div style={{ margin: '10px 0' }}>
        <button onClick={() => handleOperation('add')}>Add</button>
        <button onClick={() => handleOperation('subtract')}>Subtract</button>
        <button onClick={() => handleOperation('multiply')}>Multiply</button>
        <button onClick={() => handleOperation('divide')}>Divide</button>
        <button onClick={() => handleOperation('mod')}>Modulus</button>
        <button onClick={() => handleOperation('power')}>Power</button>
        <button onClick={() => handleOperation('sqrt')}>Square Root</button>
        <button onClick={() => handleOperation('absolute')}>Absolute</button>
        <button onClick={() => handleOperation('factorial')}>Factorial</button>
        <button onClick={() => handleOperation('square')}>Square</button>
      </div>
      <h2>Result: {result !== null ? result : 'No result yet'}</h2>
    </div>
  );
}

export default App;
