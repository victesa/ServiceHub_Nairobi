import React, { useState, useEffect } from "react";
import AccountBalanceScreen from "../../ServiceProvider/screens/AccountBalanceScreen";
import WorkHistory from "../components/History";
import { useNavigate } from "react-router-dom";

function WorkInProgress() {
  const [requestList, setRequestList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkInProgress = async () => {
      try {
        const response = await fetch("http://localhost:5000/upcomingWork", {
          method: "GET",
          credentials: "include",
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

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "20px",
        overflowY: "auto",
        height: "70%",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {requestList.length === 0 ? (
        <div
          style={{
            maxWidth: "100%",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "25px", fontWeight: "bold" }}>No upcoming work</p>
        </div>
      ) : (
        requestList.map((request, index) => (
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
              width: "97%",
              cursor: "pointer"
            }}
            onClick={() => navigate(`/providerViewWork/${request.booking_id}`)}
          >
            <div style={{ width: "30%", display: "flex", alignItems: "center" }}>
              <img
                src={request.profilePic || "defaultImage.png"}
                alt="User"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    textAlign: "left",
                    marginBottom: 0,
                    marginTop: 10,
                  }}
                >
                  {request.name}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    textAlign: "left",
                    marginBottom: 10,
                    marginTop: 10,
                    color: "gray",
                  }}
                >
                  {request.service}
                </p>
              </div>
            </div>
            <div>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  textAlign: "left",
                  marginBottom: 0,
                  marginTop: 10,
                }}
              >
                {request.dueDate}
              </p>
            </div>
          </div>
        ))
      )}
      <div style={{ height: "100px" }}></div>
    </div>
  );
}

const titleStyle = {
  textAlign: "left",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "5px",
  marginLeft: "10px",
  color: "gray",
};

const selectedTitleStyle = {
  ...titleStyle,
  color: "green",
};

function FinanceScreen() {
  const [selectedSection, setSelectedSection] = useState("WorkInProgress");

  return (
    <div
      style={{
        flex: 1,
        height: "calc(100vh - 64px)",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 0 20px" }}>
        <h2
          style={{
            textAlign: "left",
            fontSize: "40px",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          Overview
        </h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{ width: "300px" }}
            onClick={() => setSelectedSection("WorkInProgress")}
          >
            <p style={selectedSection === "WorkInProgress" ? selectedTitleStyle : titleStyle}>Upcoming Work</p>
            {selectedSection === "WorkInProgress" && (
              <div
                style={{
                  borderBottom: "2px solid green",
                  width: "100%",
                  height: "1px",
                }}
              ></div>
            )}
          </div>

          <div
            style={{ width: "300px" }}
            onClick={() => setSelectedSection("AccountBalance")}
          >
            <p style={selectedSection === "AccountBalance" ? selectedTitleStyle : titleStyle}>Ongoing Work</p>
            {selectedSection === "AccountBalance" && (
              <div
                style={{
                  borderBottom: "2px solid green",
                  width: "100%",
                  height: "1px",
                }}
              ></div>
            )}
          </div>

          <div
            style={{ width: "300px", paddingRight: "40px" }}
            onClick={() => setSelectedSection("TotalEarned")}
          >
            <p style={selectedSection === "TotalEarned" ? selectedTitleStyle : titleStyle}>History</p>
            {selectedSection === "TotalEarned" && (
              <div
                style={{
                  borderBottom: "2px solid green",
                  width: "100%",
                  height: "1px",
                }}
              ></div>
            )}
          </div>
        </div>
      </div>

      {selectedSection === "WorkInProgress" && (
        <div>
          <WorkInProgress />
        </div>
      )}
      {selectedSection === "AccountBalance" && (
        <div>
          <AccountBalanceScreen />
        </div>
      )}
      {selectedSection === "TotalEarned" && (
        <div>
          <WorkHistory />
        </div>
      )}
    </div>
  );
}

export default FinanceScreen;
