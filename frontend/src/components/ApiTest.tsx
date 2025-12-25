import { useEffect, useState } from 'react';

const ApiTest = () => {
  const [result, setResult] = useState('Testing...');

  useEffect(() => {
    const test = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/vehicles');
        const data = await response.json();
        setResult(`Success: ${data.data?.length || 0} vehicles found`);
      } catch (error) {
        setResult(`Error: ${error.message}`);
      }
    };
    test();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc',
      zIndex: 9999
    }}>
      API Test: {result}
    </div>
  );
};

export default ApiTest;
