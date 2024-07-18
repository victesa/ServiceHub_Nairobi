import React, { useRef } from "react";
import imageThree from "../../images/heroPic_3.png"
import imageFour from "../../images/heroPic_4.png"
import imageFive from "../../images/heroPic_5.png"
import imageSix from "../../images/heroPic_6.png"
import imageSeven from "../../images/heroPic_7.png"
import ServiceCard from "../../ServiceProvider/components/ServiceCard2";

const services = [
    {name: "Transport", image: "http://localhost:5000/images/9feb761c-dc27-45a5-a555-1836f3b7e3a3.png"},
    {name: "House Cleaning", image: imageFour},
    {name: "Photography", image: imageThree},
    {name: "Events", image: imageFive},
    {name: "Phone Repair", image: imageSix},
    {name: "Metal work", image: imageSeven}
];


function PopularServicesHome() {
    const scrollContainerRef = useRef(null);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };

    return (
        <div style={{ width: "100vw", paddingLeft: "80px", paddingRight: "80px", position: "relative" }}>
            <h2 style={{ textAlign: "start", fontSize: "45px" }}>Popular Services</h2>
            
            <div style={{ display: "flex", overflowX: "auto", scrollBehavior: "smooth", paddingBottom: "10px" }} ref={scrollContainerRef}>
                {services.map((service, index) => (
                    <div key={index} style={{ marginRight: "20px" }}>
                        <ServiceCard image={service.image} name={service.name} />
                    </div>
                ))}
            </div>

            <button
                onClick={scrollRight}
                style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer"
                }}
            >
                &gt;
            </button>
        </div>
    );
}

export default PopularServicesHome;
