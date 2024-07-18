import React from 'react';
import trustpic from "../../images/trustpic.png";
import wallet from "../../images/wallet.png"
import verificationId from "../../images/verificationId.png"
import time from "../../images/time.png"

const paragraphStyle = {
    fontFamily: "Inter",
  fontOpticalSizing: "auto",
  fontWeight: "400",
  fontStyle: "normal",
  fontVariationSettings:
    "slnt" ,
    color: "white", marginLeft: "10px", fontSize: "20px", marginTop: "0px"
}

function TrustHomeSection() {
    return (
        <div style={{width: "100%", height: "100vh", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", width: "90%", height: "65vh", alignItems: "center", justifyContent: "center"}}>
            <div style={{backgroundColor: "#13544E", width: "70%", height: "100%", display: "flex", alignItems: "start", flexDirection: "column"}}>
                <h1 style={{color: "white", fontSize: "70px", marginBottom: "10px", marginTop: '10px', marginLeft: "20px"}}>How <span style={{color: "#91E6B3"}}>Trust</span></h1>
                <h1 style={{color: "white", fontSize: "70px",marginBottom: "10px", marginTop: "0px", marginLeft: "20px"}}>is <span style={{color: "#91E6B3"}}>Built</span></h1>

                <p style={{color: "white", marginLeft: "20px", fontSize: "20px", marginTop: "0px", textAlign: "left"}}>We provide solutions to problems that clients and service providers face. Some of the solutions provided include</p>

                <div style={{display: "flex", marginLeft: "20px"}}>
                    <img src = {wallet} style={{width: "30px", height: "30px"}}/>

                    <p style={paragraphStyle}>Payment is done through the platform. No other charges incurred</p>
                </div>

                <div style={{display: "flex", marginLeft: "20px"}}>
                    <img src = {verificationId} style={{width: "30px", height: "30px"}}/>

                    <p style={paragraphStyle}>Manual verification is done for all service providers</p>
                </div>

                <div style={{display: "flex", marginLeft: "20px"}}>
                    <img src = {time} style={{width: "30px", height: "30px"}}/>

                    <p style={paragraphStyle}>Time is saved. They are just one click away</p>
                </div>
            </div>

            <div style={{width: "30%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <img src={trustpic} style={{maxWidth: "100%", maxHeight: "100%", minHeight: "100%", minWidth: "100%"}} alt="Trust Pic" />
            </div>
        </div>
        </div>
    );
}

export default TrustHomeSection;
