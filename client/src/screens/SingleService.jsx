import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SellerHomeScreenHeader } from "../../common/components/Header";
import image from "../../images/heroPic_3.png"; 

// When the request is successfully sent, a message should be displayed showing that the order has been sent. 
// When the user clicks on ok, it should navigate him to the home screen

function SuccessConfirmationCard({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <p>Order has been sent successfully!</p>
        <button
          onClick={onClose}
          style={{
            padding: "10px 20px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

function OrderCard({ providerId, serviceId }) {
  const [date, setDate] = useState("");
  const [orderDetails, setOrderDetails] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(0)
  const navigate = useNavigate();

  const sendRequest = async () => {
    const requestData = {
      providerId,
      serviceId,
      date,
      orderDetails,
      phoneNumber
    };

    const response = await fetch("http://localhost:5000/sendRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
      credentials: "include",
    });

    if (response.ok) {
      console.log(response.data)
      setShowSuccess(true);
    } else {
      // Handle error
      console.error("Failed to send request");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid black",
        borderRadius: "15px",
        width: "80%",
        padding: "20px",
        justifyContent: "left",
        flexWrap: "unset",
      }}
    >
      <p style={{ fontSize: "25px", margin: 0 }}>Order</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendRequest();
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 20,
          alignItems: "left",
        }}
      >
        <div style={{display: "flex", width: "100%"}}>
          <div style={{display: "flex", flexDirection: "column", width: "50%"}}>
            <label htmlFor="date" style={{ textAlign: "left" }}>
              Date For Booking
            </label>
            <br />
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "85%",
                height: "25px",
                borderRadius: "10px",
                border: "1px solid gray",
                padding: "10px",
              }}
            />
          </div>

          <div style={{display: "flex", width: "50%", justifyContent: "space-between", flexDirection: "column"}}>
            <label htmlFor="phoneNumber" style={{ textAlign: "left" }}>
              Phone Number
            </label>

            <input
            type="number"
            id = "phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              width: "85%",
              height: "25px",
              borderRadius: "10px",
              border: "1px solid gray",
              padding: "10px",
            }}/>
          </div>
        </div>

        <label
          htmlFor="orderDetails"
          style={{ textAlign: "left", marginTop: "40px" }}
        >
          Order Details
        </label>
        <br />
        <textarea
          id="orderDetails"
          value={orderDetails}
          onChange={(e) => setOrderDetails(e.target.value)}
          placeholder="Additional Message"
          style={{
            maxWidth: "100%",
            height: "200px",
            borderRadius: "10px",
            border: "1px solid gray",
            padding: "10px",
          }}
        />

        <div style={{ marginTop: "40px" }}>
          <button
            type="submit"
            style={{
              width: "150px",
              height: "40px",
              backgroundColor: "green",
              color: "white",
              border: "1px solid green",
              borderRadius: "10px",
              marginLeft: "40px",
            }}
          >
            Order
          </button>
        </div>
      </form>

      {showSuccess && <SuccessConfirmationCard onClose={handleSuccessClose} />}
    </div>
  );
}

function ProfileInfo({ profileImage, name, rating }) {
  return (
    <div style={{ display: "flex" }}>
      <img
        src={profileImage}
        alt="Profile"
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: "lightGray",
          borderRadius: "50%",
          objectFit: "cover",
          marginRight: "10px",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ textAlign: "left", fontWeight: "bold", margin: 0 }}>{name}</p>
        <p style={{ textAlign: "left", margin: 0, marginTop: 20 }}>{rating !== null ? `${rating} / 5.0` : `0 / 5.0`}</p>
      </div>
    </div>
  );
}

function Description({ Description }) {
  return (
    <div style={{ backgroundColor: "lightGray", border: "1px solid lightGray", borderRadius: "15px", overflow: "hidden", marginTop: "40px", flex: 1, padding: "20px", width: "80%" }}>
      <p style={{ textAlign: "left", margin: 0, fontSize: "20px", fontWeight: "bold", marginTop: "20px" }}>Description</p>
      <p style={{ textAlign: "start", padding: "20px" }}>{Description}</p>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/');
  }

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", borderBottom: "1px solid gray", backgroundColor: "white" }}>
      <p style={logoStyle} onClick={navigateToHome}>
        <b>ServiceHub</b>
      </p>
    </div>
  );
}

const logoStyle = {
  textAlign: "start",
  color: "green",
  fontSize: "20px",
  padding: "0px 0px 0px 10px",
  cursor: "pointer",
  maxWidth: "100%"
};

function ViewServiceCard() {
  const location = useLocation();
  const { service } = location.state || {};
  console.log("This is the service:", service);

  if (!service) {
    return (
      <div style={{ width: "100vw", height: "calc(100vh - 65px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ fontSize: "20px", color: "red" }}>Service details not found.</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "calc(100vh - 65px)", display: "flex", flexDirection: "column" }}>
      <SellerHomeScreenHeader />

      <div style={{ display: "flex", maxWidth: "100%", flex: 1, marginTop: "64px", padding: "50px" }}>
        <div style={{ display: "flex", flexDirection: "column", width: "60%" }}>
          <ProfileInfo
            profileImage={service.providerProfilePic}
            name={`${service.providerFirstName} ${service.providerLastName}`}
            rating={service.serviceRatings}
          />

          <Description Description={service.serviceDescription} />
        </div>

        <div style={{ flex: 1, height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <OrderCard providerId={service.providerId} serviceId={service.service_Id} />
        </div>
      </div>
    </div>
  );
}

export default ViewServiceCard;
