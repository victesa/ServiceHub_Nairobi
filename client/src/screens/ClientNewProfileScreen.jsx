import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import photo from "../../images/clientImage.png";
import { BasicHeaderServiceHub } from "../../common/components/Header";

function ClientNewProfileScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setProfileImage(imageFile);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("profileImage", profileImage);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("location", location);

    try {
      const response = await fetch("http://localhost:5000/profileUpload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        navigate('/clientHomeScreen');
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
      <BasicHeaderServiceHub />
      <div style={{ padding: "20px", boxSizing: "border-box" }}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto",
            paddingBottom: "100px", // Extra padding to ensure button is at the bottom
          }}
          onSubmit={handleSubmit}
        >
          <p style={{ fontSize: "25px", fontWeight: "bold", textAlign: "left" }}>
            Profile Picture
          </p>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <img
              src={profileImage ? URL.createObjectURL(profileImage) : photo}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: "lightGray",
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "10px",
              }}
            />
            <label htmlFor="image" style={{ cursor: "pointer" }}>
              Change Photo
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }} // Hide the actual input
              />
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 40, marginBottom: "20px", width: "100%" }}>
            <div style={{ width: "48%" }}>
              <label htmlFor="firstName" style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={handleFirstNameChange}
                style={{
                  width: "100%",
                  border: "1px solid gray",
                  borderRadius: "12px",
                  height: "17px",
                  padding: "10px",
                }}
              />
            </div>
            <div style={{ width: "48%" }}>
              <label htmlFor="lastName" style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={handleLastNameChange}
                style={{
                  width: "100%",
                  border: "1px solid gray",
                  borderRadius: "12px",
                  height: "17px",
                  padding: "10px",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="location" style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>Location</label>
            <input
              id="location"
              placeholder="Location"
              type="text"
              value={location}
              onChange={handleLocationChange}
              style={{
                width: "100%",
                border: "1px solid gray",
                borderRadius: "12px",
                height: "17px",
                padding: "10px",
              }}
            />
          </div>

          <input
            type="submit"
            value="Next"
            style={{
              width: "20%",
              height: "40px",
              color: "white",
              backgroundColor: "green",
              borderRadius: "15px",
              border: "1px solid green",
              fontWeight: "bold",
              cursor: "pointer",
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default ClientNewProfileScreen;
