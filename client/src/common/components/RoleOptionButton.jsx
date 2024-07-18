import React from "react";
import RadioCheckBox from "./RadioCheckBox"; // Correct import
import ClientImage from "../../images/clientImage.png";
import {imageStyle, buttonDivStyle, buttonSelectedDivStyle, topDivStyle, paragraphStyle, bottomDiv} from "./componentsStyles"


const buttonInformation = [
  {
    imageSrc: ClientImage,
    text: "I am a Client seeking services",
    key: 0,
  },
  {
    imageSrc: ClientImage,
    text: "I am a Service Provider looking for work",
    key: 1,
  },
];

function RoleOptionButton({
  buttonKey,
  imageSrc,
  text,
  updateChoice,
  choiceSelected,
}) {
  const isSelected = buttonKey === choiceSelected;

  return (
    <div
      style={isSelected ? buttonSelectedDivStyle : buttonDivStyle}
      onClick={() => updateChoice(buttonKey)}
    >
      <div style={topDivStyle}>
        <img src={imageSrc} alt="Role option" style={imageStyle} />
        <RadioCheckBox isChecked={isSelected} /> {/* Pass isChecked prop */}
      </div>
      <div style={bottomDiv}>
        <p style={paragraphStyle}>
          <b>{text}</b>
        </p>
      </div>
    </div>
  );
}

function RoleOptionButtons({ choiceSelected, onChoiceChange }) {
  const updateChoice = (choiceKey) => {
    onChoiceChange(choiceKey);
  };

  return (
    <div style={{ display: "flex" }}>
      {buttonInformation.map((buttonInfo) => (
        <RoleOptionButton
          key={buttonInfo.key}
          buttonKey={buttonInfo.key}
          imageSrc={buttonInfo.imageSrc}
          text={buttonInfo.text}
          updateChoice={updateChoice}
          choiceSelected={choiceSelected}
        />
      ))}
    </div>
  );
}

export default RoleOptionButtons;
