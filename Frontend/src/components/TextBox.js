import SelectDropDown from "./SelectDropDown";
import PropTypes from "prop-types"; // Import PropTypes
import axios from "axios";
import { useEffect, useState } from "react";
import { checkWordExistence } from "./api";
const TextBox = ({
  style,
  setShowModal,
  selectedLanguage,
  setTextToTranslate,
  textToTranslate,
  translatedText,
  setTranslatedText,
  outputLanguage,
  inputLanguage,
  userId,
}) => {
  const handleClick = () => {
    setTextToTranslate(""); // Clear the input text
    setTranslatedText(""); // Clear the translated text
  };
  const url = "http://localhost:4000";
  // Store or Remove Saved Word
  const toggleSavedWord = async (dataToSave) => {
    try {
      if (isWordSaved) {
        // If the word is saved, remove it from the database
        await axios.delete(
          `${url}/savedWord/delete?textToTranslate=${textToTranslate}`
        );
        setIsWordSaved(false); // Toggle the state to unfilled
      } else {
        // If the word is not saved, save it to the database
        await axios.post(`${url}/savedWord/saved`, dataToSave);
        console.log(dataToSave);
        setIsWordSaved(true); // Toggle the state to filled
      }
    } catch (error) {
      console.error("Error storing or deleting data:", error);
    }
  };

  const [isWordSaved, setIsWordSaved] = useState(false);

  useEffect(() => {
    // Call the function to check word existence
    if (style === "input" && textToTranslate) {
      checkWordExistence(textToTranslate).then((exists) => {
        setIsWordSaved(exists);
      });
    } else {
      // Reset isWordSaved to false when textToTranslate is empty
      setIsWordSaved(false);
    }
  }, [style, textToTranslate]); // Include textToTranslate as a dependency

  return (
    <div className="bg-white">
      <SelectDropDown
        style={style}
        setShowModal={setShowModal}
        selectedLanguage={selectedLanguage}
      />
      <textarea
        disabled={style === "output"}
        className={
          style === "input"
            ? "text-black border border-solid border-gray-500"
            : "text-black border border-solid border-gray-500"
        }
        placeholder={style === "input" ? "Enter text" : "Translation"}
        onChange={(e) => setTextToTranslate(e.target.value)}
        value={style === "input" ? textToTranslate : translatedText}
      />
      {style === "input" && textToTranslate && (
        <div className="delete absolute top-24 left-60" onClick={handleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
      )}
      {style === "output" && translatedText && (
        <div
          className="saved relative bottom-8 left-60 cursor-pointer"
          onClick={() => {
            const dataToSave = {
              name: userId,
              textToTranslate,
              outputLanguage,
              inputLanguage,
              translatedText,
            };
            toggleSavedWord(dataToSave);
          }}
        >
          {isWordSaved ? (
            <span role="img" aria-label="Filled Star">
              ⭐️
            </span>
          ) : (
            <span role="img" aria-label="Empty Star">
              ☆
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// PropTypes to specify the expected prop types
TextBox.propTypes = {
  style: PropTypes.string.isRequired,
  setShowModal: PropTypes.func.isRequired,
  selectedLanguage: PropTypes.string.isRequired,
  setTextToTranslate: PropTypes.func.isRequired,
  textToTranslate: PropTypes.string.isRequired,
  translatedText: PropTypes.string.isRequired,
  setTranslatedText: PropTypes.func.isRequired,
  outputLanguage: PropTypes.string.isRequired,
  inputLanguage: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default TextBox;
