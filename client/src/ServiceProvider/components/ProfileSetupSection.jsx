import React, { useState } from "react";

function ProfileSetUpSection({nextScreen}) {
    const [profileImage, setProfileImage] = useState(null);
    const [aboutService, setAboutService] = useState("");

    const handleImageChange = (event) => {
        const imageFile = event.target.files[0];
        setProfileImage(imageFile);
    };

    const handleAboutServiceChange = (event) => {
        setAboutService(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("profileImage", profileImage);
        formData.append("aboutService", aboutService);

        try {
            const response = await fetch("http://localhost:5000/profileUpload", {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            if (response.ok) {
                nextScreen("Services Setup")
            } else {
                console.error("Failed to submit form");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <form style={{ height: "100vh", display: "flex", flexDirection: "column", padding: "20px", paddingLeft: "80px", boxSizing: "border-box", flex: 1 }} onSubmit={handleSubmit}>
            <p style={{ fontSize: "25px", fontWeight: "bold", textAlign: "left" }}>Profile Picture</p>
            <p style={{ fontSize: "15px", fontWeight: "bold", textAlign: "left", color: "gray" }}>
                Clients tend to choose people with a picture of themselves in their profile
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
                {profileImage && (
                    <img
                        src={URL.createObjectURL(profileImage)}
                        alt="Profile"
                        style={{
                            width: "120px",
                            height: "120px",
                            backgroundColor: "lightGray",
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginRight: "10px",
                        }}
                    />
                )}
                <label htmlFor="image" style={{ cursor: "pointer" }}>
                    Change Photo
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }} // Hide the actual input
                    />
                </label>
            </div>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "left", paddingTop: "40px" }}>
                <label htmlFor="aboutService" style={{ textAlign: "left", fontWeight: "bold" }}>Bio</label><br />
                <textarea
                    id="aboutService"
                    name="aboutService"
                    value={aboutService}
                    placeholder="About yourself"
                    onChange={handleAboutServiceChange}
                    style={{ height: "200px", border: "1px solid gray", borderRadius: "15px", width: "400px", padding: "10px" }}
                /><br />
            </div>

            <div style={{ display: "flex", justifyContent: "left", alignItems: "center", marginTop: "40px" }}>
                <input
                    type="submit"
                    value="Next"
                    style={{
                        width: "200px",
                        height: "40px",
                        color: "white",
                        backgroundColor: "green",
                        borderRadius: "15px",
                        border: "1px solid green",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                />
            </div>
        </form>
    );
}

export default ProfileSetUpSection;
