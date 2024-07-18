import HomeScreenHeader from "../components/Header"
import homeScreenPic from "../../images/homeScreenPic.png"
import "../../robotoFonts.css"
import TrustHomeSection from "../components/trustHomeSection"
import PopularServicesHome from "../components/popularServicesHome";
import { useNavigate } from "react-router-dom";
import HomeFooter from "../components/footer";

const heroDivStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    overflow: "hidden",
    scrollbarWidth: "none", /* Firefox */
    msOverflowStyle: "none" /* Internet Explorer 10+ */
};

const webkitScrollbarStyle = `
  ::-webkit-scrollbar {
    display: none;
  }
`;

const contentDiv = {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "90vh",
    display: "flex",
    flex: "1"
}

const leftHeroDivStyle = {
    width: "40%",
    height: "80%",
    display: "flex",
    flexDirection: "column",
    padding: "50px",
    fontFamily: "Roboto"
}

const rightHeroDivStyle = {
    width: "60%",
    height: "80%",
    justifyContent: "center"
}

function HomeScreen(){
    const navigate = useNavigate()

    const navigateToRoleOptionScreen = ()=>{
        navigate("/roleOptionScreen")
    }
    return(
    <div style={heroDivStyle}>
        <style>{webkitScrollbarStyle}</style>
        <HomeScreenHeader/>
        <div style={contentDiv}>
            <div style={leftHeroDivStyle} className="font-container">
                <h1 className="lora-text">Hiring should be stress-free</h1>
                <p style={{fontSize: "30px", textAlign: "left", marginTop: "10px"}}>
                    Forget about insecurities when hiring or looking for work. Security is enhanced here</p>
                <button style={{color: "white", 
                backgroundColor: "green",
                 borderRadius: "14px", border: "1px solid green", marginRight: "30px", height: "35px", width: "250px", fontSize: "15px"}}
                 onClick={navigateToRoleOptionScreen}>
                    Get Started
                </button>
            </div>

            <div style={rightHeroDivStyle}>
                <img src={homeScreenPic}/>
            </div>
        </div>

        <PopularServicesHome/>

        <TrustHomeSection/>

        <HomeFooter/>
    </div>
    )
}

export default HomeScreen