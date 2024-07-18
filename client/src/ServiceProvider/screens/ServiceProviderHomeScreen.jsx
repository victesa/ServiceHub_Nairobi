import React, { useEffect, useState } from "react";
import LeftNavigationBar from "../components/SellerNavigationBar";
import PortfolioScreen from "./PortfolioScreen";
import EmptyRequest from "../components/RequestBox";
import FinanceScreen from "./FinanceScreen";
import ProfileSetUpSection from "../components/ProfileSetupSection";
import { SellerHomeScreenHeader } from "../../common/components/Header";

function ServiceProviderHomeScreen() {
    const [selectedScreen, setSelectedScreen] = useState("Portfolio");
    const [listOfServices, setListOfServices] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const userId = localStorage.getItem("userId");
    const [updateService, setUpdateService] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/clientHomeScreen', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                    credentials: 'include', // Include credentials in request
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const data = await response.json();
                setListOfServices(data.services);
                setUserDetails(data.userDetails);
            } catch (error) {
                console.error("Error fetching home details:", error);
            }
        };

        fetchData();
    }, [updateService]);

    const navToScreen = (screen) => {
        setSelectedScreen(screen);
    };

    let screenComponent;

    if (selectedScreen === "Portfolio") {
        screenComponent = <PortfolioScreen listOfServices={listOfServices} updateServices={() => setUpdateService(updateService + 1)}/>;
    } else if (selectedScreen === "Requests") {
        screenComponent = <EmptyRequest />;
    } else {
        screenComponent = <FinanceScreen />;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <SellerHomeScreenHeader image={userDetails.profilePic} />
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <LeftNavigationBar selectedScreen={selectedScreen} onSelectScreen={navToScreen} />
                <div style={{ overflow: "auto", flex: 1 }}>
                    {screenComponent}
                </div>
            </div>
        </div>
    );
}

export default ServiceProviderHomeScreen;
