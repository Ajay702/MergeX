import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import * as XLSX from "xlsx";
import { Modal } from "../Modal";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [fileName, setFileName] = useState("");
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      let dataColumns = Object.keys(data[0]);
      
      // Check if "S.No" is already present
      const hasSerialNumber = dataColumns.includes("S.No");
      
      // If "S.No" is not present, add it at the beginning
      if (!hasSerialNumber) {
        dataColumns = ["S.No", ...dataColumns];
      }
      
      // Ensure "Action" is always at the end
      dataColumns = dataColumns.filter(col => col !== "Action");
      dataColumns.push("Action");
      
      setColumns(dataColumns);
      
      // Update data to include S.No if it's not present
      if (!hasSerialNumber) {
        const updatedData = data.map((item, index) => ({
          "S.No": index + 1,
          ...item
        }));
        setData(updatedData);
      }
    }
  }, [data]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
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
        setData(transformedData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleDeleteData = (targetIndex) => {
    setData(data.filter((_, idx) => idx !== targetIndex));
  };

  const handleEditData = (idx) => {
    setDataToEdit(idx);
    setModalOpen(true);
  };

    const openModal = (idx) => {
    setDataToEdit(idx);
    setModalOpen(true);
  };
  const handleSubmit = async (newData) => {
    try {
      const updatedData = [...data];
      if (dataToEdit !== null) {
        updatedData[dataToEdit] = newData;
      } else {
        newData["S.No"] = updatedData.length + 1;
        updatedData.push(newData);
      }
      setData(updatedData);
      setModalOpen(false);
      setDataToEdit(null);
    } catch (error) {
      console.error("Error updating the data:", error);
    }
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Form Data");
    XLSX.writeFile(wb, fileName || "exported_data.xlsx");
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left">
          <Sidebar />
          <Dashboard
            data={data}
            setData={setData}
            deleteData={handleDeleteData}
            editData={openModal}
            exportToExcel={exportToExcel}
            handleFileUpload={handleFileUpload}
            fileName={fileName}
            columns={columns}
            openModal={openModal}
          />
          {modalOpen && (
            <Modal
              closeModal={() => {
                setModalOpen(false);
                setDataToEdit(null);
              }}
              onSubmit={handleSubmit}
              defaultValue={dataToEdit !== null ? data[dataToEdit] : null}
              columns={columns.filter(col => col !== "S.No" && col !== "Action")}
            />
          )}
        </div>
      </div>
    </div>
  );
}


export default App;