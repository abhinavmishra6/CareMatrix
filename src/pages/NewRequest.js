import React, { useState } from 'react';
import { Send, Info } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function NewRequest() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dob: '',
    priority: 'LOW',
    workflowType: '',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [requestCode, setRequestCode] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();

  const newCode = `REQ-${Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase()}`;
  try {
    await addDoc(collection(db, "requests"), {
      requestCode: newCode,
      ...formData,
      status: "CREATED",
      currentDepartment: "DOCS",
      createdAt: serverTimestamp(),
    });
    setRequestCode(newCode);
    setSubmitted(true);
  } catch (error) {
    alert(error.message);
  }
};

  if (submitted) {
    return (
      <div className="status-empty">
        <div className="success-icon">✅</div>
        <h2 className="serif-font">Request Submitted!</h2>
        <p>Your unique request code is: <strong>{requestCode}</strong></p>
        <button className="btn-outline" onClick={() => setSubmitted(false)} style={{marginTop: '20px'}}>
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="request-container">
      <div className="page-header">
        <h1 className="serif-font">New Patient Request</h1>
        <p>Fill in details and select the appropriate workflow</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {/* Patient Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">PATIENT INFORMATION</h3>
            <div className="input-grid">
              <div className="input-group">
                <label>FULL NAME <span className="required">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Arjun Mehta" 
                  required 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>PHONE <span className="required">*</span></label>
                <input 
                  type="text" 
                  placeholder="10-digit" 
                  pattern="[0-9]{10}"
                  required 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>DATE OF BIRTH</label>
                <input 
                  type="date" 
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>PRIORITY</label>
                <div className="select-wrapper">
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="LOW">LOW </option>
                    <option value="NORMAL">NORMAL </option>
                    <option value="URGENT">URGENT </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Request Details Section */}
          <div className="form-section">
            <h3 className="form-section-title">REQUEST DETAILS</h3>
            <div className="input-group full">
              <label>WORKFLOW TYPE <span className="required">*</span></label>
              <select 
                required
                value={formData.workflowType}
                onChange={(e) => setFormData({...formData, workflowType: e.target.value})}
              >
                <option value="">— Select a workflow —</option>
                <option value="registration">Patient Registration & Consultation</option>
                <option value="lab">Laboratory Test Request</option>
                <option value="pharmacy">Pharmacy Medication</option>
                <option value="">Insurance Claim Approval</option>
                <option value="">Patient Discharge</option>
                <option value="">Emergency Escalation</option>
                <option value="">Medical Records Verification</option>
              </select>
            </div>
            <div className="input-group full" style={{marginTop: '20px'}}>
              <label>DESCRIPTION <span className="required">*</span></label>
              <textarea 
                placeholder="Describe the purpose of this request..." 
                rows="4"
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
          </div>

          <button type="submit" className="btn-submit-full">
             Submit Request
          </button>
        </form>

        <div className="info-footer">
          <Info size={16} />
          <span>A unique request code will be generated. Use it anytime to check status.</span>
        </div>
      </div>
    </div>
  );
}