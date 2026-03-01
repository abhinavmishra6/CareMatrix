import React, { useState } from 'react';
import { Search, FileText } from 'lucide-react';

import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

import { db } from "../firebase";

export default function Status() {

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {

    // 🔒 Require ALL fields
    if (!name || !phone || !code) {
      alert("Please enter Patient Name, Phone and Request Code");
      return;
    }

    const q = query(
      collection(db, "requests"),
      where("fullName", "==", name),
      where("phone", "==", phone),
      where("requestCode", "==", code.toUpperCase())
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setResults(data);
    setSearched(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Track Your Request</h1>
        <p>Search by name, phone, or request code</p>
      </div>

      <div className="form-card" style={{ padding: '24px' }}>
        <div
          className="input-grid"
          style={{ gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'end' }}
        >
          <div className="input-group">
            <label>Patient Name</label>
            <input
              type="text"
              placeholder="e.g. Arjun"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Phone</label>
            <input
              type="text"
              placeholder="10-digit"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Request Code</label>
            <input
              type="text"
              placeholder="REQ25030101"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>

        <button
          className="btn-primary"
          style={{ marginTop: '16px', width: '550px' }}
          onClick={handleSearch}
        >
          <Search size={18} /> Search
        </button>
      </div>

      {!searched && (
        <div className="status-empty">
          <FileText size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <h3>Find Your Request</h3>
          <p>Use all fields above to look up your healthcare request</p>
        </div>
      )}

      {searched && results.length === 0 && (
        <div className="status-empty">
          <FileText size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <h3>No Request Found</h3>
          <p>Please check the details and try again</p>
        </div>
      )}

      {results.map((req) => (
        <div key={req.id} className="request-card" style={{ marginTop: '20px' }}>
          <div className="card-header">
            <div className="req-meta">
              <span className="req-id">{req.requestCode}</span>
              <span className="req-patient">
                {req.fullName} · {req.phone}
              </span>
              <span className="req-type">{req.workflowType}</span>
            </div>

<div className="status-badges">
  <span className="badge-blue">
    {req.status.charAt(0) + req.status.slice(1).toLowerCase()}:
    {" "}
    {req.priority.charAt(0) + req.priority.slice(1).toLowerCase()}
  </span>
</div>
          </div>

<div className="msg-box" style={{ marginTop: "12px" }}>
  {req.description}
</div>

          <div style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
            Current Department: <strong>{req.currentDepartment}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}