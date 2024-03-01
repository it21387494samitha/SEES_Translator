// api.js
import axios from "axios";

export const checkWordExistence = async (textToTranslate) => {
  const url = "http://localhost:4000";
  try {
    const response = await axios.get(
      `${url}/savedWord/existSavedWord?textToTranslate=${textToTranslate}`
    );
    return response.data.exists;
  } catch (error) {
    console.error("Error checking data:", error);
    return false;
  }
};
