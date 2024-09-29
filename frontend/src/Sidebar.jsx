import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ userid }) => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [records, setRecords] = useState([]);
    const [newRecordName, setNewRecordName] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {

        const fetchUserData = async () => {
            if (!userid) {
                console.error('No userId available');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5000/user/${userid}`);
                setUserInfo(response.data);
                fetchRecords(response.data._id);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [userid]);

    const fetchRecords = async (userId) => {
        if (!userId) {
            console.error('No userId available for fetching records');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5000/user/records/${userId}`);
             ("Fetched records:", response.data);
            setRecords(response.data);
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    const addRecord = async () => {
        if (newRecordName && userInfo && userInfo._id) {
             ('Attempting to add record:', { userId: userInfo._id, name: newRecordName });
            try {
                const response = await axios.post('http://localhost:5000/records', {
                    userId: userInfo._id,
                    name: newRecordName,
                    description: '',
                    columns: [],
                    rows: []
                });

                if (response.data && response.data.record) {
                    setRecords([...records, response.data.record]);
                    setNewRecordName('');
                } else {
                    console.error('Unexpected response format:', response.data);
                }
            } catch (error) {
                console.error('Error adding record:', error.response ? error.response.data : error.message);
            }
        } else {
            console.error('Missing required data:', { newRecordName, userInfo });
        }
    };

    const deleteRecord = async (recordId) => {
        if (!recordId) {
            console.error('No recordId provided');
            return;
        }
    
    
        try {
            const response = await axios.delete(`http://localhost:5000/records/${userid}/${recordId}`);
            setRecords(records.filter(record => record._id !== recordId));
            
            navigate(`/profile/${userid}`);
        } catch (error) {
            console.error('Error deleting record:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    if (!userInfo) {
        return <div>Loading...</div>;
    }


    return (
        <div className="min-vh-100 col-md-3 col-lg-2 sidebar-offcanvas pl-0" id="sidebar" role="navigation" style={{backgroundColor:"#e9ecef"}}>
            <ul className="nav flex-column sticky-top pl-0 pt-5 p-3 mt-3">
                <li className="nav-item mb-2 mt-3">
                    <a className="nav-link text-secondary" href="#">
                        <h5>{userInfo.username}</h5>
                    </a>
                </li>
                <li className="nav-item mb-2">
                    <a className="nav-link text-secondary" href={`/profile/${userid}`}>
                        <i className="fas fa-user font-weight-bold mr-1"></i> <span className="ml-3">Profile</span>
                    </a>
                </li>
                <li className="nav-item mb-2">
                    <a
                        className="nav-link text-secondary d-flex align-items-center"
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
                            {records.map((record) => (
                                <li key={record._id} className="nav-item mb-1 mx-4 d-flex justify-content-between align-items-center">
                                    <a className="nav-link text-secondary" href={`/records/${userid}/${record._id}`}>
                                        {record.name}
                                    </a>
                                    <button className="btn btn-link text-danger p-0" onClick={(e) => {
                                        e.preventDefault(); 
                                        deleteRecord(record._id);
                                    }}>
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