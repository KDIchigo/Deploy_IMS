import { RedoOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";

export const GeneratePassword = ({
  length,
  uppercase,
  lowercase,
  numbers,
  symbols,
  placeholder,
  classNameDiv,
  classNameInput,
  label,
  important,
  isRandom,
  formik,
}) => {
  const [passwordGen, setPasswordGen] = useState({
    length: length,
    uppercase: uppercase,
    lowercase: lowercase,
    numbers: numbers,
    symbols: symbols,
  });
  const [handelText, setHandelText] = useState("Dung1881@");
  const [random, setRandom] = useState(true);

  function generatePassword() {
    const numbersArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const symbolsArray = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];

    const characterCodes = Array.from(Array(26)).map((_e, i) => i + 97);
    const lowerCaseLetters = characterCodes.map((code) =>
      String.fromCharCode(code)
    );
    const upperCaseLetters = lowerCaseLetters.map((letter) =>
      letter.toUpperCase()
    );

    const { length, uppercase, lowercase, numbers, symbols } = passwordGen;

    const generateTheWord = (
      length,
      uppercase,
      lowercase,
      numbers,
      symbols
    ) => {
      const availableCharacters = [
        ...(lowercase ? lowerCaseLetters : []),
        ...(uppercase ? upperCaseLetters : []),
        ...(numbers ? numbersArray : []),
        ...(symbols ? symbolsArray : []),
      ];
      const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
      const characters = shuffleArray(availableCharacters).slice(0, length);
      setHandelText(characters.join(""));
      return characters;
    };
    
    formik.setFieldValue("password", handelText);
    generateTheWord(length, uppercase, lowercase, numbers, symbols);
  }

  return (
    <>
      {random === true ? (
        <BaseInputField
          type="password"
          id="password"
          value={formik.values.password}
          classNameInput={classNameInput}
          placeholder={placeholder}
          label={label}
          classNameDiv={classNameDiv}
          important={important}
          random={random}
          isRandom={isRandom}
          setRandom={setRandom}
          icon={<RedoOutlined onClick={generatePassword} />}
        />
      ) : (
        <BaseInputField
          type="password"
          id="password"
          placeholder={placeholder}
          value={formik.values.password}
          onChange={formik.handleChange}
          label={label}
          classNameInput={classNameInput}
          classNameDiv={classNameDiv}
          important={important}
          random={random}
          isRandom={isRandom}
          setRandom={setRandom}
        />
      )}
    </>
  );
};
