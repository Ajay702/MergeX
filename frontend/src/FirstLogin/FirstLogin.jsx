import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Dashboard from "../Dashboard";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import * as XLSX from "xlsx";
import { Modal } from "../Modal";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const { userId, recordId } = useParams();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [fileName, setFileName] = useState("");
  const [columns, setColumns] = useState([]);
  const [userData, setUserData] = useState(null);
  const [recordData, setRecordData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchRecordData = async () => {
      if (!userId || !recordId) {
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/records/${userId}/${recordId}`);
        setRecordData(response.data);
        setData(response.data.rows || []);
        setColumns(response.data.columns.map(col => col.name) || []);
        setFileName(response.data.name || "");
      } catch (error) {
        console.error("Error fetching record data:", error);
      }
    };

    if (location.pathname.includes('/records/')) {
      fetchRecordData();
    }
  }, [userId, recordId, location]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          blankrows: false,
        });
        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        const transformedData = rows.map((row, index) => {
          const obj = {};
          headers.forEach((header, idx) => {
            obj[header] = row[idx];
          });
          if (!headers.includes("S.No")) {
            obj["S.No"] = index + 1;
          }
          return obj;
        });

        try {
          // Update the backend
          const response = await axios.put(`http://localhost:5000/records/${userId}/${recordId}`, {
            name: file.name,
            columns: headers.map(header => ({ name: header, type: 'string' })),
            rows: transformedData
          });

          if (response.status === 200) {
            // Update local state
            setData(transformedData);
            setColumns(['S.No', ...headers, 'Action']);
            console.log("File uploaded successfully");
          } else {
            throw new Error("Failed to update record");
          }
        } catch (error) {
          console.error("Error uploading file:", error);
          alert("Failed to upload file. Please try again.");
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleDeleteData = (targetIndex) => {
    setData(data.filter((_, idx) => idx !== targetIndex));
  };

  const openModal = (rowData) => {
    console.log("Opening modal with data:", rowData);
    setDataToEdit(rowData);
    setModalOpen(true);
  };

  // const handleSubmit = async (newData) => {
  //   try {
  //     if (!userData || !userData._id) {
  //       throw new Error('User data not available');
  //     }

  //     let url = 'http://localhost:5000/records';
  //     let method = 'POST';

  //     if (recordId) {
  //       url = `http://localhost:5000/records/${userId}/${recordId}`;
  //       method = 'PUT';
  //     }

  //     // Update the specific row
  //     const updatedRows = data.map(row =>
  //       row['S.No'] === newData['S.No'] ? newData : row
  //     );

  //     const recordData = {
  //       userId: userData._id,
  //       name: fileName || "New Record",
  //       description: "Description of the record",
  //       columns: columns.filter(col => col !== "S.No" && col !== "Action").map(col => ({ name: col, type: 'string' })),
  //       rows: updatedRows
  //     };

  //     const response = await axios({
  //       method: method,
  //       url: url,
  //       data: recordData,
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (response.status !== 200 && response.status !== 201) {
  //       throw new Error(response.data.msg || 'Failed to update record');
  //     }

  //     // Update the state with the new data
  //     setData(updatedRows);
  //     setModalOpen(false);
  //     setDataToEdit(null);

  //     console.log('Data saved successfully:', response.data);
  //   } catch (error) {
  //     console.error("Error updating the data:", error.message);
  //   }
  // };

  const handleSubmit = async (newData) => {
    try {
      if (!userData || !userData._id) {
        throw new Error('User data not available');
      }
  
      let url = 'http://localhost:5000/records';
      let method = 'POST';
  
      if (recordId) {
        url = `http://localhost:5000/records/${userId}/${recordId}`;
        method = 'PUT';
      }
  
      let updatedRows;
      if (newData['S.No'] > data.length) {
        updatedRows = [...data, newData];
      } else {
        updatedRows = data.map(row =>
          row['S.No'] === newData['S.No'] ? newData : row
        );
      }
  
      updatedRows = updatedRows.map((row, index) => ({
        ...row,
        'S.No': index + 1
      }));
  
      const recordData = {
        userId: userData._id,
        name: fileName || "New Record",
        description: "Description of the record",
        columns: columns.filter(col => col !== "S.No" && col !== "Action").map(col => ({ name: col, type: 'string' })),
        rows: updatedRows
      };
  
      const response = await axios({
        method: method,
        url: url,
        data: recordData,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data.msg || 'Failed to update record');
      }
  
      setData(updatedRows);
      setModalOpen(false);
      setDataToEdit(null);
  
      console.log('Data saved successfully:', response.data);
    } catch (error) {
      console.error("Error updating the data:", error.message);
    }
  };

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName || "exported_data"}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left">
          <Sidebar userid={userId} />
          <Dashboard
            data={data}
            setData={setData}
            exportToExcel={exportToCSV}
            openModal={openModal}
          />
          {modalOpen && (
            <Modal
              closeModal={() => {
                setModalOpen(false);
                setDataToEdit(null);
              }}
              onSubmit={handleSubmit}
              defaultValue={dataToEdit}
              columns={columns.filter(col => col !== "S.No" && col !== "Action")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;