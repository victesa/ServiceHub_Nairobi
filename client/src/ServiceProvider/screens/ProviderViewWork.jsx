import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import image from "../../images/heroPic_3.png";

function ProfileInfo({ profileImage, fullName, contact }) {
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
        <p style={{ textAlign: "left", margin: 0, marginTop: 20 }}>Contact: {contact}</p>
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
        Booking Date: {new Date(bookingDate).toLocaleDateString()}
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
        <p>Booking has been deleted successfully</p>
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

function ProviderViewWorkScreen() {
  const { booking_id } = useParams();
  const [booking, setBooking] = useState(null);
  const [confirmationDisplay, setConfirmationDisplay] = useState(false);
  const [loading, setLoading] = useState(true);
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
          setBooking(data.booking); // Set the single booking object
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [booking_id]);

  const rejectRequest = async () => {
    try {
      const response = await fetch("http://localhost:5000/deleteBooking", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          booking_id: booking?.booking_id, // Use booking?.booking_id safely
          clientName: booking?.full_name,
          serviceName: booking?.service_name,
          client_id: booking?.client_id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to reject the request");
      } else {
        setConfirmationDisplay(true);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <div style={{ maxHeight: "calc(100vh - 64px)", display: "flex", maxWidth: "100%", flex: 1, marginTop: "64px", padding: "50px", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", width: "60%", height: "100%" }}>
          {booking && (
            <>
              <ProfileInfo
                profileImage={booking.profilePic}
                fullName={booking.full_name}
                contact={booking.client_contact_details}
              />
              <Description bookingDate={booking.booking_date} description={booking.booking_details} />
            </>
          )}
        </div>

        <div style={{ marginTop: "40px", width: "60%" }}>
          <div style={{ maxWidth: "80%", display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => navigate("/serviceProviderScreen")}
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
              Cancel
            </button>
          </div>
        </div>
      </div>

      {confirmationDisplay && <SuccessConfirmationCard onClose={() => navigate("/serviceProviderScreen")} />}
    </div>
  );
}

export default ProviderViewWorkScreen;
