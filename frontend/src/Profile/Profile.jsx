import React, { useEffect, useState } from "react";
import ProfileContent from "./ProfileContent";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import * as XLSX from "xlsx";
import { Modal } from "../Modal";
import "bootstrap/dist/css/bootstrap.min.css";

function Profile() {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataToEdit, setDataToEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/AmanSheet.xlsx");
        const blob = await response.blob();
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
          const transformedData = rows.map((row) => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });
          setData(transformedData);
          console.log(data);
        };

        reader.readAsBinaryString(blob);
      } catch (error) {
        console.error("Error reading the file:", error);
      }
    };

    fetchData();
  }, []);
  

  const handleDeleteData = (targetIndex) => {
    setData(data.filter((_, idx) => idx !== targetIndex));
  };

  const handleEditData = (idx) => {
    setDataToEdit(idx);
    setModalOpen(true);
  };

  const handleSubmit = async (newData) => {
    try {
      const updatedData = [...data];
      if (dataToEdit !== null) {
        updatedData[dataToEdit] = newData;
      } else {
        updatedData.push(newData);
      }

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(updatedData);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

      const formData = new FormData();
      formData.append("file", new Blob([excelBuffer]), "AmanSheet.xlsx");
      await fetch("/updateAmanSheet", {
        method: "POST",
        body: formData,
      });

      setData(updatedData);
    } catch (error) {
      console.error("Error updating the file:", error);
    }
  };
  
  const exportToExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Create a new worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Form Data");
    // Export the workbook to a file
    XLSX.writeFile(wb, "form_data.xlsx");
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left">
          <Sidebar />
          <ProfileContent
            data={data}
            deleteData={handleDeleteData}
            editData={handleEditData}
          />
          {/* <div>
            <button onClick={() => setModalOpen(true)} className="btn">
              Add
            </button>
            <button className="btn" onClick={exportToExcel}>
              Update
            </button>
          </div> */}
          {modalOpen && (
            <Modal
              closeModal={() => {
                setModalOpen(false);
                setDataToEdit(null);
              }}
              onSubmit={handleSubmit}
              defaultValue={dataToEdit !== null ? data[dataToEdit] : null}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
