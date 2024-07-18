import React, { useState } from "react";
import ProfileSetUpSection from "../components/ProfileSetupSection";
import ServiceSetup from "../components/ServiceSetup";
import AddServiceCard from "../components/AddServiceCard";
import photo from "../../images/clientImage.png";
import { useNavigate } from "react-router-dom";

const selectedScreenStyle = {
  fontSize: "15px",
  fontWeight: "bold",
  textAlign: "left",
  width: "50%",
  cursor: "pointer",
};
const unSelectedScreenStyle = {
  fontSize: "15px",
  fontWeight: "bold",
  textAlign: "left",
  width: "50%",
  color: "gray",
  cursor: "pointer",
};

function LeftNavigation({ currentScreen, changeCurrentScreen }) {
  return (
    <div
      style={{
        width: "23%",
        minHeight: "100%",
        borderRight: "1px solid gray",
        padding: "20px",
        paddingTop: "40px",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <p
        style={currentScreen === "Profile" ? selectedScreenStyle : unSelectedScreenStyle}
        onClick={() => changeCurrentScreen("Profile")}
      >
        Profile
      </p>
      <p
        style={currentScreen === "Services Setup" ? selectedScreenStyle : unSelectedScreenStyle}
        onClick={() => changeCurrentScreen("Services Setup")}
      >
        Services Setup
      </p>
    </div>
  );
}

function ProfileSetUpScreen() {
  const [currentScreen, setCurrentScreen] = useState("Profile");
  const [addServiceScreenVisible, setAddServiceScreenVisible] = useState(false);

  const [profileImage, setProfileImage] = useState(photo); // Default profile image
  const [aboutService, setAboutService] = useState("");

  const navigate = useNavigate(); // Use navigate hook for routing

  const handleChangeScreen = () => {
    setCurrentScreen(currentScreen);
  };

  const handleSubmit = () => {
    setAddServiceScreenVisible(false);
    navigate('/ServiceProviderScreen'); // Navigate to desired screen
  };

  return (
    <div style={{ minWidth: "100%", minHeight: "100%", display: "flex", flexShrink: 0 }}>
      <LeftNavigation currentScreen={currentScreen} changeCurrentScreen={handleChangeScreen} />
      <div style={{ flex: 1 }}>
        {currentScreen === "Profile" ? (
          <ProfileSetUpSection
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            aboutService={aboutService}
            setAboutService={setAboutService}
            nextScreen={handleChangeScreen}
          />
        ) : (
          <ServiceSetup onSubmit={handleSubmit} />
        )}
        {addServiceScreenVisible && <AddServiceCard onClose={() => setAddServiceScreenVisible(false)} />}
      </div>
    </div>
  );
}

export default ProfileSetUpScreen;
