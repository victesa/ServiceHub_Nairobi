import React from "react";
import img from "../images/heroImg.png";

function HeroSectionUnAuthenticated() {
  const divStyle = {
    display: "flex",
    flexDirection: "column",
    width: "80vw",
    height: "65vh",
    backgroundImage: `url(${img})`,
    backgroundSize: "contain",  // Ensures the image fits within the div
    backgroundRepeat: "no-repeat",  // Prevents repeating the image
    backgroundPosition: "center",  // Centers the image within the div
    border: "1px solid #013A12",
    borderRadius: "15px",
  };

  return (
    <div style={divStyle}>
      {/* Content inside the div if needed */}
    </div>
  );
}

export default HeroSectionUnAuthenticated;
