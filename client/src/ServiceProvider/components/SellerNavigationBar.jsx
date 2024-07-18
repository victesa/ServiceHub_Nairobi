import React from "react";

const navStyle = {
  width: "250px",
  padding: "10px",
  borderRight: "1px solid gray",
  backgroundColor: "#FFFFFF",
  flexShrink: 0
};

const currentScreen = {
  padding: "20px",
  backgroundColor: "#F5F5F5",
  borderRadius: "10px",
  border: "1px solid #bfcbad",
  textAlign: "left",
  fontWeight: "bold",
};

const normalScreen = {
  padding: "10px",
  textAlign: "left",
  fontWeight: "bold",
};

const listOfScreens = ["Portfolio", "Requests", "Work"];

function LeftNavigationBar({ selectedScreen, onSelectScreen }) {
  return (
    <div style={navStyle}>
      {listOfScreens.map((screen) => (
        <p
          key={screen}
          style={selectedScreen === screen ? currentScreen : normalScreen}
          onClick={() => onSelectScreen(screen)}
        >
          {screen}
        </p>
      ))}
    </div>
  );
}

const listOfProfileSetupScreens = ["Profile", "Services"]

function profileSetUpNavBar({ selectedScreen, onSelectScreen }){
    return (
        <div style={navStyle}>
          {listOfProfileSetupScreens.map((screen) => (
            <p
              key={screen}
              style={selectedScreen === screen ? currentScreen : normalScreen}
              onClick={() => onSelectScreen(screen)}
            >
              {screen}
            </p>
          ))}
        </div>
    );
}

export default LeftNavigationBar;

export {profileSetUpNavBar}
