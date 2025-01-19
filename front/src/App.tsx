import React from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  // Simple routing based on pathname
  const path = window.location.pathname;

  if (path === '/login') {
    return <Login />;
  }

  return (
      <Dashboard />
  );
}

export default App;