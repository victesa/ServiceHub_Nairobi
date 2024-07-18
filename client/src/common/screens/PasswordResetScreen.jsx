import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from "../components/Header"
import { signInButton, signInButtonHover } from "../components/componentsStyles";
import { useNavigate } from 'react-router-dom';

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

const mainDivStyle = {
    width: "450px",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    border: "1px solid gray",
    borderRadius: "20px",
};

function ResetPasswordForm() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const userPassword = newPassword
            const response = await fetch('http://localhost:5000/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, userPassword }),
            });

            if (response.ok) {
            
                setSuccess("Password reset successfully. Redirecting...");
                setError("");
                setTimeout(() => {
                    navigate('/signInScreen'); // Redirect to home screen after 3 seconds
                  }, 3000);
            } else {
                const errorData = await response.json();
                try{
                    const passwordError = errorData.errors.find(error => error.path === 'userPassword');
                    console.log(passwordError.msg)
                    setError(passwordError.msg)
                }catch(err){
                    setError(errorData.error);
                    setSuccess("");
                }
                
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.log(err)
            setSuccess("");
        }
    };

    return (
        <form style={mainDivStyle} onSubmit={handleSubmit}>
            <p style={{ fontSize: "25px" }}>
                <b>Reset Password</b>
            </p>

            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "13px", border: "1px solid gray" }}
            />

            <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", marginBottom: "50px", borderRadius: "13px", border: "1px solid gray" }}
            />

            {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
            {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}

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

function PasswordResetScreen(){
    return(
        <div style={{ overflow: "hidden" }}>
            <Header />
                <div style={signInScreenDiv}>
                <ResetPasswordForm/>
            </div>
        </div>
        
    )
}

export default PasswordResetScreen;
