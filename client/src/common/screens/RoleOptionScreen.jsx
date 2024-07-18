import React from "react";
import "../../styles.css";
import {BasicHeaderServiceHub} from "../components/Header";
import { useNavigate } from "react-router-dom";
import RoleOptionButtons from "../components/RoleOptionButton"; // Import the button component here

const CreateAccountButtonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "12px",
  border: "1px solid #ccc",
  marginTop: "20px",
};

const CreateAccountButtonSelectedStyle = {
  ...CreateAccountButtonStyle,
  backgroundColor: "green",
  color: "white",
};

function CreateAccountRoleOption({ isSelected, buttonKey, onClick }) {
  let buttonText = "Create Account";
  console.log(buttonKey);
  if (isSelected) {
    buttonText =
      buttonKey === 0 ? "Join as Client" : "Join as Service Provider";
  }
  return (
    <div>
      <button
        style={
          isSelected
            ? CreateAccountButtonSelectedStyle
            : CreateAccountButtonStyle
        }
        disabled={!isSelected}

        onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
}

function RoleOptionScreen() {
  const navigate = useNavigate();

  const handleClick = () => {
    var role = "cleint"
    if(choiceSelected === 0){
      role = "client"
    }else{
      role = "Service Provider"
    
    }
    const route = "/SignUpScreen?role=" + role
    navigate(route);
  };


  const [choiceSelected, setChoiceSelected] = React.useState(null);
  return (
    <div style={mainDivStyle}>
      <BasicHeaderServiceHub />

      <span style={{ padding: "10px" }} />

      <div style={contentStyle}>
        <p style={titleStyle}>
          <b>Join as a Client or Service Provider</b>
        </p>

        <div style={buttonDiv}>
          <RoleOptionButtons
            choiceSelected={choiceSelected}
            onChoiceChange={setChoiceSelected}
          />
        </div>

        <div>
          <CreateAccountRoleOption
            isSelected={choiceSelected != null}
            buttonKey={choiceSelected}
            onClick={handleClick}
          />

          <p style={{ margin: "30px 0px 0px 0px" }}>
            Already have an account?{" "}
            <a href="SignInScreen" style={{ color: "green" }}>
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const titleStyle = {
  position: "relative",
  fontSize: "1.5rem",
};

const contentStyle = {
  flex: 1, // Allow content to grow to fill available space
};

const mainDivStyle = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  justifyContent: "center",
  overflow: "hidden",
};

const buttonDiv = {
  display: "flex",
  justifyContent: "center", // Arrange buttons with space between them
  width: "100%",
};

export default RoleOptionScreen;
