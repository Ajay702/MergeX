import React, { useState, useEffect, useMemo } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from "xlsx";

const Dashboard = ({ data, setData, exportToExcel, openModal }) => {
  const { recordId, userId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/records/${userId}/${recordId}`);
        const recordData = response.data;
        setData(recordData.rows || []);
        const fetchedColumns = recordData.columns.map(col => col.name) || [];
        setColumns(['S.No', ...fetchedColumns.filter(col => col !== 'S.No' && col !== 'Action'), 'Action']);
        setFileUploaded(recordData.rows && recordData.rows.length > 0);
      } catch (error) {
        console.error('Error fetching record:', error);
        setData([]);
        setColumns(['S.No', 'Action']);
      }
    };

    if (recordId) {
      fetchRecord();
    }
  }, [recordId, userId]);



  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
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
  
        const newColumns = ['S.No', ...headers.filter(header => header !== 'S.No' && header !== 'Action'), 'Action'];
  
        const newRows = rows.map((row, index) => {
          const obj = { 'S.No': index + 1 };
          headers.forEach((header, idx) => {
            if (header !== 'S.No' && header !== 'Action') {
              if (header === 'Date') {
                let dateValue = row[idx];
                let formattedDate;
                try {
                  let date;
                  if (typeof dateValue === 'string') {
                    const dateParts = dateValue.split('/');
                    if (dateParts.length === 3) {
                      let [month, day, year] = dateParts;
                      year = year.length === 2 ? `20${year}` : year;
                      date = new Date(year, month - 1, day);
                    } else {
                      date = new Date(dateValue);
                    }
                  } else if (dateValue instanceof Date) {
                    date = dateValue;
                  } else if (typeof dateValue === 'number') {
                    date = new Date((dateValue - 25569) * 86400 * 1000);
                  } else {
                    throw new Error('Unrecognized date format');
                  }
                  if (!isNaN(date.getTime())) {
                    formattedDate = date.toISOString().split('T')[0]; // Store as YYYY-MM-DD
                  } else {
                    throw new Error('Invalid date');
                  }
                } catch (error) {
                  console.error(`Error processing date at index ${index}:`, dateValue, error);
                  formattedDate = 'Invalid Date';
                }
                obj[header] = formattedDate;
              } else {
                obj[header] = row[idx];
              }
            }
          });
          return obj;
        });
  
        try {
          const response = await axios.put(`http://localhost:5000/records/${userId}/${recordId}`, {
            columns: newColumns.filter(col => col !== 'S.No' && col !== 'Action').map(col => ({ name: col, type: 'string' })),
            rows: newRows
          });
  
          if (response.status === 200) {
            setData(newRows);
            setColumns(newColumns);
            setFileUploaded(true);
            console.log("File uploaded successfully");
          } else {
            throw new Error("Failed to update record");
          }
        } catch (error) {
          console.error('Error updating record:', error);
          alert('Error updating record. Please try again.');
        }
      };
      reader.readAsBinaryString(file);
    }
  };
  const processedData = useMemo(() => {
    if (!Array.isArray(data)) {
      console.error('Data is not an array:', data);
      return [];
    }
    return data.map((item, index) => {
      const newItem = { ...item };
      if (newItem['Date']) {
        try {
          let date;
          if (typeof newItem['Date'] === 'string') {
            const dateParts = newItem['Date'].split('/');
            if (dateParts.length === 3) {
              let [month, day, year] = dateParts;
              year = year.length === 2 ? `20${year}` : year;
              date = new Date(year, month - 1, day);
            } else {
              date = new Date(newItem['Date']);
            }
          } else if (newItem['Date'] instanceof Date) {
            date = newItem['Date'];
          } else if (typeof newItem['Date'] === 'number') {
            date = new Date((newItem['Date'] - 25569) * 86400 * 1000);
          } else {
            throw new Error('Unrecognized date format');
          }
          if (!isNaN(date.getTime())) {
            newItem['Date'] = date.toLocaleDateString('en-GB');
          } else {
            throw new Error('Invalid date');
          }
        } catch (error) {
          console.error(`Error processing date at index ${index}:`, newItem['Date'], error);
          newItem['Date'] = 'Invalid Date';
        }
      }
      return newItem;
    });
  }, [data]);


  const filteredData = useMemo(() => {
    const firstDataColumn = columns.find(col => col !== 'S.No' && col !== 'Action');
    return processedData.map((item, index) => ({
      ...item,
      originalIndex: index + 1,
      originalAction: (
        <span className="actions">
          <BsFillPencilFill
            className="ml-2"
            onClick={() => handleEditRow(index)}
          />
          <BsFillTrashFill
            className="ml-2 text-danger"
            onClick={() => deleteRow(index)}
          />
        </span>
      )
    })).filter(item =>
      item[firstDataColumn]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processedData, searchTerm, columns]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const addColumn = async () => {
    const newColumnName = prompt("Enter the name of the new column:");
    if (newColumnName && newColumnName.trim() !== "") {
      try {
        const newColumnTrimmed = newColumnName.trim();
        const newColumns = [...columns.filter(col => col !== 'Action'), newColumnTrimmed, 'Action'];
        const newData = data.map(item => ({ ...item, [newColumnTrimmed]: "" }));

        const response = await axios.put(`http://localhost:5000/records/${userId}/${recordId}`, {
          columns: newColumns.filter(col => col !== 'S.No' && col !== 'Action').map(col => ({ name: col, type: 'string' })),
          rows: newData
        });

        if (response.status === 200) {
          setColumns(newColumns);
          setData(newData);
          console.log("Column added successfully");
        } else {
          throw new Error("Failed to update record");
        }
      } catch (error) {
        console.error("Error adding column:", error);
        alert("Failed to add column. Please try again.");
      }
    } else {
      alert("Column name cannot be empty.");
    }
  };
  const deleteColumn = async () => {
    const columnNameToDelete = prompt("Enter the name of the column you want to delete:");
    if (columnNameToDelete) {
      const trimmedColumnName = columnNameToDelete.trim().toLowerCase();

      if (trimmedColumnName === 's.no') {
        alert("Cannot delete the 'S.No' column.");
        return;
      }

      const columnIndex = columns.findIndex(
        (column) => column.toLowerCase() === trimmedColumnName
      );
      if (columnIndex > 0 && columnIndex < columns.length - 1) {
        try {
          const newColumns = columns.filter((_, index) => index !== columnIndex);
          const newData = data.map(item => {
            const newItem = { ...item };
            delete newItem[columnNameToDelete.trim()];
            return newItem;
          });
          const response = await axios.put(`http://localhost:5000/records/${userId}/${recordId}`, {
            columns: newColumns.filter(col => col !== 'S.No' && col !== 'Action').map(col => ({ name: col, type: 'string' })),
            rows: newData
          });

          if (response.status === 200) {
            setColumns(newColumns);
            setData(newData);
            console.log("Column deleted successfully");
          } else {
            throw new Error("Failed to update record");
          }
        } catch (error) {
          console.error("Error deleting column:", error);
          alert("Failed to delete column. Please try again.");
        }
      } else {
        alert("Cannot delete S.No or Action columns, or column not found.");
      }
    }
  };

  const addRow = () => {
    const newRowIndex = data.length + 1;
    const newRow = {
      'S.No': newRowIndex,
      ...columns.reduce((acc, col) => {
        if (col !== 'S.No' && col !== 'Action') {
          acc[col] = ''; 
        }
        return acc;
      }, {})
    };

    openModal(newRow);
  };



  const deleteRow = async (index) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
  
    if (window.confirm("Are you sure you want to delete this row?")) {
      try {
        const updatedData = data.filter((_, idx) => idx !== actualIndex);

        const rowsToUpdate = updatedData.map((row, idx) => ({
          ...row,
          'S.No': idx + 1
        }));
  
        const response = await axios.put(`http://localhost:5000/records/${userId}/${recordId}`, {
          columns: columns.filter(col => col !== 'Action').map(col => ({ name: col, type: 'string' })),
          rows: rowsToUpdate
        });
  
        if (response.status === 200) {
          setData(rowsToUpdate);
          console.log("Row deleted successfully");
        } else {
          throw new Error("Failed to update record");
        }
      } catch (error) {
        console.error("Error deleting row:", error);
        alert("Failed to delete row. Please try again.");
      }
    }
  };


  const deleteRowNoSn = async () => {
    const rowNumberToDelete = prompt("Enter the S.No of the row you want to delete:");
    if (rowNumberToDelete) {
      const rowIndex = parseInt(rowNumberToDelete) - 1;
      if (rowIndex >= 0 && rowIndex < data.length) {
        try {
          const newData = data.filter((_, index) => index !== rowIndex);
          const updatedData = newData.map((row, index) => ({
            ...row,
            'S.No': index + 1
          }));
  
          // Update the backend
          const response = await axios.put(`http://localhost:5000/records/${userId}/${recordId}`, {
            columns: columns.filter(col => col !== 'Action').map(col => ({ name: col, type: 'string' })),
            rows: updatedData
          });
  
          if (response.status === 200) {
            setData(updatedData);
            setCurrentPage(1); 
            console.log("Row deleted successfully and S.No updated");
          } else {
            throw new Error("Failed to update record");
          }
        } catch (error) {
          console.error("Error deleting row:", error);
          alert("Failed to delete row. Please try again.");
        }
      } else {
        alert("Invalid row number.");
      }
    }
  };

  const handleEditRow = (rowIndex) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + rowIndex;
    const rowData = data[actualIndex];
    openModal(rowData);
  };




  return (
    <div className="col main pt-5 mt-3">
      {!fileUploaded ? (
        <div className="my-3" style={{ width: '250px' }}>
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileUpload}
            className="form-control"
          />
        </div>
      ) : (
        <>
          <div className="alert alert-warning fade collapse" role="alert" id="myAlert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">×</span>
              <span className="sr-only">Close</span>
            </button>
            <strong>Data and Records</strong> Learn more about employee
          </div>

          <div className="row mb-3">
            <div className="col-xl-3 col-sm-6 py-2">
              <div className="card bg-success text-white h-100">
                <div className="card-body bg-dark d-flex justify-content-between align-items-center" style={{ backgroundColor: "#57b960" }}>
                  <div className="rotate">
                    <i className="fa fa-user fa-4x"></i>
                  </div>
                  <div>
                    <h6 className="text-uppercase">Total Leads</h6>
                    <h1 className="display-4">{data.length}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="d-flex align-items-center mb-2">
            <button onClick={addColumn} className="btn btn-primary mr-2">Add Column</button>
            <button onClick={addRow} className="btn btn-primary mr-2">Add Record</button>
            <button onClick={deleteColumn} className="btn btn-danger mr-2">Delete Column</button>
            <button onClick={deleteRowNoSn} className="btn btn-danger mr-2">Delete Record</button>
            <button onClick={exportToExcel} className="btn btn-success">Download As Csv</button>
            <div style={{ position: 'relative', flex: '1', margin: '1rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder={`Search by ${columns.find(col => col !== 'S.No' && col !== 'Action')}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: '1px solid #28a745',
                  borderRadius: '16px',
                  paddingLeft: '40px'
                }}
              />
              <i
                className="fas fa-search"
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#28a745'
                }}
              ></i>
            </div>

            <div className="pagination float-right">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
              <span className="mx-2 my-2">{currentPage}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
          </div>

      <div className="h-60">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              {columns.map((column, idx) => (
                <th key={idx}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody className="tbody-light">
            {currentData.map((item, idx) => (
              <tr key={idx}>
                {columns.map((column, colIdx) => {
                  if (column === "S.No") {
                    return <td key={colIdx}>{item.originalIndex}</td>;
                  } else if (column === "Action") {
                    return (
                      <td key={colIdx} className="fit">
                        {item.originalAction}
                      </td>
                    );
                  } else {
                    return <td key={colIdx}>{item[column]}</td>;
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;