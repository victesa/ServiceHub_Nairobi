import React from "react";

function ServiceCard({ service, image, name, onClick }) {
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
        cursor: "pointer"
      }}
      onClick={onClick}
    >
      <div style={{ height: "30%", display: "flex", alignItems: "center" }}>
        <p style={{ color: "white", fontWeight: "bold", padding: "10px", textAlign: "left", fontSize: "20px", margin: "0px" }}>
          {name}
        </p>
      </div>
      <div style={{ width: "198px", flex: 1, backgroundColor: "#80CBA0", margin: "0 5px", marginBottom: "5px", border: "1px solid #80CBA0", borderRadius: "15px", overflow: "hidden" }}>
        <img src={image} alt="Service" style={{ backgroundColor: "#80CBA0", objectFit: "cover", width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

export default ServiceCard;
