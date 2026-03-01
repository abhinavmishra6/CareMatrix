import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import NewRequest from './pages/NewRequest';
import Status from './pages/status';
import Staff from './pages/staff';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/new-request" replace />} />
            <Route path="/new-request" element={<NewRequest />} />
            <Route path="/status" element={<Status />} />
            <Route path="/staff" element={<Staff />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
