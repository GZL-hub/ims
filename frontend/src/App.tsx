import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // Fetch the message from the backend
    fetch('http://localhost:3001/api/message')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Error fetching data from backend'));
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold underline text-blue-400">
        {message}
      </h1>
    </div>
  );
}

export default App;
