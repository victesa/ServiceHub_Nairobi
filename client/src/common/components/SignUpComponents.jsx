import React from "react";
import textFieldSignUpStyles, {textFieldErrorStyles, textFieldsBasicStyles, namesTextFieldStyle, CreateAccountSignUp, namesErrorTextFieldStyle} from "./SignUpComponents.js";

function EmailAddressSignUpTextField({ error, onEmailChange, errorMessage }) {
  const updateEmail = (emailAddress) => {
    onEmailChange(emailAddress);
  };
  return (
    <div style={textFieldsBasicStyles}>
      <label htmlFor="email" style={{ margin: "5px 0px 0px 0px" }}>
        <b>Email Address</b>
      </label>
      <input
        type="email"
        id="email"
        name="emailAddress"
        style={error === true ? textFieldErrorStyles : textFieldSignUpStyles}
        placeholder="Email Address"
        onChange={updateEmail}

        required 
      />
      
      {error && <p style={{ color: 'red', margin: '5px 0 0 0' }}>{errorMessage}</p>}
    </div>
  );
}

function PasswordSignUpTextField({ error, onPasswordChange, errorMessage}) {
  return (
    <div style={textFieldsBasicStyles}>
      <label htmlFor="password" style={{ margin: "0px 0px 0px 0px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <b>Password</b>
          <p style={{ fontSize: "10px", color: "gray", marginLeft: "10px" }}>
            (should contain 8 characters, should contain letters, numbers, and
            special symbols)*
          </p>
        </div>
      </label>
      <input
        type="password"
        id="password"
        name="password"
        style={error ? textFieldErrorStyles : textFieldSignUpStyles}
        onChange={onPasswordChange}
        placeholder="Password"

        required minLength={6}
      />
      
      {error && <p style={{ color: 'red', margin: '5px 0 0 0' }}>{errorMessage}</p>}
    </div>
  );
}

function FirstNameSignUpTextField({onFirstNameChange}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <label htmlFor="firstName" style={{ margin: "0px 0px 10px 0px" }}>
        <b>First Name</b>
      </label>
      <input
        type="text"
        id="firstName"
        placeholder="First Name"
        name="firstName"
        onChange={onFirstNameChange}
        style={namesTextFieldStyle}

        required
      />

    </div>
  );
}

function LastNameSignUpTextField({ onLastNameChange}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <label htmlFor="lastName" style={{ margin: "0px 0px 10px 0px" }}>
        <b>Last Name</b>
      </label>
      <input
        type="text"
        id="lastName"
        placeholder="Last Name"
        name="lastName"
        onChange={onLastNameChange}
        style={namesTextFieldStyle}
        required
      />
    </div>
  );
}


function CreateAccountButtonSignUp() {
  return (
    <div>
      <button type="submit" style={CreateAccountSignUp}>
        <b>Create my account</b>
      </button>
    </div>
  );
}

export default EmailAddressSignUpTextField;

export {
  FirstNameSignUpTextField,
  PasswordSignUpTextField,
  CreateAccountButtonSignUp,
  LastNameSignUpTextField,
};
