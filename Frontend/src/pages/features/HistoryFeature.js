// TranslationHistory.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import deletelogo from "../../assets/bin.svg";
import jsPDF from "jspdf";
import "jspdf-autotable";
import exporticon from "../../assets/export.svg";
import staricon from "../../assets/star.svg";
import logo from "../../assets/logo.svg";
import { MdDeleteSweep } from "react-icons/md";
import { PiExportBold } from "react-icons/pi";
const HistoryFeature = (userId) => {
  const [history, setHistory] = useState([]);
  const user = userId.userId;
  const [searchQuery, setSearchQuery] = useState("");

  const url = "http://localhost:4000";
  async function getDetails() {
    const id = { user };

    try {
      const posts = await axios
        .get(`${url}/history/getHistory`, {
          params: id,
        })
        .then((response) => {
          setHistory(response.data.response);
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

  const handleDelete = (id) => {
    // Show a confirmation dialog
    const confirmation = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (confirmation) {
      // User clicked "OK," proceed with the deletion
      axios
        .delete(`${url}/history/deleteHistory/` + id)
        .then((res) => {
          // Remove the deleted item from the local state
          setHistory((prevHistory) =>
            prevHistory.filter((item) => item._id !== id)
          );
        })
        .catch((err) => console.log(err));
    } else {
      // User clicked "Cancel," do nothing
      console.log("Deletion canceled.");
    }
  };

  const handleDeleteAll = () => {
    // Show a confirmation dialog
    const confirmation = window.confirm(
      "Are you sure you want to delete all items?"
    );

    if (confirmation) {
      // User clicked "OK," proceed with the deletion
      axios
        .delete(`${url}/history/clearAllData`)
        .then((res) => {
          // Remove all items from the local state
          setHistory([]);
        })
        .catch((err) => console.log(err));
    } else {
      // User clicked "Cancel," do nothing
      console.log("Deletion canceled.");
    }
  };
  const generateHistoryReport = () => {
    const doc = new jsPDF();
    doc.setFont("Sinhala");
    const tableColumn = [
      "Input Language",
      "Output Language",
      "Input Text",
      "Translated Text (Sinhala)", // Updated column name
    ];
    const tableRows = [];

    history.forEach((history) => {
      const rowData = [
        history.inputLanguage || "N/A",
        history.outputLanguage || "N/A",
        history.textToTranslate || "N/A",
        history.translatedText || "සිංහල අකුර", // Update this with the actual Sinhala word
      ];
      tableRows.push(rowData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("History_Report.pdf");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredHistory = history.filter(
    (item) =>
      item.textToTranslate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translatedText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:border-gray-700 dark:bg-gray-900 ">
      <div className="flex items-center">
        <img src={logo} className="ml-4 w-12 h-12" />{" "}
        {/* Adjust margin as needed */}
        <h2 className="px-5 mt-4 text-2xl font-bold text-orange-500 dark:text-white">
          Translation History
        </h2>
      </div>
      <input
        type="text"
        placeholder="Search"
        className="w-80 mt-4 ml-4 pl-4 rounded-xl  mx-auto"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div>
        <button
          className="float-right mr-4 text-orange-500 dark:text-orange-500"
          onClick={handleDeleteAll}
        >
          Clear All History
        </button>
      </div>

      <div className="overflow-y-auto  max-h-[62vh] w-full">
        <div className="mt-8 space-y-4">
          <div>
            <ul className="list-none p-2 m-2">
              {filteredHistory.map((item) => (
                <li key={item._id} className="translate-history-item pt-1">
                  <div className="bg-orange-100 shadow-xl dark:bg-orange-600 text-black w-40 p-2 flex justify-between items-center mb-2 rounded-xl dark:text-white">
                    <h2 className="text-x1 opacity-90 dark:text-white ml-2">
                      {item.inputLanguage} <span>&rarr;</span>{" "}
                      {item.outputLanguage}
                    </h2>
                  </div>
                  <div className="flex items-center justify-end">
                    <MdDeleteSweep
                      className="text-3xl text-orange-600"
                      onClick={() => handleDelete(item._id)}
                    />
                  </div>
                  <div className="ml-2 ">
                    <div className="original-text text-black opacity-70 dark:text-white">
                      <strong></strong> {item.textToTranslate}
                    </div>
                    <div className="translated-text text-black opacity-70 dark:text-white">
                      <strong></strong> {item.translatedText}
                    </div>
                  </div>
                  <hr className="my-2 border-orange-500 mt-7 opacity-30" />{" "}
                  {/* Separator line */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <button
        className="fixed top-4 right-10  text-white px-4 py-2 rounded "
        onClick={generateHistoryReport}
      >
        <PiExportBold className="text-xl" />
      </button>
    </div>
  );
};

export default HistoryFeature;
