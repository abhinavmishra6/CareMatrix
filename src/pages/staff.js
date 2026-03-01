import React, { useState, useEffect } from "react";
import {
  Shield,
  LogIn,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  LayoutDashboard,
  History,
} from "lucide-react";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";

export default function Staff() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ userId: "", password: "" });
  const [requests, setRequests] = useState([]);
  const [showDetailsId, setShowDetailsId] = useState(null);

  const staffList = [
    { name: "Super Admin", id: "ADMIN001", pass: "Admin@123" },
    { name: "Dr. Rajesh", id: "DOCS001", pass: "Docs@123" },
    { name: "Lab Technician", id: "LABS001", pass: "Labs@123" },
  ];

  // 🔐 LOGIN
  const handleLogin = (e) => {
    e.preventDefault();
    const user = staffList.find(
      (s) =>
        s.id === credentials.userId && s.pass === credentials.password
    );

    if (user) {
      setIsLoggedIn(true);
    } else {
      alert("Invalid Credentials");
    }
  };

  // 🔥 FETCH QUEUE
  useEffect(() => {
    if (isLoggedIn) {
      fetchQueue();
    }
  }, [isLoggedIn]);

  const fetchQueue = async () => {
    const q = query(
      collection(db, "requests"),
      where("currentDepartment", "==", "DOCS")
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setRequests(data);
  };

  // ✅ APPROVE
  const handleApprove = async (id) => {
    await updateDoc(doc(db, "requests", id), {
      status: "APPROVED",
      currentDepartment: "PHAR",
    });

    fetchQueue();
  };

  // ⏳ HOLD
  const handleHold = async (id) => {
    await updateDoc(doc(db, "requests", id), {
      status: "ON HOLD",
    });

    fetchQueue();
  };

  // ❌ REJECT
  const handleReject = async (id) => {
    await updateDoc(doc(db, "requests", id), {
      status: "REJECTED",
    });

    fetchQueue();
  };

  // ================= LOGIN PAGE =================
  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <h1>Staff Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="User ID"
            value={credentials.userId}
            onChange={(e) =>
              setCredentials({ ...credentials, userId: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          <button type="submit">
            Sign In <LogIn size={16} />
          </button>
        </form>
      </div>
    );
  }

  // ================= DASHBOARD =================
  return (
    <div className="dashboard-wrapper">
      <h2>
        <LayoutDashboard size={20} /> Doctor Queue (DOCS)
      </h2>

      {requests.length === 0 && <p>No pending requests</p>}

      {requests.map((req) => (
        <div key={req.id} className="request-card">
          <div className="card-header">
            <strong>{req.requestCode}</strong>
            <p>
              {req.fullName} · {req.phone}
            </p>
            <p>Workflow: {req.workflowType}</p>
            <p>Status: {req.status}</p>
          </div>

          <div className="action-row">
            <button
              className="btn-approve"
              onClick={() => handleApprove(req.id)}
            >
              <CheckCircle2 size={16} /> Approve
            </button>

            <button
              className="btn-hold"
              onClick={() => handleHold(req.id)}
            >
              <Clock size={16} /> Hold
            </button>

            <button
              className="btn-reject"
              onClick={() => handleReject(req.id)}
            >
              <AlertCircle size={16} /> Reject
            </button>

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
              <p><strong>Description:</strong> {req.description}</p>
              <p><strong>Priority:</strong> {req.priority}</p>
            </div>
          )}
        </div>
      ))}

      {/* History Section Placeholder */}
      <div style={{ marginTop: "40px" }}>
        <h3>
          <History size={18} /> Previously Processed
        </h3>
        <p>(You can implement history filter later)</p>
      </div>
    </div>
  );
}