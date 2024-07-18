import React from "react";

function ProfilePhoto(){
    return(
        <div class="profile-container" 
            style={{position: "relative",
            display: "inline-block",
            width: "150px",
            height: "150px"}}>

            <img src="profile.jpg" alt="Profile Picture" class="profile-pic" 
            style={{width: "100%", height: '100%', borderRadius: "50px", border: "2px solid #ccc"}}/>
            
            <div class="add-icon"
            style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                backgroundColor: "#007bff",
                color: "#fff",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: 'center',
                fontSize: "24px",
                fontWeight: "bold",
                cursor: "pointer"
            }}>+</div>
        </div>
    )
}

export default ProfilePhoto;