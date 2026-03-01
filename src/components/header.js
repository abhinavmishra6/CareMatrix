import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Activity, Home, PlusSquare, Search, Shield } from 'lucide-react';

export default function Header() {
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
        <Link to="/staff" className="btn-outline">
          <Shield size={18} /> Staff Login
        </Link>
      </div>
    </header>
  );
}