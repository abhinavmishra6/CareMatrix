import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Status() {
  const [code, setCode] = useState("");
  const [request, setRequest] = useState(null);

  const searchRequest = async () => {
    const q = query(
      collection(db, "requests"),
      where("requestCode", "==", code)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      setRequest(snapshot.docs[0].data());
    } else {
      alert("Request not found");
    }
  };

  return (
    <div className="request-container">
      <h1>Track Request</h1>

      <input
        placeholder="Enter Request Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={searchRequest}>Search</button>

      {request && (
        <div style={{ marginTop: "20px" }}>
          <h3>{request.fullName}</h3>
          <p>Status: {request.status}</p>
          <p>Department: {request.currentDepartment}</p>
        </div>
      )}
    </div>
  );
}