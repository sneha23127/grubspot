import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        identifier: formData.identifier,
        password: formData.password
      });

      if (response.data.status === 'success') {
        const user = response.data.user;
        alert(`Login successful! Welcome ${user.name}`);
        
        // Persist user info
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'mess_owner') {
          navigate('/owner');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        alert(error.response.data.message || "Invalid credentials. Please try again.");
      } else if (error.request) {
        // The request was made but no response was received
        alert("Unable to connect to the server. Please ensure the backend is running.");
      } else {
        // Something else happened
        alert("An error occurred during login. Please try again.");
      }
    }
  };

  return (
    <div className="split-screen">
      {/* Left Pane (Image & Text) */}
      <div className="left-pane">
        <div className="brand">
          <div className="logo-icon">GS</div>
          <div className="brand-name">GrubSpot</div>
        </div>
        <h1 className="left-title">Discover trusted home-style mess services near you</h1>
        <p className="left-subtitle">20+ messes · 2000+ students · Bengaluru</p>
      </div>

      {/* Right Pane (Form) */}
      <div className="right-pane">
        <div className="form-container">
          <div className="get-started">WELCOME BACK!</div>
          <h2 className="form-title">Login</h2>
          <div style={{ marginBottom: "32px" }}></div> {/* Spacer to match design proportions */}

          <form onSubmit={handleLogin}>
            {/* Email Address */}
            <div className="input-group">
              <label className="input-label">Email or Username</label>
              <input 
                type="text" 
                name="identifier" 
                value={formData.identifier} 
                onChange={handleChange} 
                className="input-field" 
                placeholder="email or username" 
              />
            </div>

            {/* Password */}
            <div className="input-group" style={{ marginBottom: '8px' }}>
              <label className="input-label">Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field" 
                  placeholder="••••••••" 
                />
                <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                    {showPassword && <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" />}
                  </svg>
                </div>
              </div>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <a href="#forgot" style={{ fontSize: '12px', color: 'var(--text-light)', textDecoration: 'none' }}>
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn" >
              Login
            </button>
            
            {/* Footer Text */}
            <div className="footer-text">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
