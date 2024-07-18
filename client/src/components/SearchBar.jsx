// SearchBar.jsx
import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div style={styles.searchBar}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSearch} style={styles.button}>
        <i className="fa fa-search" style={styles.icon}></i>
      </button>
    </div>
  );
};

const styles = {
  searchBar: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "450px",
    margin: "0 auto",
    border: "1px solid #ccc",
    borderRadius: "4px",
    overflow: "hidden",
    height: "60px",
    borderRadius: "10px",
    border: "1px solid gray"
  },
  input: {
    flex: 1,
    padding: "8px",
    border: "none",
    outline: "none",
  },
  button: {
    backgroundColor: "green",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "15%"
  },
  icon: {
    fontSize: "16px",
  },
};

export default SearchBar;
