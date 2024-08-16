import React from 'react'
import LoginRegister from './components/LoginRegister/LoginRegister'
import Profile from './Profile/Profile'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FirstLogin from './FirstLogin/FirstLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRegister/>} />
        <Route path="/dashboard" element={<FirstLogin/>} />
        <Route path="/" element={<LoginRegister/>} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </Router>
  );
}

export default App;