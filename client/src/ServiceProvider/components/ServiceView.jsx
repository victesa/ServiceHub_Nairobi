// UpdateService.jsx
import React, { useState, useEffect } from "react";

function UpdateService({ close, initialValues }) {
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [aboutService, setAboutService] = useState("");
  const [serviceId, setServiceId] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setServiceName(initialValues.name);
      setPrice(initialValues.starting_price);
      setAboutService(initialValues.about_service);
      setServiceId(initialValues.service_id);
    }
  }, [initialValues]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("serviceName", serviceName);
      formData.append("price", price);
      formData.append("aboutService", aboutService);
      formData.append("serviceId", serviceId);
      if (image) {
        formData.append("image", image);
      }

      const serviceResponse = await fetch("http://localhost:5000/updateService", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!serviceResponse.ok) {
        throw new Error("Failed to update service");
      }

      const serviceData = await serviceResponse.json();

      setSuccess(true);
      console.log("Service updated successfully");
      handleClose();
    } catch (error) {
      setError("Error updating service: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async () => {
    try {
      const response = await fetch("http://localhost:5000/deleteService", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceId }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      const data = await response.json();
      console.log(data.message);
      handleClose();
    } catch (error) {
      setError("Error deleting service: " + error.message);
    }
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setImage(imageFile);
  };

  const handleClose = () => {
    setServiceName("");
    setPrice("");
    setAboutService("");
    setImage(null);
    setError(null);
    setSuccess(false);
    close(); // Ensure close is invoked correctly
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}>
      <div style={{
        width: "60%",
        height: "80%",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        overflow: "auto",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          cursor: "pointer",
        }} onClick={handleClose}>
          <img src="/path/to/cancel-icon.png" alt="Cancel" />
        </div>
        <form onSubmit={handleSubmit} style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "left",
          width: "50%",
          paddingLeft: "40px"
        }}>
          <p style={{ fontSize: "30px", fontWeight: "bold", textAlign: "left" }}>Update Service</p>
          <label htmlFor="serviceName" style={{ textAlign: "left", fontWeight: "bold" }}>Name of Service</label><br />
          <input
            type="text"
            id="serviceName"
            name="serviceName"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="Service"
            style={{
              width: "400px",
              height: "20px",
              padding: "10px",
              border: "1px solid gray",
              borderRadius: "15px"
            }}
            required
          /><br />

          <label htmlFor="price" style={{ textAlign: "left", fontWeight: "bold" }}>Start Price</label><br />
          <input
            type="text"
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder=""
            style={{
              width: "400px",
              height: "20px",
              padding: "10px",
              border: "1px solid gray",
              borderRadius: "15px"
            }}
            required
          /><br />

          <label htmlFor="aboutService" style={{ textAlign: "left", fontWeight: "bold" }}>About Service</label><br />
          <textarea
            id="aboutService"
            name="aboutService"
            value={aboutService}
            onChange={(e) => setAboutService(e.target.value)}
            style={{ height: "150px", border: "1px solid gray", borderRadius: "15px" }}
          /><br />

          <label htmlFor="image" style={{ textAlign: "left", fontWeight: "bold" }}>Upload Image</label><br />
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: "20px" }}
          /><br />
          {image && (
            <div>
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>
          )}

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>Service updated successfully!</p>}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px" }}>
            <button
              type="button"
              onClick={deleteService}
              style={{
                width: "200px",
                height: "40px",
                color: "white",
                backgroundColor: "red",
                borderRadius: "15px",
                border: "1px solid red",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              disabled={loading}
            >
              Delete
            </button>
            <input
              type="submit"
              value="Update"
              style={{
                width: "200px",
                height: "40px",
                color: "white",
                backgroundColor: "green",
                borderRadius: "15px",
                border: "1px solid green",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateService;
