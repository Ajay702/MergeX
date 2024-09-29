import React, { useState } from "react";
import "./Modal.css";

export const Modal = ({ closeModal, onSubmit, defaultValue, columns }) => {
  const [formState, setFormState] = useState(defaultValue || {});

  console.log("Modal rendered with defaultValue:", defaultValue);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Modal submitting formState:", formState);
    onSubmit(formState);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title mx-auto">Edit Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {columns.map((column) => (
              <div key={column} className="form-group">
                <label htmlFor={column}>{column}</label>
                <input
                  id={column}
                  name={column}
                  onChange={handleChange}
                  value={formState[column] || ""}
                  className="form-input"
                />
              </div>
            ))}
          </div>
          <div className="button-group">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" className="cancel-btn mt-1" onClick={closeModal}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};