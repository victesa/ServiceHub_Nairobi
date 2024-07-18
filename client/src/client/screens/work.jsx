import React, { useState, useEffect } from "react";
import { ClientHomeScreenHeader } from "../../common/components/Header";

const Table = ({ data, handleAction }) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={styles.columnHeader}>No.</th>
          <th style={styles.columnHeader}>Service Name</th>
          <th style={styles.columnHeader}>Provider's Name</th>
          <th style={styles.columnHeader}>Booking Date</th>
          <th style={styles.columnHeader}>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={row.id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
            <td style={styles.cell}>{index + 1}</td>
            <td style={styles.cell}>{row.serviceName}</td>
            <td style={styles.cell}>{row.providerName}</td>
            <td style={styles.cell}>{row.bookingDate}</td>
            <td style={styles.cell}>
              <button style={styles.viewButton} onClick={() => handleAction(row.id, "view")}>
                View
              </button>
              {!row.isRated && new Date(row.bookingDate) > new Date() && (
                <button style={styles.rateButton} onClick={() => handleAction(row.id, "rate")}>
                  Rate
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const WorkScreen = () => {
  const [ordersList, setOrdersList] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/fetchWork", {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrdersList(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAction = async (id, action) => {
    if (action === "view") {
      console.log(`View button clicked for ID: ${id}`);
      // Navigate to viewWork screen, you can use React Router for navigation
    } else if (action === "rate") {
      console.log(`Rate button clicked for ID: ${id}`);
      // Implement dialog for rating and sending data to backend
      const rating = prompt("Please rate the service out of 5:");
      if (rating && !isNaN(rating)) {
        try {
          const response = await fetch("http://localhost:5000/rate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, rating })
          });

          if (!response.ok) {
            throw new Error("Failed to rate service");
          }

          // Update UI or fetch orders again after rating
          fetchOrders();
        } catch (error) {
          console.error("Error rating service:", error);
        }
      } else {
        alert("Invalid rating input. Please enter a number.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "100vw", maxHeight: "100vh" }}>
      <ClientHomeScreenHeader />
      <div style={{ padding: "20px" }}>
        <p style={{ fontSize: "50px", textAlign: "start", fontWeight: "bold" }}>Work</p>
        <Table data={ordersList} handleAction={handleAction} />
      </div>
    </div>
  );
};

const styles = {
  columnHeader: {
    backgroundColor: "#f2f2f2",
    borderBottom: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  },
  cell: {
    borderBottom: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  },
  evenRow: {
    backgroundColor: "#f9f9f9",
  },
  oddRow: {
    backgroundColor: "#ffffff",
  },
  viewButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "1px solid #007bff",
    borderRadius: "5px",
    padding: "5px 10px",
    marginRight: "5px",
    cursor: "pointer",
  },
  rateButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "1px solid #28a745",
    borderRadius: "5px",
    padding: "5px 10px",
    marginRight: "5px",
    cursor: "pointer",
  },
};

export default WorkScreen;
