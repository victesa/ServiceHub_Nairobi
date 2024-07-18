import React, { useEffect, useState } from "react";
import { BasicHeaderServiceHub, ClientHomeScreenHeader } from "../../common/components/Header";
import SearchBar from "../components/SearchBar";
import ServiceCard from "../components/serviceCard";

function ClientHomeScreen() {
  const [title, setTitle] = useState("Popular Services");
  const [servicesList, setServicesList] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/popularServices", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title }),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Fetched services:", data); // Log fetched data
        if (Array.isArray(data)) {
          setServicesList(data);
        } else {
          console.error("Received data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [title]);

  const searchServices = async (searchTerm) => {
    if(searchTerm == ""){
        
    }else{
        try {
      const response = await fetch("http://localhost:5000/searchServices", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchParams: searchTerm }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Searched services:", data); // Log searched data
      if (Array.isArray(data)) {
        setServicesList(data);
        setTitle(searchTerm);
      } else {
        console.error("Received data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

    }
    
  return (
    <div style={{ maxWidth: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ClientHomeScreenHeader />

      <div style={{ maxWidth: "100%", height: "15%", display: 'flex', justifyContent: "center", alignItems: "center", marginBottom: "20px", marginTop: "64px" }}>
        <SearchBar onSearch={searchServices} />
      </div>

      <div style={{ maxWidth: "100%", flex: 1, display: 'flex', flexDirection: "column", justifyItems: 'center', padding: "0 20px", overflowY: "auto" }}>
        <div style={{ width: "100%" }}>
          <p style={{ fontSize: "30px", textAlign: "start" }}>{title}</p>
        </div>
        <div style={{ maxWidth: "100%", display: 'flex', flexWrap: 'wrap', gap: "20px", width: "100%", maxHeight: "100%"}}>
          {servicesList.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClientHomeScreen;
