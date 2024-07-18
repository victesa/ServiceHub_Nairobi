import React, { useEffect, useState } from "react";
import { logoStyle } from "./componentsStyles";
import "../../styles.css";
import { useNavigate } from "react-router-dom";
import removeBlobPrefix from "../../blobRemover";
import clientImage from "../../images/clientImage.png";

// BasicHeaderServiceHub Component
function BasicHeaderServiceHub() {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div className="header">
      <p style={logoStyle} onClick={navigateToHome}>
        <b>ServiceHub</b>
      </p>
    </div>
  );
}

// ClientHomeScreenHeader Component
function ClientHomeScreenHeader() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profilePic, setProfilePic] = useState(clientImage);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest(".profile-container")) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const response = await fetch('http://localhost:5000/profilePicture', {
          method: "GET",
          credentials: "include"
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch profile picture");
        }

        console.log(data)
        if (data.picture) {
          console.log(data.picture)
          setProfilePic(data.picture);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePic();
  }, []);

  const navigateToClientScreen = () => {
    navigate("/orderScreen");
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch("http://localhost:5000/logOut", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Logged out successfully:", data);
        navigate("/");
      } else {
        console.error("Failed to log out:", response.statusText);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header
      style={{
        borderBottom: "1px solid gray",
        width: "100%",
        height: "60px",
        flexShrink: 0,
        backgroundColor: "#FFFFFF",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <p style={logoStyle} onClick={()=> navigate('/')}>
          <b>ServiceHub</b>
        </p>
      </div>
      <div
        className="profile-container"
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: "40px",
          position: "relative",
        }}
      >
        <p
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "1rem",
            fontWeight: "bold",
            marginRight: "10px",
          }}

          onClick={navigateToClientScreen}
        >
          My Orders
        </p>
        <img
          onClick={toggleDropdown}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            marginLeft: "40px",
            cursor: "pointer",
            backgroundColor: "lightgray"
          }}
          src={removeBlobPrefix(profilePic)}
          alt="Profile"
        />
        {dropdownVisible && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              right: "0",
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
              zIndex: 1,
              borderRadius: "4px",
            }}
          >
            <a
              href="#"
              style={{
                display: "block",
                padding: "12px 16px",
                color: "#000",
                textDecoration: "none",
                fontFamily: "Arial, sans-serif",
              }}
              onClick={handleSignOut}
            >
              Sign Out
            </a>
            
          </div>
        )}
      </div>
    </header>
  );
}

// Styles
const signUpButtonHeaderStyle = {
  backgroundColor: "green",
  border: "1px solid green",
  borderRadius: "14px",
  color: "white",
  width: "100px",
  height: "40px",
  fontWeight: "500",
  margin: "0px 0px 0px 30px"
};

const rightHeader = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0px 10px 0px 0px"
};

// HomeScreenHeader Component
function HomeScreenHeader() {
  const navigate = useNavigate();

  const onNavigateToSignInScreen = () => {
    navigate("/signInScreen");
  };

  const onNavigateToSignUpScreen = () => {
    navigate("/RoleOptionScreen");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid gray"
      }}
    >
      <div id="leftHeaderDiv" style={rightHeader}>
        <p style={logoStyle}>
          <b>ServiceHub</b>
        </p>
      </div>

      <div id="rightHeaderDiv" style={rightHeader}>
        <p
          style={{ fontSize: "16px", fontWeight: "500", padding: "0px 10px 0px 20px", cursor: "pointer", color: "GrayText", fontWeight: "bold" }}
          onClick={onNavigateToSignInScreen} // Correct usage of onClick handler
        >
          Sign In
        </p>
        <button
          style={signUpButtonHeaderStyle}
          onClick={onNavigateToSignUpScreen} // Correct usage of onClick handler
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

// SellerHomeScreenHeader Component
function SellerHomeScreenHeader({ image }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest(".profile-container")) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const navigateToClientScreen = () => {
    navigate("/ClientHomeScreen");
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch("http://localhost:5000/logOut", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Logged out successfully:", data);
        navigate("/");
      } else {
        console.error("Failed to log out:", response.statusText);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header
      style={{
        borderBottom: "1px solid gray",
        width: "100%",
        height: "60px",
        flexShrink: 0,
        backgroundColor: "#FFFFFF",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <p style={logoStyle}>
          <b>ServiceHub</b>
        </p>
      </div>
      <div
        className="profile-container"
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: "40px",
          position: "relative",
        }}
      >
        <p
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "1rem",
            fontWeight: "bold",
            marginRight: "10px",
          }}

          onClick={navigateToClientScreen}
        >
          Buyer Mode
        </p>
        <img
          onClick={toggleDropdown}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            marginLeft: "40px",
            cursor: "pointer"
          }}
          src={removeBlobPrefix(image)}
          alt="Profile"
        />
        {dropdownVisible && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              right: "0",
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
              zIndex: 1,
              borderRadius: "4px",
            }}
          >
            <a
              href="#"
              style={{
                display: "block",
                padding: "12px 16px",
                color: "#000",
                textDecoration: "none",
                fontFamily: "Arial, sans-serif",
              }}
              onClick={handleSignOut}
            >
              Sign Out
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

export default HomeScreenHeader;
export { BasicHeaderServiceHub, SellerHomeScreenHeader, ClientHomeScreenHeader };
