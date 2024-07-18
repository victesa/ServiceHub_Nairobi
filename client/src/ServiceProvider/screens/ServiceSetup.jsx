import React from "react";
import { BasicHeaderServiceHub } from "../../common/components/Header";
import ServiceSetup from "../components/ServiceSetup";

function ServiceSetupScreen(){
    return(
        <div style={{maxWidth: "100%", overflowY: 'hidden'}}>
            <BasicHeaderServiceHub/>

            <ServiceSetup/>
        </div>
    )
}

export default ServiceSetupScreen