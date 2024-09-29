import React, { useState, useRef, useEffect } from "react";
import { BsFillPersonFill, BsPencil, BsCamera, BsX } from "react-icons/bs";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileContent = ({ userData }) => {
  const [editMode, setEditMode] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);

  const [username, setUsername] = useState(userData.username);
  const [email, setEmail] = useState(userData.email);
  const [contact, setContact] = useState(userData.contact || "");
  const [emailVerified, setEmailVerified] = useState(userData.emailVerified);
  const [role, setRole] = useState(userData.role || "");
  const [mobileVerified, setMobileVerified] = useState(userData.mobileVerified);
  const [profilePic, setProfilePic] = useState(userData.profilePic || '');
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const fileInputRef = useRef(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user/${userData._id}`);
      const user = response.data;
      setUsername(user.username);
      setEmail(user.email);
      setContact(user.contact || "");
      setEmailVerified(user.emailVerified);
      setRole(user.role || "");
      setMobileVerified(user.mobileVerified);
      setProfilePic(user.profilePic || '');
      setProfilePicPreview(null); 
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      setShowDoneButton(false);
      fetchUserData(); 
    }
  };

  const handleChange = () => {
    setShowDoneButton(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
      handleChange();
    }
  };

  const handleDoneClick = async () => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('contact', contact);
      formData.append('role', role);
      formData.append('emailVerified', emailVerified);
      formData.append('mobileVerified', mobileVerified);
      
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formData.append('profilePic', fileInputRef.current.files[0]);
      }

      const response = await axios.put(`http://localhost:5000/user/${userData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setEditMode(false);
      setShowDoneButton(false);
      fetchUserData(); 
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  console.log(userData._id);


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
          <BsFillPersonFill style={{ marginBottom: "10px" }} /> My Profile
        </h1>
        <div className="card" style={{ width: "1250px", height: "550px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", border: "none", borderRadius: "20px", position: "relative", zIndex: 1, backgroundColor: "white" }}>
          <div className="d-flex h-100">
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
                <div style={{ position: 'relative' }}>
                  <img
                    src={profilePicPreview || (profilePic ? `http://localhost:5000${profilePic}` : 'https://cdn.lazyshop.com/files/9b0d8bde-34c0-460a-b131-e7a87b1e0543/product/c2ad3c65cc900128e06962ac5a49a81d.jpeg')}
                    alt="Profile"
                    className="img-fluid rounded-circle mb-3"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                  {editMode && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '0',
                        background: 'white',
                        borderRadius: '50%',
                        padding: '5px',
                        cursor: 'pointer'
                      }}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <BsCamera size={20} />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <h4 className="mb-1">{username}</h4>
                <p className="text-muted mb-0">{email}</p>
              </div>
            </div>
            <div className="d-flex justify-content-start align-items-start p-5 mt-4" style={{ width: "70%" }}>
              <div className="d-flex flex-column" style={{ marginRight: "90px" }}>
                <h5 className="mb-5" style={{ color: "#757575" }}><strong>Name</strong></h5>
                <h5 className="mb-5" style={{ color: "#757575" }}><strong>Email</strong></h5>
                <h5 className="mb-5" style={{ color: "#757575" }}><strong>Contact</strong></h5>
                <h5 className="mb-5" style={{ color: "#757575" }}><strong>Email Verification</strong></h5>
                <h5 className="mb-5" style={{ color: "#757575" }}><strong>Role</strong></h5>
                <h5 className="mb-5" style={{ color: "#757575" }}><strong>Mobile Verification</strong></h5>
              </div>
              <div className="d-flex flex-column" style={{ marginRight: "150px" }}>
                <h5 className="mb-5" style={{ color: "#757575" }}><strong>:</strong></h5>
                <h5 className="mb-5" style={{ color: "#757575" }}><strong>:</strong></h5>
                <h5 className="mb-5" style={{ color: "#757575" }}><strong>:</strong></h5>
                <h5 className="mb-5" style={{ color: "#757575" }}><strong>:</strong></h5>
                <h5 className="mb-5" style={{ color: "#757575" }}><strong>:</strong></h5>
                <h5 className="mb-5" style={{ color: "#757575" }}><strong>:</strong></h5>
              </div>
              <div className="d-flex flex-column mb-5">
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); handleChange(); }}
                      className="form-control"
                      style={{ color: "#616161", marginBottom: "32px" }}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); handleChange(); }}
                      className="form-control"
                      style={{ color: "#616161", marginBottom: "32px" }}
                    />
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => { setContact(e.target.value); handleChange(); }}
                      className="form-control"
                      style={{ color: "#616161", marginBottom: "32px" }}
                    />
                    <select
                      value={emailVerified ? 'true' : 'false'}
                      onChange={(e) => { setEmailVerified(e.target.value === 'true'); handleChange(); }}
                      className="form-control"
                      style={{ color: "#616161", marginBottom: "32px" }}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => { setRole(e.target.value); handleChange(); }}
                      className="form-control"
                      style={{ color: "#616161", marginBottom: "32px" }}
                    />
                    <select
                      value={mobileVerified ? 'true' : 'false'}
                      onChange={(e) => { setMobileVerified(e.target.value === 'true'); handleChange(); }}
                      className="form-control"
                      style={{ color: "#616161", marginBottom: "32px" }}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </>
                ) : (
                  <>
                    <h5 className="mb-5" style={{ color: "#616161" }}><strong>{username}</strong></h5>
                    <h5 className="mb-5" style={{ color: "#616161" }}><strong>{email}</strong></h5>
                    <h5 className="mb-5" style={{ color: "#616161" }}><strong>{contact}</strong></h5>
                    <h5 className="mb-5" style={{ color: "#616161" }}><strong>{emailVerified ? 'Yes' : 'No'}</strong></h5>
                    <h5 className="mb-5" style={{ color: "#616161" }}><strong>{role}</strong></h5>
                    <h5 className="mb-5" style={{ color: "#616161" }}><strong>{mobileVerified ? 'Yes' : 'No'}</strong></h5>
                  </>
                )}
              </div>
            </div>
            <div style={{ position: 'absolute', top: '10px', right: '20px', zIndex: 3 }}>
              {editMode ? (
                <BsX size={30} onClick={handleEditToggle} style={{ cursor: 'pointer', color: "red" }} />
              ) : (
                <BsPencil size={30} onClick={handleEditToggle} style={{ cursor: 'pointer', color: "#6B62E5" }} />
              )}
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
