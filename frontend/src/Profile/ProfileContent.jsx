import React, { useState } from "react";
import { BsFillPersonFill, BsPencil } from "react-icons/bs";
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileContent = () => {
  const [editMode, setEditMode] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);
  
  const [username, setUsername] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [profilePic] = useState("https://play-lh.googleusercontent.com/oDJlPxyGhm6DtV72DyB09AA2d-UlSoRuySHDxUpq2GF4diwD0w6bTRYKImEVC1CVuw=w5120-h2880");

  const [contact, setContact] = useState("+1234567890");
  const [emailVerified, setEmailVerified] = useState("Verified");
  const [role, setRole] = useState("Administrator");
  const [mobileVerified, setMobileVerified] = useState("Not Verified");

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleChange = () => {
    setShowDoneButton(true);
  };

  const handleDoneClick = () => {
    setEditMode(false);
    setShowDoneButton(false);
  };

  return (
    <div
      className="col main pt-5 mt-3 d-flex flex-column justify-content-between"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#f0f0f0"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "35%",
          backgroundColor: "#6B62E5",
          zIndex: 0
        }}
      />
      
      <div className="d-flex justify-content-center align-items-center" style={{ flex: 1, position: "relative" }}>
        <h1 style={{
          position: "absolute",
          left: "165px",
          top: "35px",
          color: "white",
          fontSize: "35px",
          zIndex: 2
        }}>
          <BsFillPersonFill  style={{marginBottom: "10px"}} /> My Profile
        </h1>
        <div className="card" style={{ width: "1250px", height: "550px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", border: "none", borderRadius: "20px", position: "relative", zIndex: 1, backgroundColor: "white" }}>
          <div className="d-flex h-100">
            {/* Left Side: Profile Picture */}
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ width: "40%", padding: "20px" }}>
              <div style={{
                width: "300px",
                height: "385px",
                backgroundColor: "white",
                borderRadius: "20px",
                boxShadow: "5px 3px 12px rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px"
              }}>
                <img
                  src={profilePic}
                  className="rounded-circle mb-4"
                  alt="Profile"
                  style={{ width: "180px", height: "180px", objectFit: "cover", border: "5px solid white" }}
                />
                <h4 className="mb-1">{username}</h4>
                <p className="text-muted mb-0">{email}</p>
              </div>
            </div>
            {/* Right Side: Attributes and Values in Two Columns */}
            <div className="d-flex justify-content-start align-items-start p-5 mt-4"  style={{ width: "60%" }}>
              <div className="d-flex flex-column" style={{marginRight: "90px"}}>
                <h5 className="mb-5" style={{color: "#757575"}}><strong>Name</strong></h5>
                <h5 className="mb-5" style={{color: "#757575"}}><strong>Email</strong></h5>
                <h5 className="mb-5" style={{color: "#757575"}}><strong>Contact</strong></h5>
                <h5 className="mb-5" style={{color: "#757575"}}><strong>Email Verification</strong></h5>
                <h5 className="mb-5" style={{color: "#757575"}}><strong>Role</strong></h5>
                <h5 className="mb-5" style={{color: "#757575"}}><strong>Mobile Verification</strong></h5>
              </div>
              <div className="d-flex flex-column" style={{marginRight: "150px"}}>
                <h5 className="mb-5" style={{color: "#757575"}}><strong>:</strong></h5>
                <h5 className="mb-5" style={{color: "#757575"}}><strong>:</strong></h5>
                <h5 className="mb-5" style={{color: "#757575"}}><strong>:</strong></h5>
                <h5 className="mb-5" style={{color: "#757575"}}><strong>:</strong></h5>
                <h5 className="mb-5" style={{color: "#757575"}}><strong>:</strong></h5>
                <h5 className="mb-5" style={{color: "#757575"}}><strong>:</strong></h5>
              </div>
              <div className="d-flex flex-column mb-5">
                {editMode ? (
                  <>
                    <input 
                      type="text" 
                      value={username} 
                      onChange={(e) => { setUsername(e.target.value); handleChange(); }} 
                      className="form-control" 
                      style={{color: "#616161", marginBottom: "32px"}}
                    />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => { setEmail(e.target.value); handleChange(); }} 
                      className="form-control" 
                      style={{color: "#616161", marginBottom: "32px"}}
                    />
                    <input 
                      type="text" 
                      value={contact} 
                      onChange={(e) => { setContact(e.target.value); handleChange(); }} 
                      className="form-control" 
                      style={{color: "#616161", marginBottom: "32px"}}
                    />
                    <input 
                      type="text" 
                      value={emailVerified} 
                      onChange={(e) => { setEmailVerified(e.target.value); handleChange(); }} 
                      className="form-control" 
                      style={{color: "#616161", marginBottom: "32px"}}
                    />
                    <input 
                      type="text" 
                      value={role} 
                      onChange={(e) => { setRole(e.target.value); handleChange(); }} 
                      className="form-control" 
                      style={{color: "#616161", marginBottom: "32px"}}
                    />
                    <input 
                      type="text" 
                      value={mobileVerified} 
                      onChange={(e) => { setMobileVerified(e.target.value); handleChange(); }} 
                      className="form-control" 
                      style={{color: "#616161", marginBottom: "32px"}}
                    />
                  </>
                ) : (
                  <>
                    <h5 className="mb-5" style={{color: "#616161"}}><strong>{username}</strong></h5>
                    <h5 className="mb-5" style={{color: "#616161"}}><strong>{email}</strong></h5>
                    <h5 className="mb-5" style={{color: "#616161"}}><strong>{contact}</strong></h5>
                    <h5 className="mb-5" style={{color: "#616161"}}><strong>{emailVerified}</strong></h5>
                    <h5 className="mb-5" style={{color: "#616161"}}><strong>{role}</strong></h5>
                    <h5 className="mb-5" style={{color: "#616161"}}><strong>{mobileVerified}</strong></h5>
                  </>
                )}
              </div>
            </div>
            <div style={{position: 'absolute', top: '10px', right: '20px', zIndex: 3}}>
              <BsPencil size={30} onClick={handleEditClick} style={{cursor: 'pointer', color: "#6B62E5"}} />
            </div>
          </div>
          {showDoneButton && (
            <button 
              className="btn btn-primary" 
              onClick={handleDoneClick} 
              style={{ 
                backgroundColor: "#6B62E5", 
                position: "absolute", 
                bottom: "20px", 
                right: "20px", 
                padding: "10px 20px", 
                borderRadius: "30px",
                zIndex: 3,
                marginTop: "20px"
              }}
            >
              Done
            </button>
          )}
        </div>
      </div>
      <footer style={{ 
        backgroundColor: "#6B62E5", 
        padding: "20px", 
        textAlign: "center", 
        zIndex: 1, 
        color: "white",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        boxSizing: "border-box"
      }}>
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProfileContent;
