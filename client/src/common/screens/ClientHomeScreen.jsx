import React from "react";
import { BasicHeaderServiceHub } from "../components/Header";

function ClientHomeScreen(){
    return(
        <div>
            <BasicHeaderServiceHub/>
            <div style={{width: '100vw', height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <p>This is the client Home Screen</p>
            </div>
        </div>
    )
}

export default ClientHomeScreen;