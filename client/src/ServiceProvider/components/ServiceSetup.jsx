import React, { useState, useEffect } from "react";
import AddServiceCard from "./AddServiceCard";

function AddServiceButton({ onClick, disabled }) {
  return (
    <div
      style={{
        border: disabled ? "2px dotted gray" : "2px dotted green",
        width: "200px",
        height: "200px",
        display: "flex",
        alignItems: "center",
        borderRadius: "15px",
        justifyContent: 'center',
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
      onClick={!disabled ? onClick : null}
    >
      <p style={{ textAlign: "center" }}>Add Service</p>
    </div>
  );
}

function ServiceSetupCard({ service, onDelete }) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${service.name}?`)) {
      onDelete(service.service_Id);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#003912",
        width: "208px",
        height: "260px",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #003912",
        borderRadius: "15px",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={handleDelete}
    >
      <div style={{ height: "30%", display: "flex", alignItems: "center" }}>
        <p style={{ color: "white", fontWeight: "bold", padding: "10px", textAlign: "left", fontSize: "20px", margin: "0px" }}>
          {service.name}
        </p>
      </div>
      <div style={{ width: "198px", flex: 1, backgroundColor: "#80CBA0", margin: "0 5px", marginBottom: "5px", border: "1px solid #80CBA0", borderRadius: "15px", overflow: "hidden" }}>
        <img src={service.image} alt="Service" style={{ backgroundColor: "#80CBA0", objectFit: "cover", width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

function ServiceSetup({ onSubmit }) {
  const [addServiceScreenVisible, setAddServiceScreenVisible] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [updateList, setUpdateList] = useState(0);

  const handleAddService = () => {
    setAddServiceScreenVisible(false);
    setUpdateList(updateList + 1);
  };

  const handleDeleteService = async (serviceId) => {
    try {
      const response = await fetch("http://localhost:5000/deleteService", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serviceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      // Remove the deleted service from the list
      const updatedServices = serviceList.filter((service) => service.service_Id !== serviceId);
      setUpdateList(updateList + 1)
      setServiceList(updatedServices);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/fetchServices", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const services = await response.json();
        setServiceList(services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [updateList]);

  return (
    <div style={{
      height: "calc(100vh - 64px)",
      display: "flex",
      flexDirection: "column",
      padding: "20px",
      paddingLeft: "80px",
      boxSizing: "border-box",
      flex: 1
    }}>
      <div style={{
        flexShrink: 0,
        marginBottom: "20px"
      }}>
        <h1 style={{ textAlign: "left", fontSize: "40px" }}>Service</h1>
        <p style={{ textAlign: "left", color: "gray" }}>Add Services that you want to provide to your clients</p>
        {serviceList.length === 5 && (
          <p style={{ color: "red", fontWeight: "bold" }}>You have reached your limit of 5 services.</p>
        )}
      </div>
      <div style={{
        flex: 1,
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        overflowY: "auto",
        paddingRight: "20px",
        boxSizing: "border-box",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}>
        <AddServiceButton 
          onClick={() => setAddServiceScreenVisible(true)} 
          disabled={serviceList.length === 5}
        />
        {serviceList.map((service) => (
          <ServiceSetupCard 
            key={service.service_Id} 
            service={service} 
            onDelete={handleDeleteService} 
          />
        ))}
      </div>
      {addServiceScreenVisible && (
        <AddServiceCard
          close={handleAddService}
        />
      )}
      <div style={{
        flexShrink: 0,
        marginTop: "20px",
        height: "5%",
        display: "flex",
        justifyContent: "right",
        alignItems: "center"
      }}>
        <button style={{
          width: "130px",
          padding: "10px",
          color: "white",
          backgroundColor: "green",
          border: "1px solid green",
          borderRadius: "15px",
          height: "40px"
        }} onClick={onSubmit}>
          Finish
        </button>
      </div>
    </div>
  );
}

export default ServiceSetup;
export {AddServiceButton}
