import React, { useState } from "react";
import EmailAddressSignUpTextField, {
  CreateAccountButtonSignUp,
  FirstNameSignUpTextField,
  PasswordSignUpTextField,
  LastNameSignUpTextField,
} from "./SignUpComponents.jsx";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const mainDivStyle = {
  width: "500px",
  alignItems: "center",
  padding: "40px",
};

function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [userPassword, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  const [passwordHasError, setPasswordHasError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailHasError, setEmailHasError] = useState(false);

  const [searchParams] = useSearchParams();
  const role = searchParams.get('role')
  const navigate = useNavigate()

  const SignUp = async (event) => {
    event.preventDefault();

    const signUpJson = {
      firstName,
      lastName,
      emailAddress,
      userPassword,
      role
    };

    try {
      setPasswordHasError(false);
      setEmailHasError(false);
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpJson),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (Array.isArray(errorData.errors)) {
          // Handle field-specific errors
          const passwordError = errorData.errors.find(error => error.path === 'userPassword');
          const emailError = errorData.errors.find(error => error.path === 'emailAddress');

          if (passwordError) {
            setErrors(passwordError.msg);
            setPasswordHasError(true);
          }

          if (emailError) {
            setEmailError(emailError.msg);
            setEmailHasError(true);
          }
        } else if (errorData.message) {
          // Handle global errors
          setEmailError(errorData.message);
          setEmailHasError(true);
        }
      } else {
        setPasswordHasError(false);
        setEmailHasError(false);

        navigate("/EmailVerificationLink")
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form style={mainDivStyle} onSubmit={SignUp}>
      <p style={{ fontSize: "30px" }}>
        <b>Sign Up to ServiceHub</b>
      </p>

      <span style={{ padding: "60px" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <FirstNameSignUpTextField onFirstNameChange={(e) => setFirstName(e.target.value)} />
        <LastNameSignUpTextField onLastNameChange={(e) => setLastName(e.target.value)} />
      </div>

      <EmailAddressSignUpTextField
        error={emailHasError}
        errorMessage={emailError}
        onEmailChange={(e) => setEmailAddress(e.target.value)}
      />

      <PasswordSignUpTextField
        onPasswordChange={(e) => setPassword(e.target.value)}
        error={passwordHasError}
        errorMessage={errors}
      />

      <CreateAccountButtonSignUp />

      <p style={{ margin: "20px 0px 0px 0px" }}>
        Already have an account?{" "}
        <a href="SignInScreen" style={{ color: "green" }}>
          Log In
        </a>
      </p>
    </form>
  );
}

export default SignUpForm;
