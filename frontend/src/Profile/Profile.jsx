import React, { useEffect, useState } from "react";
import ProfileContent from "./ProfileContent";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

function Profile() {

  return (
    <div>
      <Navbar />
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left">
          <Sidebar />
          <ProfileContent/>
        </div>
      </div>
    </div>
  );
}

export default Profile;
