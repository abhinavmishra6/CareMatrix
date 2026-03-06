import React, { useState, useEffect, useCallback } from "react";
import {
  Shield,
  LogIn,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  LayoutDashboard,
  History,
} from "lucide-react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";

export default function Staff({ staffUser, setStaffUser }) {
  const [credentials, setCredentials] = useState({ userId: "", password: "" });
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [showDetailsId, setShowDetailsId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ---------------- FETCH DATA ---------------- */

  const fetchQueue = useCallback(async () => {
    const q = query(
      collection(db, "requests"),
      where("currentDepartment", "==", staffUser.dept)
    );

    const snapshot = await getDocs(q);
    setRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }, [staffUser]);

  const fetchHistory = useCallback(async () => {
    const q = query(
      collection(db, "requests"),
      where("processedBy", "array-contains", staffUser.dept)
    );

    const snapshot = await getDocs(q);
    setHistory(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }, [staffUser]);

  useEffect(() => {
    if (staffUser) {
      fetchQueue();
      fetchHistory();
    }
  }, [staffUser, fetchQueue, fetchHistory]);

  /* ---------------- ACTIONS ---------------- */

  const handleApprove = async (req) => {
    try {
      const nextStep = req.currentStep + 1;

      if (nextStep < req.workflowSteps.length) {
        await updateDoc(doc(db, "requests", req.id), {
          currentStep: nextStep,
          currentDepartment: req.workflowSteps[nextStep],
          status: "IN PROGRESS",
          processedBy: arrayUnion(staffUser.dept),
        });
      } else {
        await updateDoc(doc(db, "requests", req.id), {
          status: "COMPLETED",
          currentDepartment: "DONE",
          processedBy: arrayUnion(staffUser.dept),
        });
      }

      fetchQueue();
      fetchHistory();
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const handleHold = async (req) => {
    await updateDoc(doc(db, "requests", req.id), {
      status: "ON HOLD",
    });
    fetchQueue();
  };

  const handleReject = async (req) => {
    await updateDoc(doc(db, "requests", req.id), {
      status: "REJECTED",
      currentDepartment: "COMPLETED",
      processedBy: arrayUnion(staffUser.dept),
    });

    fetchQueue();
    fetchHistory();
  };

  /* ---------------- LOGIN ---------------- */

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.userId,
        credentials.password
      );

      const user = userCredential.user;
      const staffDoc = await getDoc(doc(db, "staff", user.email));

      if (staffDoc.exists()) {
        const data = staffDoc.data();

        setStaffUser({
          name: data.name,
          id: user.email,
          dept: data.role,
        });
      } else {
        setErrorMessage("No department assigned to this user.");
      }
    } catch (error) {
      setErrorMessage("Invalid email or password");
    }
  };

  /* ---------------- LOGIN PAGE ---------------- */

  if (!staffUser) {
    return (
      <div className="login-wrapper">
        <div className="login-header">
          <div className="shield-icon">
            <Shield size={32} />
          </div>

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
                  setCredentials({
                    ...credentials,
                    userId: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      password: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {errorMessage && <div className="error-box">{errorMessage}</div>}

            <button type="submit" className="btn-primary" style={{ width: "100%" }}>
              Sign In <LogIn size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ---------------- DASHBOARD ---------------- */

  return (
    <div className="dashboard-wrapper">
      <div className="doctor-banner">
        <div className="banner-profile">
          <div className="stethoscope-icon">🩺</div>

          <div className="profile-text">
            <h2 className="serif-font">{staffUser.dept} Dashboard</h2>

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

      {/* ---------------- QUEUE ---------------- */}

      <div className="section-block">
        <h3 className="section-title">
          <LayoutDashboard size={20} /> My Department Queue
        </h3>

        {requests.map((req) => (
          <div key={req.id} className="request-card">
            <div className="card-header">
              <div className="req-meta">
                <span className="req-id">{req.requestCode}</span>
                <span className="req-patient">
                  <strong>{req.fullName}</strong>
                </span>
              </div>

              <div className="status-badges">

                {/* STATUS BADGE */}
                <span
                  className={
                    req.status === "COMPLETED" || req.status === "APPROVED"
                      ? "badge-green"
                      : req.status === "REJECTED"
                      ? "badge-red"
                      : "badge-yellow"
                  }
                >
                  {req.status}
                </span>

                {/* PRIORITY BADGE */}
                <span
                  className={
                    req.priority === "URGENT"
                      ? "priority-red"
                      : req.priority === "NORMAL"
                      ? "priority-yellow"
                      : "priority-green"
                  }
                >
                  {req.priority}
                </span>
              </div>
            </div>

            <div className="msg-box">{req.description}</div>

            <div className="action-row">
              <div className="action-btns">
                <button
                  onClick={() => handleApprove(req)}
                  className="btn-approve"
                >
                  <CheckCircle2 size={16} /> Approve
                </button>

                <button onClick={() => handleHold(req)} className="btn-hold">
                  <Clock size={16} /> Hold
                </button>

                <button
                  onClick={() => handleReject(req)}
                  className="btn-reject"
                >
                  <AlertCircle size={16} /> Reject
                </button>
              </div>

<button
  className="btn-details"
  onClick={() =>
    setShowDetailsId(showDetailsId === req.id ? null : req.id)
  }
>
  {showDetailsId === req.id ? <EyeOff size={16} /> : <Eye size={16} />}
  Details
</button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- HISTORY ---------------- */}

      <div className="section-block">
        <h3 className="section-title">
          <History size={20} /> Previously Processed
        </h3>

        <table className="history-table">
          <thead>
            <tr>
              <th>CODE</th>
              <th>PATIENT</th>
              <th>STATUS</th>
              <th>DATE</th>
            </tr>
          </thead>

          <tbody>
            {history.map((h) => (
              <tr key={h.id}>
                <td className="text-blue">
                  <strong>{h.requestCode}</strong>
                </td>

                <td>{h.fullName}</td>

                <td>
                  <span
                    className={
                      h.status === "COMPLETED" || h.status === "APPROVED"
                        ? "badge-green"
                        : h.status === "REJECTED"
                        ? "badge-red"
                        : "badge-yellow"
                    }
                  >
                    {h.status}
                  </span>
                </td>

                <td>
                  {h.createdAt?.toDate
                    ? h.createdAt.toDate().toLocaleDateString()
                    : "Recent"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}