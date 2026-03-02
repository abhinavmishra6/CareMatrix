import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Activity, Home, LucideLogIn, PlusSquare, Search, LogOut, User } from 'lucide-react';

export default function Header({ staffUser, onLogout }) {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <div className="logo-icon"><Activity size={24} /></div>
        <div className="logo-text">
          <h2 className="serif-font">CareMatrix</h2>
          <span>Workflow Portal</span>
        </div>
      </Link>
      
      <nav className="header-nav">
        <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Home size={18} /> Home
        </NavLink>
        <NavLink to="/new-request" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <PlusSquare size={18} /> New Request
        </NavLink>
        <NavLink to="/status" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Search size={18} /> Track
        </NavLink>
      </nav>

      <div className="header-actions">
        {staffUser ? (
          <div className="logged-in-info" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span className="staff-display" style={{ fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', color: '#1e293b' }}>
              <NavLink to="/staff" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}style={{ textDecoration: 'none', color: 'inherit' }}><User size={18} />{staffUser.name}</NavLink>
            </span>
            <button 
              onClick={onLogout} 
              className="btn-signout"
              style={{
                background: '#fee2e2',
                color: '#ef4444',
                border: '1px solid #fecdd3',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '600'
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        ) : (
          <Link to="/staff" className="btn-outline" style={{textDecoration:'none', color:'black', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <LucideLogIn size={18} /> Staff Login
          </Link>
        )}
      </div>
    </header>
  );
}
