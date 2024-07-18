import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import image from "../../images/heroPic_3.png";

//if profilePic is null, use the image from the imports

function ProfileInfo({ profileImage, fullName, ratings }) {
  const displayImage = profileImage ? `http://localhost:5000/${profileImage}` : image;

  return (
    <div style={{ display: "flex" }}>
      <img
        src={displayImage}
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
        <p style={{ textAlign: "left", fontWeight: "bold", margin: 0 }}>{fullName}</p>
        <p style={{ textAlign: "left", margin: 0, marginTop: 20 }}>Rating: {ratings} *</p>
      </div>
    </div>
  );
}

function Description({ bookingDate, description }) {
  return (
    <div
      style={{
        backgroundColor: "lightGray",
        border: "1px solid lightGray",
        borderRadius: "15px",
        overflow: "hidden",
        marginTop: "40px",
        flex: 1,
        padding: "20px",
        width: "80%",
      }}
    >
      <p style={{ textAlign: "left", margin: 0, marginTop: "20px", fontWeight: "bold" }}>
        Booking Date: {bookingDate}
      </p>
      <p style={{ textAlign: "left", margin: 0, fontSize: "20px", fontWeight: "bold", marginTop: "20px" }}>
        Description
      </p>
      <p style={{ textAlign: "left", margin: 0, marginTop: "20px" }}>{description}</p>
    </div>
  );
}

function Header() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        borderBottom: "1px solid gray",
        backgroundColor: "white",
      }}
    >
      <p style={logoStyle}>
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
  maxWidth: "100%",
};

function ViewRequestScreen() {
  const { request_id } = useParams();
  const [requestData, setRequestData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:5000/viewSpecificRequest?request_id=${request_id}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setRequestData(data.requests);
      } else {
        // Handle errors
        console.error("Failed to fetch data");
      }
    };

    fetchData();
  }, [request_id]);

  console.log(requestData[0])

  const rejectRequest = async () => {
    const response = await fetch("http://localhost:5000/rejectRequest", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ request_id, client_id: requestData[0].client_id, service_name: requestData[0].service_name }), // send the client_id and service_name from the request data
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Failed to reject the request");
    } else {
      navigate("/serviceProviderScreen");
    }
  };

  const acceptRequest = async () => {
    const response = await fetch("http://localhost:5000/acceptRequest", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ 
        request_id, 
        client_id: requestData[0].client_id, 
        service_name: requestData[0].service_name, 
        booking_date: requestData[0].booking_date, 
        message: requestData[0].message, 
        client_contact_details: requestData[0].client_contact_details 
      }), // send the client_id, booking_date, message, client_contact_details, and service_name from the request data
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Failed to accept the request");
    } else {
      navigate("/serviceProviderScreen");
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <div style={{ maxHeight: "calc(100vh - 64px)", display: "flex", maxWidth: "100%", flex: 1, marginTop: "64px", padding: "50px", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", width: "60%", height: "100%" }}>
          {requestData.map((request, index) => (
            <React.Fragment key={index}>
              <ProfileInfo
                profileImage={request.profilePic}
                fullName={request.full_name}
                ratings={request.ratings}
              />
              <Description bookingDate={request.booking_date} description={request.message} />
            </React.Fragment>
          ))}
        </div>

        <div style={{ marginTop: "40px", width: "60%" }}>
          <div style={{ maxWidth: "80%", display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={rejectRequest}
              style={{
                width: "150px",
                height: "40px",
                backgroundColor: "red",
                color: "white",
                border: "1px solid red",
                borderRadius: "10px",
              }}
            >
              Reject
            </button>

            <button
              onClick={acceptRequest}
              style={{
                width: "150px",
                height: "40px",
                backgroundColor: "green",
                color: "white",
                border: "1px solid green",
                borderRadius: "10px",
              }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewRequestScreen;
