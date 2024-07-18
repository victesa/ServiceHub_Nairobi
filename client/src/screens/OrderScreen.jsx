import React, { useState, useEffect } from "react";
import { ClientHomeScreenHeader } from "../../common/components/Header";
import { useNavigate } from "react-router-dom";

const Table = ({ data, handleAction }) => {
  const navigate = useNavigate();

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
              <button style={styles.viewButton} onClick={() => handleAction(row.request_id, row.provider_id)}>View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const OrderScreen = () => {
  const [ordersList, setOrdersList] = useState([]);
  const navigate = useNavigate()

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/fetchOrders", {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrdersList(data); // Assuming data is an array of orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAction = (id, provider_id) => {
    navigate(`/viewOrder/${id}/${provider_id}`)
    console.log(`View button clicked for ID: ${id}`);
  };

  return (
    <div style={{ maxWidth: "100vw", maxHeight: "100vh" }}>
      <ClientHomeScreenHeader />
      <div style={{ padding: "20px" }}>
        <p style={{ fontSize: "50px", textAlign: "start", fontWeight: "bold" }}>Orders</p>
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
    cursor: "pointer",
  },
};

export default OrderScreen;
