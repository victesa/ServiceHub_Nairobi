import React from "react";
import SignUpForm from "../components/SignUpForm";
import {BasicHeaderServiceHub} from "../components/Header";

const signInScreenDiv = {
  justifyContent: "center",
  width: "100%",
  height: "100%",
  display: "flex",
};

function SignUpScreen() {
  return (
    <div style={{ overflow: "hidden" }}>
      <BasicHeaderServiceHub />
      <div style={signInScreenDiv}>
        <SignUpForm />
      </div>
    </div>
  );
}

export default SignUpScreen;
