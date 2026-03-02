import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, getDocs} from "firebase/firestore";
import { db } from "../firebase";

var successicon = (
  <svg width="50px" height="50px" viewBox="0 0 64 64">
    <path
      style={{ fill: '#0074ff' }}
      d="M41.78,57.13a7.12,7.12,0,0,1-4.2-1.39l-4.32-3.16a3.12,3.12,0,0,0-3.7,0l-4.32,3.16a7.14,7.14,0,0,1-11.31-6.53l.58-5.32a3.11,3.11,0,0,0-1.85-3.2L7.77,38.53a7.13,7.13,0,0,1,0-13.06l4.89-2.16a3.11,3.11,0,0,0,1.85-3.2l-.58-5.32A7.14,7.14,0,0,1,25.24,8.26l4.32,3.16a3.12,3.12,0,0,0,3.7,0l4.32-3.16A7,7,0,0,1,43,7a7.25,7.25,0,0,1,4.75,3.13,2,2,0,1,1-3.34,2.2,3.23,3.23,0,0,0-2.12-1.39,3,3,0,0,0-2.37.57l-4.32,3.16a7.13,7.13,0,0,1-8.43,0l-4.31-3.16a3.13,3.13,0,0,0-5,2.87l.58,5.31A7.11,7.11,0,0,1,14.28,27l-4.9,2.16a3.14,3.14,0,0,0,0,5.74L14.28,37a7.11,7.11,0,0,1,4.21,7.3l-.58,5.31a3.13,3.13,0,0,0,5,2.87l4.31-3.16a7.13,7.13,0,0,1,8.43,0l4.32,3.16a3.13,3.13,0,0,0,5-2.87l-.58-5.31A7.1,7.1,0,0,1,48.54,37l4.9-2.16a3.14,3.14,0,0,0,0-5.74L50.78,28a2,2,0,1,1,1.61-3.66l2.66,1.17a7.13,7.13,0,0,1,0,13.06l-4.89,2.16a3.13,3.13,0,0,0-1.86,3.2l.58,5.32a7,7,0,0,1-3.52,6.95A7.17,7.17,0,0,1,41.78,57.13Z"
    />
    <path
      style={{ fill: '#ffb300' }}
      d="M31.64,39a2,2,0,0,1-1.42-.59l-8.61-8.61A2,2,0,1,1,24.44,27l7.2,7.2L57.08,8.72a2,2,0,0,1,2.82,2.83L33.05,38.4A2,2,0,0,1,31.64,39Z"
    />
  </svg>
);

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

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      dob: '',
      priority: 'LOW',
      workflowType: '',
      description: ''
    });
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  const todayPrefix = `REQ${yy}${mm}${dd}`;

  try {

    //  Get today's existing requests
    const snapshot = await getDocs(collection(db, "requests"));

    const todayRequests = snapshot.docs.filter(doc =>
      doc.data().requestCode?.startsWith(todayPrefix)
    );

    const nextSeq = String(todayRequests.length + 1).padStart(2, '0');
    const newCode = `${todayPrefix}${nextSeq}`;

    //  Workflow mapping
    const workflowMap = {
  "1": {
    name: "Patient Registration & Consultation",
    steps: ["RECP", "NURS", "DOCS"]
  },
  "2": {
    name: "Laboratory Test Request",
    steps: ["DOCS", "LABS", "MEDR"]
  },
  "3": {
    name: "Pharmacy Medication",
    steps: ["DOCS", "PHAR", "BILL"]
  },
  "4": {
    name: "Insurance Claim Approval",
    steps: ["BILL", "INSR", "ACCS", "ADMIN"]
  },
  "5": {
    name: "Patient Discharge",
    steps: ["DOCS", "LABS", "PHAR", "BILL", "ACCS", "DISC"]
  },
  "6": {
    name: "Emergency Escalation",
    steps: ["NURS", "DOCS", "ADMIN"]
  },
  "7": {
    name: "Medical Records Verification",
    steps: ["RECP", "MEDR", "ADMIN"]
  }
};

    const selectedWorkflow = workflowMap[formData.workflowType];

    await addDoc(collection(db, "requests"), {
  requestCode: newCode,
  fullName: formData.fullName,
  phone: formData.phone,
  dob: formData.dob,
  priority: formData.priority,
  workflowType: selectedWorkflow.name,
  workflowSteps: selectedWorkflow.steps,
  currentStep: 0,
  currentDepartment: selectedWorkflow.steps[0],
  status: "CREATED",
  description: formData.description,
  createdAt: serverTimestamp()
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
        <div className="success-icon">{successicon}</div>
        <h2 className="serif-font">Request Submitted!</h2>
        <p>Your unique request code is: <strong>{requestCode}</strong></p>
        <button className="btn-submit-full" onClick={resetForm} style={{ marginTop: '20px' }}>
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="request-container">
      <div className="page-header">
        <h1>New Patient Request</h1>
        <p>Fill in details and select the appropriate workflow</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>

          <div className="border-section">
            <span className="section-label">PATIENT INFORMATION</span>

            <div className="input-grid">
              <div className="input-group">
                <label>FULL NAME <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  placeholder="Enter your name"
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>PHONE NUMBER<span className="required">*</span></label>
                <input
                  type="text"
                  pattern="[0-9]{10}"
                  required
                  value={formData.phone}
                  placeholder="Enter Phone Number"
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>DATE OF BIRTH</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>PRIORITY</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="LOW">LOW</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-section">
            <span className="section-label">REQUEST DETAILS</span>

            <div className="input-group full">
              <label>WORKFLOW TYPE <span className="required">*</span></label>
              <select
                required
                value={formData.workflowType}
                onChange={e => setFormData({ ...formData, workflowType: e.target.value })}
              >
                <option value="">— Select a workflow —</option>
                <option value="1">Patient Registration & Consultation</option>
                <option value="2">Laboratory Test Request</option>
                <option value="3">Pharmacy Medication</option>
                <option value="4">Insurance Claim Approval</option>
                <option value="5">Patient Discharge</option>
                <option value="6">Emergency Escalation</option>
                <option value="7">Medical Records Verification</option>
              </select>
            </div>

            <div className="input-group full" style={{ marginTop: 20 }}>
              <label>DESCRIPTION <span className="required">*</span></label>
              <textarea
                rows="4"
                required
                value={formData.description}
                placeholder="Briefly describe the medical request, symptoms, or required service..."
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn-submit-full">
            Submit Request
          </button>

        </form>
      </div>
    </div>
  );
}
