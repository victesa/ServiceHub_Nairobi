import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { EmailTextFieldInput } from "../components/SignInComponents";
import { signInButton, signInButtonHover } from "../components/componentsStyles";

const mainDivStyle = {
    width: "450px",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    border: "1px solid gray",
    borderRadius: "20px",
};

function SignInButton() {
    const [isHovered, setIsHovered] = React.useState(false);
    return (
      <div>
        <button style={isHovered ? { ...signInButton, ...signInButtonHover } : signInButton}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          type="submit">
            <b>Reset Password</b>
        </button>
      </div>
    );
}

function ResetPasswordForm(){
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [emailHasError, setEmailHasError] = useState(false);

    const resetPassword = async (event) => {
        event.preventDefault();

        const resetPasswordJson = { email };

        try {
            setEmailHasError(false);
            setError("");
            const response = await fetch("http://localhost:5000/auth/request-password-reset", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resetPasswordJson)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Error');
                setEmailHasError(true);
            } else {
                const successData = await response.json();
                alert(successData.message);
            }
        } catch (error) {
            console.log(error);
            setError('An error occurred');
            setEmailHasError(true);
        }
    }    

    return(
        <form style={mainDivStyle} onSubmit={resetPassword}>
            <p style={{ fontSize: "25px" }}>
                <b>Enter Email</b>
            </p>

            <EmailTextFieldInput 
                error={emailHasError} 
                onChange={(e) => setEmail(e.target.value)} 
                errorMessage={error} 
            />

            <span style={{ padding: "30px" }}></span>

            <SignInButton/>

        </form>
    );
}

const signInScreenDiv = {
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "90vh",
  display: "flex",
};

function ResetPasswordScreen() {
  return (
    <div style={{ overflow: "hidden" }}>
      <Header />
      <div style={signInScreenDiv}>
        <ResetPasswordForm/>
      </div>
    </div>
  );
}

export default ResetPasswordScreen;
