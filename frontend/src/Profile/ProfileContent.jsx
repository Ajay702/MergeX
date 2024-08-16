import React, { useState } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";

const ProfileContent = ({ data, deleteData, editData }) => {
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
    <div className="col main pt-5 mt-3" >
    </div>
  );
};

export default ProfileContent;
