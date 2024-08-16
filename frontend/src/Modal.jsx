import React, { useState } from "react";

import "./Modal.css";

export const Modal = ({ closeModal, onSubmit, defaultValue }) => {
  const [formState, setFormState] = useState(
    defaultValue || {
      Serial: "",
      CompanyName: "",
      City: "",
      Country: "",
      Sector: "",
      ContactPerson: "",
      EmailId: "",
      ContactNumber: "",
      ServicePitched: "",
      ExpectedRevenue: "",
      ExpectedClouserDate: "",
      Lead: "",
      Action: "",
    }
  );
  const [errors, setErrors] = useState("");

  const validateForm = () => {
    if (
      formState.CompanyName &&
      formState.City &&
      formState.Country &&
      formState.Sector &&
      formState.ContactPerson &&
      formState.EmailId &&
      formState.ContactNumber
    ) {
      setErrors("");
      return true;
    } else {
      let errorFields = [];
      for (const [key, value] of Object.entries(formState)) {
        if (!value) {
          errorFields.push(key);
        }
      }
      setErrors(errorFields.join(", "));
      return false;
    }
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formState);

    closeModal();
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
        <form>
          <h1 className="mb-20">New Entry</h1>
          <div className="form-group">
            <label htmlFor="CompanyName">CompanyName</label>
            <input
              name="CompanyName"
              onChange={handleChange}
              value={formState.CompanyName}
            />
          </div>
          <div className="form-group">
            <label htmlFor="City">City</label>
            <input name="City" onChange={handleChange} value={formState.City} />
          </div>
          <div className="form-group">
            <label htmlFor="Country">Country</label>
            <input
              name="Country"
              onChange={handleChange}
              value={formState.Country}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Sector">Sector</label>
            <input
              name="Sector"
              onChange={handleChange}
              value={formState.Sector}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ContactPerson">ContactPerson</label>
            <input
              name="ContactPerson"
              onChange={handleChange}
              value={formState.ContactPerson}
            />
          </div>
          <div className="form-group">
            <label htmlFor="EmailId">EmailId</label>
            <input
              name="EmailId"
              onChange={handleChange}
              value={formState.EmailId}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ContactNumber">ContactNumber</label>
            <input
              name="ContactNumber"
              onChange={handleChange}
              value={formState.ContactNumber}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ServicePitched">ServicePitched</label>
            <input
              name="ServicePitched"
              onChange={handleChange}
              value={formState.ServicePitched}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ExpectedRevenue">ExpectedRevenue</label>
            <input
              name="ExpectedRevenue"
              onChange={handleChange}
              value={formState.ExpectedRevenue}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ExpectedClosureDate">ExpectedClosureDate</label>
            <input
              type="date"
              name="ExpectedClosureDate"
              onChange={handleChange}
              value={formState.ExpectedClosureDate}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Lead">Lead</label>
            <select name="Lead" onChange={handleChange} value={formState.Lead}>
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          {errors && <div className="error">{`Please include: ${errors}`}</div>}
          <button type="submit" className="btn" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
