import React, { useEffect, useState } from "react";
import { Search, PlusSquare, Shield } from 'lucide-react';
import {
  UserPlus,
  FlaskConical,
  Pill,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  FolderCheck,
} from "lucide-react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function HomePage() {

  const [totalRequests, setTotalRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [processedRequests, setProcessedRequests] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const snapshot = await getDocs(collection(db, "requests"));
    const all = snapshot.docs.map(doc => doc.data());

    setTotalRequests(all.length);

    const pending = all.filter(r => r.status === "CREATED").length;
    const processed = all.filter(
      r => r.status === "APPROVED" || r.status === "REJECTED"
    ).length;

    setPendingRequests(pending);
    setProcessedRequests(processed);
  };

  const workflows = [
    {
      title: "Patient Registration & Consultation",
      icon: <UserPlus size={18} />,
      tags: ["RECP", "NURS", "DOCS"],
    },
    {
      title: "Laboratory Test Request",
      icon: <FlaskConical size={18} />,
      tags: ["DOCS", "LABS", "MEDR"],
    },
    {
      title: "Pharmacy Medication",
      icon: <Pill size={18} />,
      tags: ["DOCS", "PHAR", "BILL"],
    },
    {
      title: "Insurance Claim Approval",
      icon: <ShieldCheck size={18} />,
      tags: ["BILL", "INSR", "ACCS", "ADMIN"],
    },
    {
      title: "Patient Discharge",
      icon: <FileCheck size={18} />,
      tags: ["DOCS", "LABS", "PHAR", "BILL", "ACCS"],
    },
    {
      title: "Medical Records Verification",
      icon: <FolderCheck size={18} />,
      tags: ["RECP", "MEDR", "ADMIN"],
    },
    {
      title: "Emergency Escalation",
      icon: <AlertTriangle size={18} />,
      tags: ["NURS", "DOCS", "ADMIN"],
    },
  ];

  const departments = [
    "DOCTOR","NURSING","LABORATORY","RADIOLOGY","PHARMACY","BILLING",
    "INSURANCE DESK","MEDICAL RECORDS","RECEPTION","DISCHARGE MANAGEMENT","ACCOUNTS","ADMINSTRATION"
  ];

  return (
    <div className="main-content">

      {/* HERO */}
      <div className="home-hero">
        <div className="home-hero-text">
          <span className="badge-pill">HOSPITAL INTER DEPARTMENT WORKFLOW SYSTEM</span>

          <h1 className="hero-title serif-font">
            Smarter <span>Patient</span><br/>Care Management
          </h1>

          <p>
            Submit requests, let each department process their step,
            and track progress in real time.
          </p>

          <div className="hero-buttons">
            <a href="/new-request" className="btn-primary" style={{ textDecoration: 'none' }}>
              <PlusSquare size={18} />New Request
            </a>
            <a href="/status" className="btn-primary" style={{ textDecoration: 'none' }}>
              <Search size={18} />Track
            </a>
            <a href="/staff" className="btn-primary" style={{ textDecoration: 'none' }}>
              <Shield size={18} />Staff Login
            </a>
          </div>

          {/* 🔥 ONLY ADDED THIS SMALL STATS BLOCK */}
          <div style={{ marginTop: "20px" }}>
            <p>Total Requests: <strong>{totalRequests}</strong></p>
            <p>Pending: <strong>{pendingRequests}</strong></p>
            <p>Processed: <strong>{processedRequests}</strong></p>
          </div>

        </div>
      </div>

      {/* WORKFLOWS */}
      <div className="workflow-section">
        <h3 className="section-title">WORKFLOWS</h3>

        <div className="workflow-grid">
          {workflows.map((wf, i) => (
            <div key={i} className="workflow-card">
              <div className="workflow-title">
                {wf.icon}
                {wf.title}
              </div>

              <div className="workflow-tags">
                {wf.tags.map((tag, idx) => (
                  <span key={idx} className="workflow-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEPARTMENTS */}
      <div className="department-section">
        <h3 className="section-title">DEPARTMENTS</h3>

        <div className="dept-grid">
          {departments.map((d, i) => (
            <div key={i} className="dept-card">{d}</div>
          ))}
        </div>
      </div>

    </div>
  );
}