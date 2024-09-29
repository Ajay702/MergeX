import React from 'react';
import LoginRegister from './components/LoginRegister/LoginRegister';
import Profile from './Profile/Profile';
import FirstLogin from './FirstLogin/FirstLogin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/" element={<LoginRegister />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/records/:userId/:recordId" element={<FirstLogin />} />
      </Routes>
    </Router>
  );
}

export default App;


