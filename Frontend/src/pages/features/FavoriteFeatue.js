import React, { useState, useEffect } from "react";
import axios from "axios";
import { checkWordExistence } from "../../components/api";
import jsPDF from "jspdf";
import "jspdf-autotable";
import exporticon from "../../assets/export.svg";
import logo from "../../assets/logo.svg";
import star from "../../assets/filledstar.svg";
import { FaStar } from "react-icons/fa";
import { PiExportBold } from "react-icons/pi";
const FavoriteFeatue = (userId) => {
  const [savedWords, setSavedWords] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [editingItemId, setEditingItemId] = useState(null); // Track which item is being edited
  const [isWordSaved, setIsWordSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWords, setFilteredWords] = useState([]);
  const user = userId.userId;
  const handleEditClick = (id) => {
    setIsEditing(true);
    setEditingItemId(id);
  };
  const url = "http://localhost:4000";
  const handleSaveClick = () => {
    const confirmation = window.confirm(
      "Are you sure you want to save the changes?"
    );

    if (confirmation) {
      setIsEditing(false);
      axios
        .put(`${url}/savedWord/updateMessage/${editingItemId}`, {
          message,
        })
        .then((result) => {
          console.log(result);
          console.log(message);
          getDetails();
        })
        .catch((err) => {
          console.error("Error updating message:", err);
          // You can display an error message to the user here if needed
        });
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  async function getDetails() {
    const id = { user };

    try {
      console.log(id);
      const posts = await axios
        .get(`${url}/savedWord/getSavedWord`, {
          params: id,
        })

        .then((response) => {
          setSavedWords(response.data.response);
          console.log(response);
        })
        .catch((err) => {
          console.log(err.response?.data?.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const refreshInterval = 1000; // 10 seconds in milliseconds

    const fetchData = async () => {
      try {
        await getDetails();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Fetch data immediately when the component mounts

    const intervalId = setInterval(fetchData, refreshInterval); // Set up the interval

    return () => clearInterval(intervalId); // Clean up the interval when the component unmounts
  }, []);

  const handleDelete = (textToTranslate) => {
    // Show a confirmation dialog
    const confirmation = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (confirmation) {
      // User clicked "OK," proceed with the deletion
      axios
        .delete(`${url}/savedWord/delete?textToTranslate=${textToTranslate}`)
        .then((res) => {
          console.log(res);
          // Remove the deleted item from the local state

          checkWordExistence(textToTranslate).then((exists) => {
            setIsWordSaved(exists);
          });
        })
        .catch((err) => console.log(err));
    } else {
      // User clicked "Cancel," do nothing
      console.log("Deletion canceled.");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredItems = savedWords.filter((item) =>
      item.textToTranslate.toLowerCase().includes(query)
    );

    setFilteredWords(filteredItems);
  };

  const generateSavedReport = () => {
    const doc = new jsPDF();
    doc.setFont("Sinhala");
    const tableColumn = [
      "Input Language",
      "Output Language",
      "Input Text",
      "Translated Text (Sinhala)", // Updated column name
    ];
    const tableRows = [];

    savedWords.forEach((saved) => {
      const rowData = [
        saved.inputLanguage || "N/A",
        saved.outputLanguage || "N/A",
        saved.textToTranslate || "N/A",
        saved.translatedText || "සිංහල අකුර", // Update this with the actual Sinhala word
      ];
      tableRows.push(rowData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("Saved_Report.pdf");
  };

  return (
    <div className="bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center">
        <img src={logo} className="ml-4 w-12 h-12" />{" "}
        {/* Adjust margin as needed */}
        <h2 className="px-5 mt-4 text-2xl font-bold text-orange-500 dark:text-white">
          Favorite
        </h2>
      </div>
      <input
        type="text"
        placeholder="Search"
        className="w-80 mt-4 ml-4 pl-4 rounded-xl border border-gray-300 mx-auto"
        value={searchQuery}
        onChange={handleSearch}
      />
      <ul className="list-none p-2 m-2 mt-10">
        {(searchQuery ? filteredWords : savedWords).map((item) => (
          <li
            key={item._id}
            className="flex justify-between items-start mb-10 border-b border-orange-400 border-opacity-20 "
          >
            <div className="translate-history-item w-2/5">
              <div className="flex justify-between items-center">
                <div className="bg-orange-100 shadow-xl dark:bg-orange-600 text-black w-40 p-2 flex justify-between items-center mb-2 rounded-xl dark:text-white">
                  <h2 className="text-x1 opacity-90 dark:text-white ml-2">
                    {item.inputLanguage} <span>&rarr;</span>{" "}
                    {item.outputLanguage}
                  </h2>
                </div>
              </div>
              <div className="ml-2 mt-2">
                <div className="original-text text-black opacity-70 dark:text-white">
                  {item.textToTranslate}
                </div>
                <div className="translated-text text-black opacity-70 dark:text-white mb-2">
                  {item.translatedText}
                </div>
              </div>
            </div>
            <div className="p-4 w-2/5 flex justify-between items-end border rounded-lg">
              <div className="w-3/4">
                {isEditing && editingItemId === item._id ? (
                  <>
                    <textarea
                      className="w-full min-h-[100px] border border-gray-300 p-2 rounded dark:text-white"
                      value={message}
                      onChange={handleChange}
                    />
                    <button
                      className="mt-2 px-4 py-2 bg-orange-600 text-white rounded "
                      onClick={handleSaveClick}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <div className="whitespace-pre-wrap break-words relative">
                      <span className="text-black opacity-50 dark:text-white">
                        Note:
                      </span>
                      <br />
                      <div className="dark:text-white">{item.message}</div>
                      <div className="absolute   bottom-6 left-64">
                        <button
                          className="mt-2 p-2  dark:text-white rounded-full flex"
                          onClick={() => handleEditClick(item._id)}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 0C10.2549 0.000282707 10.5 0.0978791 10.6854 0.272848C10.8707 0.447818 10.9822 0.686953 10.9972 0.941395C11.0121 1.19584 10.9293 1.44638 10.7657 1.64183C10.6021 1.83729 10.3701 1.9629 10.117 1.993L10 2H2V16H16V8C16.0003 7.74512 16.0979 7.49997 16.2728 7.31463C16.4478 7.1293 16.687 7.01776 16.9414 7.00283C17.1958 6.98789 17.4464 7.07067 17.6418 7.23426C17.8373 7.39785 17.9629 7.6299 17.993 7.883L18 8V16C18.0002 16.5046 17.8096 16.9906 17.4665 17.3605C17.1234 17.7305 16.6532 17.9572 16.15 17.995L16 18H2C1.49542 18.0002 1.00943 17.8096 0.639452 17.4665C0.269471 17.1234 0.0428434 16.6532 0.00500021 16.15L1.00268e-07 16V2C-0.000159579 1.49542 0.190406 1.00943 0.533497 0.639452C0.876587 0.269471 1.34684 0.0428433 1.85 0.00500011L2 0H10ZM16.243 0.343C16.423 0.163652 16.6644 0.0595265 16.9184 0.0517719C17.1723 0.0440173 17.4197 0.133215 17.6103 0.301249C17.8008 0.469282 17.9203 0.703552 17.9444 0.956475C17.9685 1.2094 17.8954 1.46201 17.74 1.663L17.657 1.758L7.757 11.657C7.57704 11.8363 7.33557 11.9405 7.08162 11.9482C6.82767 11.956 6.58029 11.8668 6.38972 11.6988C6.19916 11.5307 6.07969 11.2964 6.0556 11.0435C6.03151 10.7906 6.10459 10.538 6.26 10.337L6.343 10.243L16.243 0.343Z"
                              fill="#FF6E41"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="w-1/4 flex justify-end">
              <div onClick={() => handleDelete(item.textToTranslate)}>
                <span>
                  <FaStar className="text-orange-600 text-xl" />
                </span>
              </div>
            </div>
            <hr className="my-2 border-orange-500 mt-7 opacity-30" />{" "}
            {/* Separator line */}
          </li>
        ))}
      </ul>

      <button
        className="fixed top-4 right-10  text-white px-4 py-2 rounded "
        onClick={generateSavedReport}
      >
        <PiExportBold className="text-xl" />
      </button>
    </div>
  );
};

export default FavoriteFeatue;
