import React, { useEffect, useState } from "react";

const textFieldStyles = {
    width: "200px", 
    height: "25px",
    padding: "10px",
    border: "1px solid gray",
    borderRadius: "14px"
}

const textFieldErrorStyles = {
    width: "200px", 
    height: "25px",
    padding: "10px",
    border: "1px solid red",
    borderRadius: "14px"
}

function AccountBalanceScreen({error, onChange, errorMessage}){
  const [requestList, setRequestList] = useState([]);

    useEffect(() => {
        const fetchWorkInProgress = async () => {
          try {
            const response = await fetch("http://localhost:5000/ongoingWork", {
              method: "GET",
              credentials: "include"
            });
    
            if (!response.ok) {
              throw new Error("Failed to fetch work in progress");
            }
    
            const data = await response.json();
            setRequestList(data); 
          } catch (error) {
            console.error("Error fetching work in progress:", error);
          }
        };
    
        fetchWorkInProgress();
      }, []);
    return(
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>

            <div>
            {requestList.length === 0 ? (
                <div style={{ maxWidth: "100%", flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <p style={{ fontSize: "25px", fontWeight: "bold" }}>No ongoing work</p>
                </div>
            ) : (
                requestList.map((request, index) => (
                <div key={index} style={{
                    display: "flex",
                    alignItems: "center",
                    height: "50px",
                    padding: "10px",
                    margin: "10px",
                    border: "1px solid gray",
                    borderRadius: "15px",
                    justifyContent: "space-between",
                    width: "100%"
                }}>
                    <div style={{ width: "30%", display: "flex", alignItems: "center" }}>
                    <img src={request.profilePic || "defaultImage.png"} alt="User" style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        marginRight: "10px"
                    }} />
                    <div>
                        <p style={{ fontSize: "14px", fontWeight: "bold", textAlign: "left", marginBottom: 0, marginTop: 10 }}>{request.name}</p>
                        <p style={{ fontSize: "13px", fontWeight: "bold", textAlign: "left", marginBottom: 10, marginTop: 10, color: "gray" }}>{request.service}</p>
                    </div>
                    </div>
                    <div>
                    <p style={{ fontSize: "13px", fontWeight: "bold", textAlign: "left", marginBottom: 0, marginTop: 10 }}>{request.dueDate}</p>
                    </div>
                </div>
                ))
            )}
            <div style={{ height: "100px" }}></div>
            </div>
        </div>
    )
}

export default AccountBalanceScreen;