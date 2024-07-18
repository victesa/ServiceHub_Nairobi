import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import image from "../../images/heroPic_3.png";

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

function ViewWorkScreen() {
  const { booking_id } = useParams();
  const [requestData, setRequestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/viewSpecificWork?booking_id=${booking_id}`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const bookingsArray = data.bookings || []; // Ensure bookingsArray is always an array

          setRequestData(bookingsArray);
        } else {
          setError("Failed to fetch data");
        }
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [booking_id]);

  const rejectRequest = async () => {
    try {
      const response = await fetch("http://localhost:5000/rejectRequest", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ booking_id, client_id: requestData[0]?.client_id, service_name: requestData[0]?.service_name }), // send the client_id and service_name from the request data
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to reject the request");
      }

      navigate("/serviceProviderScreen");
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const acceptRequest = async () => {
    try {
      const response = await fetch("http://localhost:5000/acceptRequest", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          booking_id,
          client_id: requestData[0]?.client_id,
          service_name: requestData[0]?.service_name,
          booking_date: requestData[0]?.booking_date,
          message: requestData[0]?.message,
          client_contact_details: requestData[0]?.client_contact_details,
        }), // send the client_id, booking_date, message, client_contact_details, and service_name from the request data
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to accept the request");
      }

      navigate("/serviceProviderScreen");
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Ensure requestData is an array before mapping over it
  if (!Array.isArray(requestData) || requestData.length === 0) {
    return <p>No data available</p>;
  }

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
                backgroundColor: "lightGray",
                color: "black",
                border: "1px solid lightGray",
                borderRadius: "10px",
              }}
            >
              Back
            </button>

            <button
              onClick={acceptRequest}
              style={{
                width: "150px",
                height: "40px",
                backgroundColor: "red",
                color: "white",
                border: "1px solid red",
                borderRadius: "10px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewWorkScreen;
