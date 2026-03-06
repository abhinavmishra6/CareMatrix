import React, { useState } from "react";
import { Search, FileText, AlertCircle } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Status() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setSearched(false);
    setResults([]);
    if (!name || !phone || !code) {
      setError("Please enter Patient Name, Phone and Request Code");
      return;
    }

    try {
      const q = query(
        collection(db, "requests"),
        where("fullName", "==", name),
        where("phone", "==", phone),
        where("requestCode", "==", code.toUpperCase()),
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResults(data);
      setSearched(true);
    } catch (err) {
      setError("Database connection error. Please try again later.");
      console.error(err);
    }
  };

  const handleInputChange = (setter, value) => {
    setter(value);
    if (error) setError("");
  };

  return (
    <div className="status-container">
      <div className="page-header">
        <h1>Track Your Request</h1>
        <p>Search by name, phone, or request code</p>
      </div>

      <div className="form-card" style={{ padding: "24px" }}>
        <div
          className="input-grid"
          style={{
            gridTemplateColumns: "1fr 1fr 1fr",
            alignItems: "end",
            gap: "15px",
          }}
        >
          <div className="input-group">
            <label>Patient Name</label>
            <input
              type="text"
              placeholder="e.g. Arjun"
              value={name}
              onChange={(e) => handleInputChange(setName, e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Phone</label>
            <input
              type="text"
              placeholder="10-digit"
              value={phone}
              onChange={(e) => handleInputChange(setPhone, e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Request Code</label>
            <input
              type="text"
              placeholder="REQ25030101"
              value={code}
              onChange={(e) => handleInputChange(setCode, e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div
            className="error-box"
            style={{ marginTop: "20px", marginBottom: "0px" }}
          >
            <AlertCircle
              size={16}
              style={{ verticalAlign: "middle", marginRight: "8px" }}
            />
            {error}
          </div>
        )}

        <button
          className="btn-primary"
          style={{ marginTop: "20px", width: "100%", maxWidth: "550px" }}
          onClick={handleSearch}
        >
          <Search size={18} /> Search
        </button>
      </div>
      <br />

      {!searched && !error && (
        <div className="status-empty">
          <FileText
            size={48}
            color="#cbd5e1"
            style={{ margin: "0 auto 16px" }}
          />
          <h3>Find Your Request</h3>
          <p>Use all fields above to look up your healthcare request</p>
        </div>
      )}

      {searched && results.length === 0 && (
        <div className="status-empty">
          <FileText
            size={48}
            color="#cbd5e1"
            style={{ margin: "0 auto 16px" }}
          />
          <h3>No Request Found</h3>
          <p>Please check the details and try again</p>
        </div>
      )}

      {results.map((req) => {
        // 🎨 Dynamic Priority Color
        const priorityColor =
          req.priority === "URGENT"
            ? "#dc2626" // red
            : req.priority === "NORMAL"
              ? "#f59e0b" // orange
              : "#16a34a"; // green (LOW)

        return (
          <div
            key={req.id}
            className="request-card"
            style={{ marginTop: "20px" }}
          >
            {/* HEADER */}
            <div
              className="card-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* LEFT SIDE */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                {/* RequestID | Name · Phone */}
                <div style={{ fontSize: "15px", fontWeight: "600" }}>
                  <span style={{ color: "#2563eb" }}>{req.requestCode}</span>
                  {" | "}
                  <span style={{ color: "#0f172a" }}>{req.fullName}</span>
                  {" · "}
                  <span style={{ color: "#0f172a", fontWeight: "500" }}>
                    {req.phone}
                  </span>
                </div>

                {/* Workflow Type */}
                <div style={{ fontSize: "13px", color: "#3c4652" }}>
                  {req.workflowType}
                </div>
              </div>

              {/* PRIORITY BADGE */}
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  background: priorityColor,
                  color: "#ffffff",
                }}
              >
                PRIORITY | {req.priority}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div
              className="msg-box"
              style={{
                marginTop: "18px",
                padding: "14px",
                background: "#f1f5f9",
                borderRadius: "8px",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#334155",
              }}
            >
              {req.description}
            </div>

            {/* CURRENT DEPARTMENT */}
            <div style={{ marginTop: "18px", marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                {/* Line */}
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "9px",
                    right: "9px",
                    height: "4px",
                    background: "rgba(0,0,200,0.6)",
                    zIndex: 0,
                  }}
                ></div>

                {req.workflowSteps?.map((dept, index) => {
                  let bg = "#ff8080"; // default gray
                  let textColor = "#6b7280";

                  if (index < req.currentStep) {
                    bg = "#16a34a"; // completed green
                    textColor = "#16a34a";
                  } else if (index === req.currentStep) {
                    bg = "#2563eb"; // current blue
                    textColor = "#2563eb";
                  }

                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {/* Dot */}
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: bg,
                          border: "3px solid white",
                          boxShadow: "0 0 0 2px #e5e7eb",
                        }}
                      ></div>

                      {/* Label */}
                      <span
                        style={{
                          fontSize: "11px",
                          marginTop: "6px",
                          fontWeight: "600",
                          color: textColor,
                        }}
                      >
                        {dept}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
