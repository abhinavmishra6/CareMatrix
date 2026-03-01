import React, { useState, useEffect } from "react";

import {
  Shield,
  LogIn,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  LayoutDashboard,
  History
} from "lucide-react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "../firebase";

export default function Staff({ staffUser, setStaffUser }) {

  const [credentials, setCredentials] = useState({ userId: '', password: '' });
  const [requests, setRequests] = useState([]);
  const [showDetailsId, setShowDetailsId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');


  // 🔐 LOGIN
const handleLogin = async (e) => {
  e.preventDefault();
  setErrorMessage('');

  try {
    // 🔐 Sign in using Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.userId,    // now email
      credentials.password
    );

    const user = userCredential.user;

    // 🔥 Fetch department data from Firestore
    const staffDoc = await getDoc(doc(db, "staff", user.email));

    if (staffDoc.exists()) {
      const data = staffDoc.data();

      setStaffUser({
        name: data.name,
        id: user.email,
        dept: data.role
      });

    } else {
      setErrorMessage("No department assigned to this user.");
    }

  } catch (error) {
    setErrorMessage("Invalid email or password");
  }
};

  // 🔥 FETCH QUEUE
useEffect(() => {
  if (staffUser) {
    fetchQueue();
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [staffUser]);
  const fetchQueue = async () => {
    const q = query(
      collection(db, "requests"),
      where("currentDepartment", "==", staffUser.dept)
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setRequests(data);
  };

  // ✅ ACTIONS
  const handleApprove = async (id) => {
    await updateDoc(doc(db, "requests", id), {
      status: "APPROVED",
      currentDepartment: "PHAR"
    });
    fetchQueue();
  };

  const handleHold = async (id) => {
    await updateDoc(doc(db, "requests", id), {
      status: "ON HOLD"
    });
    fetchQueue();
  };

  const handleReject = async (id) => {
    await updateDoc(doc(db, "requests", id), {
      status: "REJECTED"
    });
    fetchQueue();
  };

  // ================= LOGIN PAGE =================
  if (!staffUser) {
    return (
      <div className="login-wrapper">
        <div className="login-header">
          <div className="shield-icon"><Shield size={32} /></div>
          <h1 className="serif-font">Staff Login</h1>
          <p>Each department staff can log in and process their step</p>
        </div>

        <div className="login-card-container">
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="text"
                value={credentials.userId}
                onChange={(e) =>
                  setCredentials({ ...credentials, userId: e.target.value })
                }
              />
            </div>

            <div className="input-group">
              <label>PASSWORD</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>

            {errorMessage && <div className="error-box">{errorMessage}</div>}

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Sign In <LogIn size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= DASHBOARD =================
  return (
    <div className="dashboard-wrapper">

      <div className="doctor-banner">
        <div className="banner-profile">
          <div className="stethoscope-icon">🩺</div>
          <div className="profile-text">
            <h2 className="serif-font">Department Dashboard</h2>
            <p>
              Logged in as <strong>{staffUser.name}</strong> · {staffUser.id}
            </p>
          </div>
        </div>

        <div className="banner-stats">
          <div className="stat-box">
            <span className="val">{requests.length}</span>
            <span className="lab">PENDING</span>
          </div>
        </div>
      </div>

      <div className="section-block">
        <h3 className="section-title">
          <LayoutDashboard size={20} /> My Department Queue
        </h3>

        {requests.length === 0 && <p>No pending requests</p>}

        {requests.map((req) => (
          <div key={req.id} className="request-card">

            <div className="card-header">
              <div className="req-meta">
                <span className="req-id">{req.requestCode}</span>
                <span className="req-patient">
                  {req.fullName} · {req.phone}
                </span>
                <span className="req-type">{req.workflowType}</span>
              </div>

              <div className="status-badges">
                <span className="badge-blue">{req.status}</span>
                <span className="badge-teal">{req.priority}</span>
              </div>
            </div>

            <div className="msg-box">
              {req.description}
            </div>

            <div className="action-row">
              <div className="action-btns">
                <button onClick={() => handleApprove(req.id)} className="btn-approve">
                  <CheckCircle2 size={16} /> Approve
                </button>

                <button onClick={() => handleHold(req.id)} className="btn-hold">
                  <Clock size={16} /> Hold
                </button>

                <button onClick={() => handleReject(req.id)} className="btn-reject">
                  <AlertCircle size={16} /> Reject
                </button>
              </div>

              <button
                className="btn-details"
                onClick={() =>
                  setShowDetailsId(
                    showDetailsId === req.id ? null : req.id
                  )
                }
              >
                <Eye size={16} /> Details
              </button>
            </div>

            {showDetailsId === req.id && (
              <div className="details-drawer">
                <div><strong>Created:</strong> {req.createdAt?.toDate?.().toLocaleString()}</div>
                <div><strong>Department:</strong> {req.currentDepartment}</div>
              </div>
            )}

          </div>
        ))}
      </div>

      <div className="section-block">
        <h3 className="section-title">
          <History size={20} /> Previously Processed
        </h3>
        <p>(Next we can filter status !== CREATED)</p>
      </div>

    </div>
  );
}