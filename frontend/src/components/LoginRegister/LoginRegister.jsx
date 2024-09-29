import React, { useState } from "react";
import "./LoginRegister.css";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaUserTag } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginRegister() {
  const [action, setAction] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerContact, setRegisterContact] = useState('');
  const [registerRole, setRegisterRole] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const navigate = useNavigate();

  const registerLink = () => {
    setAction('active');
  };

  const loginLink = () => {
    setAction('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/login', {
        username: loginUsername,
        password: loginPassword
      });
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('username', res.data.username);
        setIsLoggedIn(true);
        setLoginError('');
        navigate(`/profile/${res.data.userId}`);
      }
    } catch (err) { 
      setLoginError('Invalid username or password');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!registerUsername || !registerEmail || !registerPassword || !registerContact || !registerRole) {
      setRegisterError('All fields are required');
      return;
    }

    try {
      await axios.post('http://localhost:5000/register', {
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
        contact: registerContact,
        role: registerRole
      });
      
      setAction('');
      setRegisterUsername('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterContact('');
      setRegisterRole('');
      setRegisterError('');
      // Optionally, show a success message or automatically switch to login
    } catch (err) {
      setRegisterError(err.response?.data?.msg || 'Registration failed');
    }
  };

  if (isLoggedIn) {
    navigate('/profile');
  }
  console.log(localStorage.getItem('userId'));

  return (
    <div className={`wrapper ${action}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh', marginLeft: '790px',marginTop: '150px'}}>
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forget password?</a>
          </div>
          {loginError && <p className="error">{loginError}</p>}
          <button type="submit">Login</button>
          <div className="register-link">
            <p>
              Don't have an account? <a href="#" onClick={registerLink}>Register</a>
            </p>
          </div>
        </form>
      </div>

      <div className="form-box register">
        <form onSubmit={handleRegister}>
          <h1>Registration</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <input
              type="tel"
              placeholder="Contact"
              value={registerContact}
              onChange={(e) => setRegisterContact(e.target.value)}
              required
            />
            <FaPhone className="icon" />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Role"
              value={registerRole}
              onChange={(e) => setRegisterRole(e.target.value)}
              required
            />
            <FaUserTag className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" required /> I agree to the terms & conditions
            </label>
          </div>
          {registerError && <p className="error">{registerError}</p>}
          <button type="submit">Register</button>
          <div className="login-link">
            <p>
              Already have an account? <a href="#" onClick={loginLink}>Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
