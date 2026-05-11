import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Click outside listener
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'GS';
    const names = name.split(' ');
    if (names.length > 1) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <header style={{ background: 'white', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <nav className="container" style={{ borderBottom: 'none', position: 'static', background: 'transparent' }}>
        <div className="brand" style={{ marginBottom: 0 }}>
          <div className="logo-icon">GS</div>
          <div className="brand-name">GrubSpot</div>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/messes">List of Messes</Link>
          <Link to="/compare">Compare Messes</Link>
          <a href="#about">About Us</a>
        </div>
        <div className="nav-right">
          {user ? (
            <div className="profile-container" ref={dropdownRef}>
              <div className="profile-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div className="profile-initials">{getInitials(user?.name)}</div>
                <span className="profile-name">{user?.name ? user.name.split(' ')[0] : 'User'}</span>
                <span className="dropdown-arrow">▼</span>
              </div>

              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <span className="user-full-name">{user?.name || 'User'}</span>
                    <span className="user-email">{user?.email || 'No email'}</span>
                  </div>
                  
                  <div className="dropdown-item" onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}>
                    <i style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F26B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </i> My Profile
                  </div>
                  <div className="dropdown-item" onClick={() => { setIsDropdownOpen(false); navigate('/subscriptions'); }}>
                    <i style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F26B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                        <path d="m9 16 2 2 4-4"></path>
                      </svg>
                    </i> My Subscriptions
                  </div>
                  <div className="dropdown-item" onClick={() => { setIsDropdownOpen(false); navigate('/saved'); }}>
                    <i style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F26B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                      </svg>
                    </i> Saved Messes
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <div className="dropdown-item logout-item" onClick={handleLogout}>
                    <i style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                    </i> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: '#1A1A1A', fontWeight: '600' }}>Login</Link>
              <Link to="/signup" className="subscribe-btn" style={{ padding: '10px 24px', textDecoration: 'none' }}>Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
