import React, { useState } from 'react';

const Sidebar = () => {
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    const username = userInfo ? userInfo.username : 'Default Username';

    const [records, setRecords] = useState(['Record 1', 'Record 2', 'Record 3']); // Example records
    const [newRecordName, setNewRecordName] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const addRecord = () => {
        if (newRecordName) {
            setRecords([...records, newRecordName]);
            setNewRecordName('');
        }
    };

    const deleteRecord = (index) => {
        setRecords(records.filter((_, i) => i !== index));
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="min-vh-100 col-md-3 col-lg-2 sidebar-offcanvas pl-0" id="sidebar" role="navigation" style={{backgroundColor:"#e9ecef"}}>
            <ul className="nav flex-column sticky-top pl-0 pt-5 p-3 mt-3">
                <li className="nav-item mb-2 mt-3">
                    <a className="nav-link text-secondary" href="#">
                        <h5>{username}</h5>
                    </a>
                </li>
                <li className="nav-item mb-2">
                    <a className="nav-link text-secondary" href="/profile">
                        <i className="fas fa-user font-weight-bold mr-1 "></i> <span className="ml-3">Profile</span>
                    </a>
                </li>
                <li className="nav-item mb-2">
                    <a
                        className="nav-link text-secondary d-flex  align-items-center"
                        href="#"
                        onClick={toggleDropdown}
                    >
                        <span>
                            <i className="fas fa-folder-open font-weight-bold"></i> <span className="ml-3">Records</span>
                        </span>
                        <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} mx-2`}></i>
                    </a>
                    {isDropdownOpen && (
                        <ul className="pl-3 mt-2">
                            {records.map((record, index) => (
                                <li key={index} className="nav-item mb-1 mx-4 d-flex justify-content-between align-items-center">
                                    <a className="nav-link text-secondary" href={"/dashboard"}>
                                        {record}
                                    </a>
                                    <button className="btn btn-link text-danger p-0" onClick={() => deleteRecord(index)}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </li>
                            ))}
                            <li className="nav-item mb-1 d-flex align-items-center mr-3" style={{marginLeft:'35px'}}>
                                <input 
                                    type="text" 
                                    className="form-control px-2 mr-2" 
                                    placeholder="New Record Name" 
                                    value={newRecordName}
                                    onChange={(e) => setNewRecordName(e.target.value)}
                                />
                                <button className="btn btn-secondary btn-sm" onClick={addRecord}>
                                    <i className="fas fa-plus"></i>
                                </button>
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
