import React, { useState } from "react";
import "./Modal.css";

export const Modal = ({ closeModal, onSubmit, defaultValue, columns }) => {
  const [formState, setFormState] = useState(() => {
    return columns.reduce((acc, column) => {
      if (column !== "Action") {
        acc[column] = defaultValue?.[column] || "";
      }
      return acc;
    }, {});
  });
  const [errors, setErrors] = useState("");

  const validateForm = () => {
    const requiredColumn = columns.find(column => column !== "S.No" && column !== "Action");
    if (!formState[requiredColumn]) {
      setErrors(`Please fill in the ${requiredColumn} field.`);
      return false;
    }
    setErrors("");
    return true;
  };

  const handleChange = (e) => {
    setFormState(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Remove "Action" from formState before submitting
      const { Action, ...formStateWithoutAction } = formState;
      onSubmit(formStateWithoutAction);
      closeModal();
    }
  };

  return (
    <div
      className="modale-container"
      onClick={(e) => {
        if (e.target.className === "modale-container") closeModal();
      }}
    >
      <div className="modale">
        <button className="close-btn" onClick={closeModal}>
          Close
        </button>
        <form onSubmit={handleSubmit}>
          <h1 className="mb-3">New Entry</h1>
          {columns.map((column, index) => {
            if (column !== "S.No" && column !== "Action") {
              const isRequired = index === columns.findIndex(col => col !== "S.No" && col !== "Action");
              return (
                <div className="form-group" key={column}>
                  <label htmlFor={column}>
                    {column}{isRequired && " *"}
                  </label>
                  {column === "Lead" ? (
                    <select
                      name={column}
                      onChange={handleChange}
                      value={formState[column] || ""}
                      required={isRequired}
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  ) : column.toLowerCase().includes("date") ? (
                    <input
                      type="date"
                      name={column}
                      onChange={handleChange}
                      value={formState[column] || ""}
                      required={isRequired}
                    />
                  ) : (
                    <input
                      name={column}
                      onChange={handleChange}
                      value={formState[column] || ""}
                      required={isRequired}
                    />
                  )}
                </div>
              );
            }
            return null;
          })}
          {errors && <div className="error">{errors}</div>}
          <button type="submit" className="btn bg-info mt-3" style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            width: '120px',
            marginLeft: '200px',
            borderRadius: '25px'
          }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};