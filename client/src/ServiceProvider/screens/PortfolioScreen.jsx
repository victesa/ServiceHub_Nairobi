import React, { useState } from "react";
import removeBlobPrefix from "../../blobRemover";
import ServiceCard from "../components/ServiceCard2";
import UpdateService from "../components/ServiceView";
import { AddServiceButton } from "../components/ServiceSetup";
import AddServiceCard from "../components/AddServiceCard";

const contentStyle = {
  flex: 1,
  padding: '0px 0px 0px 50px',
  overflow: "auto",
  marginLeft: "20px"
};

function PortfolioScreen({ listOfServices, updateServices }) {
  const [selectedService, setSelectedService] = useState(null);
  const [displayServiceCard, setDisplayServiceCard] = useState(false);
  const [displayAddServiceCard, setDisplayAddServiceCard] = useState(false);
  const [updateService, setUpdateService] = useState(0);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setDisplayServiceCard(true);
  };

  const handleOnClose = ()=>{
    setDisplayAddServiceCard(false);
    setUpdateService(updateService + 1)
    updateServices()}

  const closeUpdateService = () => {
    setSelectedService(null);
    setDisplayServiceCard(false);
    setUpdateService(updateService + 1); // Increment updateService to trigger update
    updateServices(); // Call updateServices to refresh service list
  };

  const deleteService = (serviceId) => {
    // Implement delete service logic here
    console.log(`Delete service with ID: ${serviceId}`);
  };

  // Check if listOfServices is undefined or null
  if (!listOfServices) {
    return <div>Loading...</div>; // or handle loading state as per your UI/UX design
  }

  return (
    <div style={contentStyle}>
      <h1 style={{ textAlign: "left", paddingLeft: "20px" }}>Services</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: "20px" }}>
        <AddServiceButton onClick={() => setDisplayAddServiceCard(true)} disabled={displayAddServiceCard}/>
        {listOfServices.map((service, index) => (
          <ServiceCard
            key={index}
            name={service.name} // Assuming `name` is a property of each service object
            image={removeBlobPrefix(service.image)} // Assuming `image` is a property of each service object
            onClick={() => handleServiceClick(service)}
            service={service}
            updateService={updateService} // Pass updateService to ServiceCard if needed
          />
        ))}
      </div>
      {displayServiceCard && selectedService && (
        <UpdateService
          close={closeUpdateService}
          initialValues={selectedService}
          deleteService={() => deleteService(selectedService._id)} // Assuming `serviceId` is accessible
        />
      )}

      {displayAddServiceCard && (
        <AddServiceCard close={handleOnClose} />
      )}
    </div>
  );
}

export default PortfolioScreen;
