import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chat from './pages/Chat';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <Chat />
      </div>
    </Router>
  );
}

export default App;