import { useEffect, useState } from 'react';

const DebugVehicles = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching from:', 'http://localhost:3001/api/vehicles');
        const response = await fetch('http://localhost:3001/api/vehicles');
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('API Response:', result);
        setData(result);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h3>Debug: Vehicle API Test</h3>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <div>
          <p>Success: {data.success ? 'true' : 'false'}</p>
          <p>Vehicle count: {data.data?.length || 0}</p>
          {data.data?.[0] && (
            <div>
              <h4>First vehicle:</h4>
              <pre>{JSON.stringify(data.data[0], null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugVehicles;
