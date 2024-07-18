import React, { useState } from "react";
import { BasicHeaderServiceHub } from "../components/Header";
import { useNavigate, useSearchParams } from "react-router-dom";
import OptionalDiv, { PasswordTextFieldInput, EmailTextFieldInput, SignInButton, CreateAccountWhiteBg } from "../components/SignInComponents";
import { divStyle, optionalDivStyle, optionalMainDivStyle } from "../components/componentsStyles";

const mainDivStyle = {
  width: "500px",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px",
  border: "1px solid gray",
  borderRadius: "20px",
};

function NewSignUpForm() {
  const [emailAddress, setEmailAddress] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailHasError, setEmailHasError] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [confirmPasswordHasError, setConfirmPasswordHasError] = useState(false);

  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const role = searchParams.get('role')

  const navigateToRoleOptionScreen = (event) => {
    event.preventDefault(); // Prevent default form submission
    navigate("/roleOptionScreen");
  };

  const signUp = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (userPassword !== confirmPassword) {
      setConfirmPasswordErrorMessage("Passwords do not match");
      setConfirmPasswordHasError(true);
      return;
    }

    const signUpJson = {
      emailAddress,
      userPassword,
      role
    };

    try {
      const response = await fetch("http://localhost:5000/signUp", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpJson),
        credentials: 'include', // Include credentials in request
      });

      const data = await response.json(); // Await and use the JSON response

      if (!response.ok) {
        console.log(data);

        if (data.type === "email") {
          setEmailErrorMessage(data.msg);
          setEmailHasError(true);
          setPasswordHasError(false);
          setConfirmPasswordHasError(false);
        } else {
          setPasswordErrorMessage(data.msg);
          setPasswordHasError(true);
          setEmailHasError(false);
          setConfirmPasswordHasError(false);
        }
      } else {
        setEmailHasError(false);
        setPasswordHasError(false);
        setConfirmPasswordHasError(false);
        console.log(data.role);

        navigate('/EmailVerificationLink')
      }
    } catch (error) {
      console.log(error);
      setEmailHasError(false);
      setPasswordHasError(false);
      setConfirmPasswordHasError(false);
    }
  };

  return (
    <form style={mainDivStyle} onSubmit={signUp}>
      <p style={{ fontSize: "25px" }}>
        <b>Sign Up to ServiceHub</b>
      </p>

      <EmailTextFieldInput 
        error={emailHasError} 
        onChange={(e) => setEmailAddress(e.target.value)} 
        errorMessage={emailErrorMessage} 
      />

      <PasswordTextFieldInput 
        error={passwordHasError} 
        onChange={(e) => setUserPassword(e.target.value)} 
        errorMessage={passwordErrorMessage} 
        placeholder="Password"
      />

      <PasswordTextFieldInput 
        placeholder="Confirm Password"
        error={confirmPasswordHasError} 
        onChange={(e) => setConfirmPassword(e.target.value)} 
        errorMessage={confirmPasswordErrorMessage} 
      />

      <span style={{ padding: "30px" }}></span>

      <SignInButton text={"Create Account"} />

      <div style={optionalMainDivStyle}>
        <div style={optionalDivStyle}></div>
        <p style={{ padding: "10px" }}>Already have an account?</p>
        <div style={divStyle}></div>
      </div>

      <span style={{ padding: "30px" }}></span>

      <CreateAccountWhiteBg onClick={{}} text={"Sign In"}/>

      <span style={{ padding: "30px" }}></span>
    </form>
  );
}

const signUpScreenDiv = {
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "90vh",
  display: "flex",
};

function NewSignUpScreen() {
  return (
    <div style={{ overflow: "hidden" }}>
      <BasicHeaderServiceHub />
      <div style={signUpScreenDiv}>
        <NewSignUpForm />
      </div>
    </div>
  );
}

export default NewSignUpScreen;
