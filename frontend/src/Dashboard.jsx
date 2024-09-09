import React, { useState, useEffect, useMemo } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";

const Dashboard = ({ data, setData, deleteData, editData, exportToExcel, handleFileUpload, openModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const processedData = useMemo(() => {
    return data.map((item, index) => {
      const newItem = { ...item };
      if (newItem['Date']) {
        try {
          let date;
          if (typeof newItem['Date'] === 'string') {
            // Handle string date
            const dateParts = newItem['Date'].split('/');
            if (dateParts.length === 3) {
              let [month, day, year] = dateParts;
              year = year.length === 2 ? `20${year}` : year;
              date = new Date(year, month - 1, day);
            } else {
              // Try parsing as ISO date string
              date = new Date(newItem['Date']);
            }
          } else if (newItem['Date'] instanceof Date) {
            // Already a Date object
            date = newItem['Date'];
          } else if (typeof newItem['Date'] === 'number') {
            // Handle Excel serial number
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


  useEffect(() => {
    if (data.length > 0) {
      let excelColumns = Object.keys(data[0]);
      if (!excelColumns.includes("S.No")) {
        excelColumns = ["S.No", ...excelColumns];
      } else {
        excelColumns = ["S.No", ...excelColumns.filter(col => col !== "S.No")];
      }
      setColumns([...excelColumns, "Action"]);
    }
  }, [data]);

  const filteredData = useMemo(() => {
    return processedData.filter(item =>
      Object.values(item).some(val =>
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [processedData, searchTerm]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const addColumn = () => {
    const newColumnName = prompt("Enter the name of the new column:");
    if (newColumnName && newColumnName.trim() !== "") {
      const newColumns = [...columns];
      newColumns.splice(newColumns.length - 1, 0, newColumnName.trim());
      setColumns(newColumns);
      const newData = data.map(item => ({...item, [newColumnName.trim()]: ""}));
      setData(newData);
    } else {
      alert("Column name cannot be empty.");
    }
  };

  const deleteColumn = () => {
    const columnNameToDelete = prompt("Enter the name of the column you want to delete:");
    if (columnNameToDelete) {
      const columnIndex = columns.findIndex(
        (column) => column.toLowerCase() === columnNameToDelete.trim().toLowerCase()
      );
      if (columnIndex > 0 && columnIndex < columns.length - 1) {
        const newColumns = columns.filter((_, index) => index !== columnIndex);
        setColumns(newColumns);
        const newData = data.map(item => {
          const newItem = {...item};
          delete newItem[columnNameToDelete.trim()];
          return newItem;
        });
        setData(newData);
      } else {
        alert("Cannot delete S.No or Action columns, or column not found.");
      }
    }
  };

  const addRow = () => {
    openModal(null);
  };

  const deleteRow = () => {
    const rowNumberToDelete = prompt("Enter the S.No of the row you want to delete:");
    if (rowNumberToDelete) {
      const rowIndex = parseInt(rowNumberToDelete) - 1;
      if (rowIndex >= 0 && rowIndex < data.length) {
        const newData = [...data];
        newData.splice(rowIndex, 1);
        setData(newData);
      } else {
        alert("Invalid row number.");
      }
    }
  };
  return (
    <div className="col main pt-5 mt-3">
      <div className="my-3" style={{ width: '250px' }}>
        <input
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={(e) => {
            handleFileUpload(e);
            setFileUploaded(true);
          }}
          className="form-control"
        />
      </div>

      {fileUploaded && (
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
            <button onClick={addRow}  className="btn btn-primary mr-2">Add Record</button>
            <button onClick={deleteColumn} className="btn btn-danger mr-2">Delete Column</button>
            <button onClick={deleteRow} className="btn btn-danger mr-2">Delete Record</button>
            <button onClick={exportToExcel} className="btn btn-success">Download As Csv</button>
            <div style={{ position: 'relative', flex: '1', margin: '1rem' }}>
              <input 
                type="text" 
                className="form-control"
                placeholder="Search..."
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
                        return <td key={colIdx}>{(currentPage - 1) * itemsPerPage + idx + 1}</td>;
                      } else if (column === "Action") {
                        return (
                          <td key={colIdx} className="fit">
                            <span className="actions">
                              <BsFillPencilFill className="ml-2" onClick={() => editData((currentPage - 1) * itemsPerPage + idx)} />
                              <BsFillTrashFill className="ml-2 text-danger" onClick={() => deleteData((currentPage - 1) * itemsPerPage + idx)} />
                            </span>
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