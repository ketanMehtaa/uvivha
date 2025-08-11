'use client';

import React from "react";

const DeleteAccountPage = () => {
  const handleEmailRedirect = () => {
    const email = "meetketanmehta@gmail.com";
    const subject = "Delete my account in Hamy";
    const body = "Hello,\n\nI would like to delete my Hamy account.\n\nMy Username: [Please enter your username here]\n\nPlease process my account deletion request.\n\nThank you.";
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div style={{ 
      maxWidth: 600, 
      margin: "40px auto", 
      padding: 24, 
      border: "1px solid #eee", 
      borderRadius: 8,
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <h2 style={{ color: "#333", marginBottom: 20 }}>Delete or Disable Your Account</h2>
      
      <p style={{ lineHeight: 1.6, color: "#555" }}>
        To request account deletion or disabling, please send an email to <b>meetketanmehta@gmail.com</b> with the following details:
      </p>
      
      <ul style={{ lineHeight: 1.8, color: "#555", paddingLeft: 20 }}>
        <li>
          <b>Subject:</b> Account Deletion/Disable Request
        </li>
        <li>
          <b>Your Email:</b> (include your email used for account creation)
        </li>
        <li>
          <b>Request:</b> Specify whether you want to <b>delete</b> or <b>disable</b> your account and Reason.
        </li>
      </ul>
      
      <p style={{ lineHeight: 1.6, color: "#555", marginBottom: 30 }}>
        We will process your request as soon as possible. All your data will be deleted or disabled as per your request.
      </p>

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button
          onClick={handleEmailRedirect}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "12px 24px",
            fontSize: "16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#c82333";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#dc3545";
            e.target.style.transform = "translateY(0)";
          }}
        >
          📧 Send Delete Request Email
        </button>
      </div>

      <div style={{ 
        marginTop: 20, 
        padding: 16, 
        backgroundColor: "#f8f9fa", 
        borderRadius: 6,
        fontSize: "14px",
        color: "#666"
      }}>
        <p style={{ margin: 0 }}>
          <b>Note:</b> Clicking the button above will open your default email client with a pre-filled email template. 
          Make sure to include your username before sending the email.
        </p>
      </div>
    </div>
  );
};

export default DeleteAccountPage;