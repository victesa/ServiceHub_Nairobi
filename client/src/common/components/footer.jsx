import React from "react";

function HomeFooter() {
    return (
        <footer style={{ backgroundColor: "black", color: "white", textAlign: "center", padding: "20px 0", bottom: 0, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <span>&copy; ServiceHub</span>
            </div>
        </footer>
    );
}

export default HomeFooter;
