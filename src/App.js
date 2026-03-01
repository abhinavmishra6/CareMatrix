import React, { useState }  from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import NewRequest from './pages/NewRequest';
import Status from './pages/status';
import Staff from './pages/staff';
import HomePage from './pages/Home';

function App() {
  // Global state to track logged-in staff
  const [staffUser, setStaffUser] = useState(null);

  const handleLogout = () => {
    setStaffUser(null);
  };

  return (
    <Router>
      <div className="app-wrapper">
        {/* Pass staffUser and logout function to Header */}
        <Header staffUser={staffUser} onLogout={handleLogout} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/new-request" element={<NewRequest />} />
            <Route path="/status" element={<Status />} />
            {/* Pass setStaffUser so the Staff page can update the global state */}
            <Route 
              path="/staff" 
              element={<Staff staffUser={staffUser} setStaffUser={setStaffUser} />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}


export default App;
