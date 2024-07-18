import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function SuccessConfirmationCard({ onClose }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
        <p>Order Request has been updated successfully!</p>
        <button onClick={onClose} style={{ padding: "10px 20px", backgroundColor: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>OK</button>
      </div>
    </div>
  );
}



function OrderDetailsCard() {
  const { request_id, provider_id } = useParams();
  const [order, setOrder] = useState(null);
  const [date, setDate] = useState("");
  const [orderDetails, setOrderDetails] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/viewSpecificOrder?request_id=${request_id}&provider_id=${provider_id}`, {
          credentials: "include",
        });
        const data = await response.json();
        console.log(data.request)
        setDate(data.request.booking_date)
        setOrderDetails(data.request.message)
        setPhoneNumber(data.request.client_contact_details)
        setOrder(data.request);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      }
    };

    fetchOrderDetails();
  }, [request_id, provider_id]);

  const updateBookings = async () => {
    const requestData = {
      providerId: provider_id,
      serviceId: order.service_id,
      date,
      orderDetails,
      phoneNumber,
    };

    const response = await fetch("http://localhost:5000/updateRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
      credentials: "include",
    });

    if (response.ok) {
      setShowSuccess(true);
    } else {
      console.error("Failed to send request");
    }
  };

  const deleteBookings = async () => {
    const requestData = {
      providerId: provider_id,
      serviceId: order.service_id,
      date,
      orderDetails,
      phoneNumber,
      request_id
    };

    const response = await fetch("http://localhost:5000/deleteRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
      credentials: "include",
    });

    if (response.ok) {
      navigate('/orderScreen')
    } else {
      console.error("Failed to send request");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/orderScreen");
  };


  return (
    <div style={{ display: "flex", flexDirection: "column", border: "1px solid black", borderRadius: "15px", width: "80%", padding: "20px", justifyContent: "left", flexWrap: "unset" }}>
      <p style={{ fontSize: "25px", margin: 0 }}>Order Details</p>
      <form onSubmit={(e) => { e.preventDefault(); updateBookings(); }} style={{ display: "flex", flexDirection: "column", marginTop: 20, alignItems: "left" }}>
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
            <label htmlFor="date" style={{ textAlign: "left" }}>Date For Booking</label>
            <br />
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "85%", height: "25px", borderRadius: "10px", border: "1px solid gray", padding: "10px" }} />
          </div>
          <div style={{ display: "flex", width: "50%", justifyContent: "space-between", flexDirection: "column" }}>
            <label htmlFor="phoneNumber" style={{ textAlign: "left" }}>Phone Number</label>
            <input type="number" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={{ width: "85%", height: "25px", borderRadius: "10px", border: "1px solid gray", padding: "10px" }} />
          </div>
        </div>
        <label htmlFor="orderDetails" style={{ textAlign: "left", marginTop: "40px" }}>Order Details</label>
        <br />
        <textarea id="orderDetails" value={orderDetails} onChange={(e) => setOrderDetails(e.target.value)} placeholder="Additional Message" style={{ maxWidth: "100%", height: "200px", borderRadius: "10px", border: "1px solid gray", padding: "10px" }} />
        <div style={{ marginTop: "40px", display: "flex", justifyContent: "space-between" }}>
          <button style={{ width: "150px", height: "40px", backgroundColor: "red", color: "white", border: "1px solid red", borderRadius: "10px", marginLeft: "40px" }} onClick={deleteBookings}>Delete</button>
          <button type="submit" style={{ width: "150px", height: "40px", backgroundColor: "green", color: "white", border: "1px solid green", borderRadius: "10px", marginLeft: "40px" }}>Update</button>
        </div>
      </form>
      {showSuccess && <SuccessConfirmationCard onClose={handleSuccessClose} />}
    </div>
  );
}

function ProfileInfo({ profileImage, name, rating }) {
  return (
    <div style={{ display: "flex" }}>
      <img src={profileImage} alt="Profile" style={{ width: "100px", height: "100px", backgroundColor: "lightGray", borderRadius: "50%", objectFit: "cover", marginRight: "10px" }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ textAlign: "left", fontWeight: "bold", margin: 0 }}>{name}</p>
        <p style={{ textAlign: "left", margin: 0, marginTop: 20 }}>{rating !== null ? `${rating} / 5.0` : `0 / 5.0`}</p>
      </div>
    </div>
  );
}

function Description({ description }) {
  return (
    <div style={{ backgroundColor: "lightGray", border: "1px solid lightGray", borderRadius: "15px", overflow: "hidden", marginTop: "40px", flex: 1, padding: "20px", width: "80%" }}>
      <p style={{ textAlign: "left", margin: 0, fontSize: "20px", fontWeight: "bold", marginTop: "20px" }}>Description</p>
      <p style={{ textAlign: "start", padding: "20px" }}>{description}</p>
    </div>
  );
}

function ViewOrderCard() {
  const { request_id , provider_id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`http://localhost:5000/viewSpecificOrder?request_id=${request_id}&provider_id=${provider_id}`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data.request)
          setBooking(data.request);
        } else {
          const data = await response.json();
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [request_id, provider_id]);

  if (!booking) {
    return (
      <div style={{ width: "100vw", height: "calc(100vh - 65px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ fontSize: "20px", color: "red" }}>Booking details not found.</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "calc(100vh - 65px)", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", borderBottom: "1px solid gray", backgroundColor: "white" }}>
        <p style={{ textAlign: "start", color: "green", fontSize: "20px", padding: "0px 0px 0px 10px", cursor: "pointer", maxWidth: "100%" }} onClick={() => navigate("/")}>
          <b>ServiceHub</b>
        </p>
      </div>
      <div style={{ display: "flex", maxWidth: "100%", flex: 1, marginTop: "64px", padding: "50px" }}>
        <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}>
          <ProfileInfo profileImage={`http://localhost:5000/${booking.profilePic}`} name={booking.full_name} rating={booking.ratings} />
          <Description description={booking.service_name} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}>
          <OrderDetailsCard providerId={booking.provider_id} serviceId={booking.service_id} />
        </div>
      </div>
    </div>
  );
}

export default ViewOrderCard;
