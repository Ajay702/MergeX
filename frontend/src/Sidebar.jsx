import React from 'react'
const userInfoString = localStorage.getItem('userInfo');
const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
const username = userInfo ? userInfo.username : 'Default Username';

const Sidebar = () => {
    return (
         <div className="min-vh-100 col-md-3 col-lg-2 sidebar-offcanvas pl-0" id="sidebar" role="navigation" style={{backgroundColor:"#e9ecef"}}>
            <ul className="nav flex-column sticky-top pl-0 pt-5 p-3 mt-3 ">
                <li className="nav-item mb-2 mt-3"><a className="nav-link text-secondary" href="#"><h5>{username}</h5></a></li>
                <li className="nav-item mb-2 "><a className="nav-link text-secondary" href="/profile"><i className="fas fa-user font-weight-bold"></i> <span className="ml-3">Overview</span></a></li>
                <li className="nav-item mb-2 "><a className="nav-link text-secondary" href="/dashboard"><i className="fas fa-user font-weight-bold"></i> <span className="ml-3">Dashboard</span></a></li>
            </ul>
       </div>
    )
}
export default Sidebar;
