import React, { useState } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";

const Dashboard = ({ data, deleteData, editData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([
    "S.No",
    "Company Name",
    "City",
    "Country",
    "Sector",
    "Contact Person",
    "Email Id",
    "Contact Number",
    "Service Pitched",
    "Expected Revenue",
    "Expected Closure Date MM/YY",
    "Lead",
    "Action",
  ]);
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const addColumn = () => {
    const newColumnName = prompt("Enter the name of the new column:");
    if (newColumnName && newColumnName.trim() !== "") {
      const newColumns = [...columns];
      const actionIndex = newColumns.indexOf("Action");
      newColumns.splice(actionIndex, 0, newColumnName.trim());
      setColumns(newColumns);
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
      if (columnIndex !== -1 && columnIndex !== 0 && columnIndex !== columns.length - 1) {
        const newColumns = columns.filter((_, index) => index !== columnIndex);
        setColumns(newColumns);
      } else {
        alert("Column not found or cannot delete S.No and Action columns.");
      }
    }
  };

  return (
    <div className="col main pt-5 mt-3">
      <p className="lead d-none d-sm-block">Add Items to the list</p>
      <div
        className="alert alert-warning fade collapse"
        role="alert"
        id="myAlert"
      >
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">×</span>
          <span className="sr-only">Close</span>
        </button>
        <strong>Data and Records</strong> Learn more about employee
      </div>
      <div></div>
      <div className="row mb-3">
        <div className="col-xl-3 col-sm-6 py-2">
          <div className="card bg-success text-white h-100">
            <div
              className="card-body bg-dark d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#57b960" }}
            >
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
      <div className="mb-3">
        <button onClick={addColumn} className="btn btn-primary mr-2">Add Column</button>
        <button onClick={deleteColumn} className="btn btn-danger">Delete Column</button>
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
                {columns.map((column, colIdx) =>
                  column === "S.No" ? (
                    <td key={colIdx}>{startIndex + idx + 1}</td>
                  ) : column === "Action" ? (
                    <td key={colIdx} className="fit">
                      <span className="actions">
                        <BsFillPencilFill
                          className="ml-2"
                          onClick={() => editData(startIndex + idx)}
                        />
                        <BsFillTrashFill
                          className="ml-2 text-danger"
                          onClick={() => deleteData(startIndex + idx)}
                        />
                      </span>
                    </td>
                  ) : (
                    <td key={colIdx}>{item[column.replace(/ /g, "")]}</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination float-right">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
