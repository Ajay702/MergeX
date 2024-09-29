import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfileContent from "./ProfileContent";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

function Profile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);


  return (
    <div>
      <Navbar />
      <div className="container-fluid" id="main">
        <div style={{ border: '1px solid red' }}> 
          <div className="row row-offcanvas row-offcanvas-left">
            <Sidebar userid={userId} />
            {userData && <ProfileContent userData={userData} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
