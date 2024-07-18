import React, { useEffect, useState } from "react";
import image from "../../images/image.png"
import { useNavigate } from "react-router-dom";

function EmptyRequest(){
    return(
        <div style={{width: "100%", height: "100%", flexDirection: "column", justifyContent: 'center', alignItems: "center", display: "flex"}}>
            <div style={{background: "#F9F9F9", 
                width: "80%", 
                border: "1px solid #F9F9F9", 
                borderRadius: "15px",
                display: "flex",
                flexDirection: "column",
                justifyContent: 'center',
                alignItems: "center",
                height: "80%"}}>

                    <img src = {image} style={{padding: "10px", scale: "0.8"}}/>

                    <p style={{
                        fontFamily: "Lora",
                        fontOpticalSizing: "auto",
                        fontWeight: 500,
                        fontStyle: "bold",
                        textAlign: "left",
                        fontSize: "30px",
                        marginbottom: "10px"
                    }}>You do not have any requests yet</p>

                <p style={{ fontSize: "20px"}}>Any Request made by a client for a service will be shown here</p>

            </div>
        </div>
    )
}

const requestList = [
    { name: "Mohammed Ali", dueDate: "45 hours remaining" },
    { name: "Mohammed Ali", dueDate: "46 hours remaining" },
    { name: "Mohammed Ali", dueDate: "46 hours remaining" },
    { name: "Mohammed Ali", dueDate: "46 hours remaining" },
    { name: "Mohammed Ali", dueDate: "46 hours remaining" },
    { name: "Mohammed Ali", dueDate: "46 hours remaining" },
    { name: "Mohammed Ali", dueDate: "46 hours remaining" },
    { name: "Mohammed Ali", dueDate: "46 hours remaining" },
    { name: "Mohammed Ali", dueDate: "46 hours remaining" },
    { name: "Mohammed Ali", dueDate: "48 hours remaining" }
];


function Requests() {
    const [requestList, updateRequestList] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch("http://localhost:5000/serviceProviderRequest", {
                    method: "GET",
                    credentials: "include"
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                updateRequestList(data.requests); 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchRequests(); 
    }, []); 

    // Render based on requestList length
    return requestList.length === 0 ? <EmptyRequest /> : <NormalRequests requestList={requestList} />;
}


function NormalRequests({ requestList }) {
    const navigate = useNavigate();

    const handleRequestClick = (requestId) => {
        navigate(`/viewRequest/${requestId}`); // Navigate to viewRequest with request_id
    };

    return (
        <div style={{ 
            marginTop: "10px", 
            padding: "20px", 
            overflowY: "hidden", 
            height: "calc(100vh - 60px)",
            scrollbarWidth: "none", /* For Firefox */
            msOverflowStyle: "none" /* For Internet Explorer and Edge */
        }}>
            {requestList.map((request, index) => (
                <div 
                    key={index} 
                    style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        height: "50px", 
                        padding: "10px", 
                        margin: "10px", 
                        border: "1px solid gray", 
                        borderRadius: "15px",
                        justifyContent: "space-between", 
                        cursor: "pointer" // Add cursor pointer to indicate clickability
                    }}
                    onClick={() => handleRequestClick(request.request_id)} // Pass request_id to handler
                >
                    <div style={{ width: "30%", display: "flex", alignItems: "center" }}>
                        <img 
                            src={request.profilePic} 
                            alt="User" 
                            style={{ 
                                width: "50px", 
                                height: "50px", 
                                borderRadius: "50%", 
                                marginRight: "10px",
                            }} 
                        />
                        <div>
                            <p style={{ fontSize: "14px", fontWeight: "bold", textAlign: "left", marginBottom: 0, marginTop: 10 }}>{request.full_name}</p>
                            <p style={{ fontSize: "13px", fontWeight: "bold", textAlign: "left", marginBottom: 10, marginTop: 10, color: "gray" }}>{request.service_name}</p>
                        </div>
                    </div>

                    <div>
                        <p style={{ fontSize: "13px", fontWeight: "bold", textAlign: "left", marginBottom: 0, marginTop: 10 }}>{`Response Due: ${request.hours_remaining} Hours`}</p>
                    </div>
                </div>
            ))}

            <div style={{ height: "100px" }}></div>
        </div>
    );
}




export default Requests;