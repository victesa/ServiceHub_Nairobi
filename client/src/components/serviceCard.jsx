import React from "react";
import testImage from "../../images/testLandscape.png";
import { useNavigate } from "react-router-dom";

function ServiceCard({ service }) {
  const navigate = useNavigate();

  // Set default values if service properties are null or undefined
  const imageSrc = service.serviceImage ? service.serviceImage : testImage;
  const serviceName = service.serviceName ? service.serviceName : "Service Name";
  const providerName = `${service.providerFirstName} ${service.providerLastName}`;
  const serviceRatings = service.serviceRatings ? `${service.serviceRatings}/5.0` : "0/5.0";
  const providerProfilePic = service.providerProfilePic ? service.providerProfilePic : testImage;
  const serviceDescription = service.serviceDescription ? service.serviceDescription : "No description available";
  const serviceStartingPrice = service.serviceStartingPrice ? service.serviceStartingPrice : "0";

  function navigateToViewServicesScreen() {
    navigate("/ViewServices", { state: { service } });
    // Navigate with all the details of this service
  }

  return (
    <div style={{ width: "300px", height: "400px", display: "flex", flexDirection: "column", marginLeft: "20px", marginTop: "10px", backgroundColor: "white", border: "1px solid gray", borderRadius: "10px" }}>
      <div style={{ width: "100%", height: "50%" }}>
        <img src={imageSrc} alt="Service" style={{ minWidth: "100%", minHeight: "100%", maxHeight: "100%", maxWidth: "100%", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }} />
      </div>

      <div style={{ display: "flex", padding: "0 10px", maxHeight: "20%" }}>
        <div style={{ width: "70%", height: "100%" }}>
          <p style={{ fontSize: "17px", fontWeight: "bold", textAlign: "start", margin: 0, marginTop: 15 }}>{serviceName}</p>
          <p style={{ fontSize: "14px", textAlign: "start", margin: 0, marginTop: 8 }}>{providerName}</p>
          <p style={{ fontSize: "14px", textAlign: "start", margin: 0, marginTop: 8 }}>{serviceRatings}</p>
        </div>

        <div style={{ flex: 1, height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src={providerProfilePic} alt="Avatar" style={{ borderRadius: "50%", width: "40px", height: "40px", marginRight: "10px" }} />
        </div>
      </div>

      <div style={{ padding: "0 10px", maxHeight: "20%", overflow: "hidden" }}>
        <p style={{ textAlign: "start", textOverflow: "ellipsis", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
          {serviceDescription}
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1, padding: "0 10px", maxHeight: "100%", height: "100%" }}>
        <p>From KES{serviceStartingPrice}</p>
        <button style={{ padding: "8px 12px", backgroundColor: "green", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }} onClick={navigateToViewServicesScreen}>Book Now</button>
      </div>
    </div>
  );
}

export default ServiceCard;
