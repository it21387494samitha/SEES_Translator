import React, { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useError } from "../../context/checkoutContext";
import payemntphoto from "../checkout/20230615161838blobid0-unscreen.gif";
import paymentphoto1 from "../checkout/vecteezy_e-wallet-digital-payment-online-transaction-with-woman_9646297-removebg-preview.png";

export default function Checkout() {
  // Get the object ID from the URL using useParams

  const [cardError, setCardError] = useState(false);
  const [cardErrorMsg, setCardErrorMsg] = useState("");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expireDate: "",
    expireMonth: "",
    cvv: "",
    nameOnCard: "",
  });
  const url = "http://localhost:4000";
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    duration: "",
  });

  const params = useParams();
  const navigate = useNavigate();

  //get membership type details
  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(
        `${url}/membershipType/view/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        window.alert(`Record with id ${id} not found`);
        // navigate("/");
        // return;
      }
      setForm(record);
    }
    fetchData();
    fetchUserData();
    return;
  }, [params.id, navigate]);

  const [memebrShipCurrentStatus, setStatus] = useState({});
  const [user, setUser] = useState({});
  const [isLogedIn, setIsLogedIn] = useState(false); // Updated state
  const [cardNumber, setCardNumber] = useState("");

  // Handle the input change event for the card number field
  const handleInputChange = (e) => {
    // Remove any characters that are not digits or hyphens
    const sanitizedValue = e.target.value.replace(/[^0-9-]/g, "");
    setCardNumber(sanitizedValue);
  };

  // fetch membership data using user email
  const fetchMembershipData = async () => {
    try {
      const response = await axios.post(
        `${url}/membership/getMembershipDetails`,
        {
          email: user.email,
        }
      );
      console.log(response);
      navigate("#");
    } catch (error) {
      console.err("Error fetching user data:", error);
    }
  };

  // Fetch user data from the server
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .post(`${url}/user/details`, null, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.user) {
            setUser(res.data.user);
            setIsLogedIn(true);
          } else {
            setIsLogedIn(false);
          }
        })
        .catch((err) => {
          console.log(err.response?.data);
        });
    } catch (error) {
      console.err("Error fetching user data:", error);
    }
  };

  //validate card details

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData({
      ...cardData,
      [name]: value,
    });
  };
  // console.log(user.email);

  const checkStatus = async (e) => {
    let data = user.email;

    try {
      // let email = user.email;
      // console.log(email);  //console print email correctly
      const response = await axios
        .post(`${url}/membership/getMembershipDetails`, {
          //xhr.js:251     POST http://localhost:5050/membership/getMembershipDetails 400 (Bad Request)
          email: data,
        })
        .then((res) => {
          // console.log(res.data.user.firstName);
          const memebrShipStatus = res.data;
          console.log(memebrShipStatus);
          console.log(memebrShipStatus.status);
          setStatus(memebrShipStatus.status);
        })
        .catch((err) => {
          console.log(err.response?.data);
        });
    } catch (error) {
      console.log(error);
      console.log("bbbbbb");
    }
  };

  // console.log(memebrShipStatus);

  const validateCard = async () => {
    console.log(cardNumber.length);
    if (cardNumber.length != 19) {
      console.log("xxxxxxx");

      setCardError(false);
      setCardErrorMsg("Card number must be 16 digits");
      console.log("card number must be 16 digits");
    } else {
      setCardError(true);
      console.log(cardError);
      setCardErrorMsg("Approved payment");
      console.log("zzzzzzzaz");
    }
  };

  const activatingMembership = async (e) => {
    console.log("fffffff");
    console.log(cardError);

    if (cardError) {
      if (memebrShipCurrentStatus === "active") {
        alert("Membership already activated");
      } else {
        try {
          const response = await axios.post(`${url}/membership/`, {
            email: user.email,
            name: form.name,
            payment: "approved",
          });
          console.log(response);
          alert("Payment is successfull");
          navigate("/");
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      // alert("Payment is not successfull");
      console.log("falsessss");
    }
  };

  //must check membership already activated or nots
  const handleSubmit = (e) => {
    e.preventDefault();
    validateCard().then((res) => {
      checkStatus().then((res) => {
        activatingMembership();
      });

      setCardData({
        cardNumber: "",
      });
    });
    localStorage.setItem("subscription", true);
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center ">
      <div className=" pt-34 " style={{ height: "100vh" }}>
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-center items-center mr-28">
            <h2 className="text-3xl font-bold leading-9 tracking-tight text-gray-900">
              Check Out
            </h2>
            <hr className="w-24 border-b-2 border-gray-800 mt-2" />
          </div>

          <div className="flex flex-col justify-center items-center">
            <img src={payemntphoto} className=" w-52 h-36  ml-96" />
          </div>
        </div>

        <div
          className=" bg-white  ml-16  "
          style={{
            width: "130vh",
            border: "1px solid black",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
            borderRadius: "10px",
          }}
        >
          <div className="flex">
            <div
              className="relative col-span-full flex flex-col py-6 pl-8 pr-4 sm:py-12 lg:col-span-4 lg:py-24"
              style={{
                width: "60vh",
                background: "#FF7F0E",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 className="sr-only">Order summary</h2>
              <div className="relative">
                <img
                  src="https://blog.contactpigeon.com/wp-content/uploads/2020/08/Mobile-Checkout-Best-Practices.png"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-gray-900 to-black opacity-95 rounded-t-lg"></div>
              </div>
              <div className="relative px-4">
                <ul className="space-y-5">
                  <li className="flex justify-between">
                    <div className="inline-flex">
                      <img
                        src="https://images.unsplash.com/photo-1620331311520-246422fd82f9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fGhhaXIlMjBkcnllcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                        alt=""
                        className="max-h-16 rounded-lg"
                      />
                      <div className="ml-3">
                        <p className="text-base font-semibold text-white">
                          {form.name}
                        </p>
                        <p className="text-sm font-medium text-gray-200">
                          {form.description}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {form.price}$
                    </p>
                  </li>
                </ul>
                <div className="my-5 h-0.5 w-full bg-gray-500"></div>
                <div className="space-y-2">
                  <p className="flex justify-between text-lg font-bold text-white">
                    <span>Total price:</span>
                    <span>{form.price}$</span>
                  </p>
                  <p className="flex justify-between text-sm font-medium text-gray-200">
                    <span>Vat: 10%</span>
                    <span>${(form.price * 0.1).toFixed(2)}</span>
                  </p>
                </div>
              </div>
              <div className="relative mt-10 text-gray-200 px-4">
                <h3 className="mb-5 text-lg font-bold">Support</h3>
                <p className="text-sm font-semibold">
                  +01 653 235 211{" "}
                  <span className="font-light">(International)</span>
                </p>
                <p className="mt-1 text-sm font-semibold">
                  support@seestranslator.com{" "}
                  <span className="font-light">(Email)</span>
                </p>
                <p className="mt-2 text-xs font-medium">
                  Call us now for payment related issues
                </p>
              </div>
              <div className="relative mt-10 flex px-4">
                <p className="flex flex-col">
                  <span className="text-sm font-bold text-white">
                    Money Back Guarantee
                  </span>
                  <span className="text-xs font-medium text-gray-200">
                    within 30 days of purchase
                  </span>
                </p>
              </div>
            </div>

            <div
              className="flex flex-col mb-6"
              style={{ width: "70vh", background: "white" }}
            >
              <form
                action=""
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
                className="mt-9 space-y-4 mx-12 items-center"
                style={{ color: "white" }}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold text-orange-500"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={isLogedIn ? user.email : ""}
                    className="mt-1 block w-full rounded border-gray-300 bg-white py-3 px-4 text-sm placeholder-gray-500 shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="flex space-x-10">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="text-xs font-semibold text-orange-500"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      name="first-name"
                      value={isLogedIn ? user.firstName : ""}
                      className="mt-1 block w-full rounded border-gray-300 bg-white py-3 px-4 text-sm placeholder-gray-500 shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="text-xs font-semibold text-orange-500"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      name="last-name"
                      value={isLogedIn ? user.lastName : ""}
                      className="mt-1 block w-full rounded border-gray-300 bg-white py-3 px-4 text-sm placeholder-gray-500 shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label
                    htmlFor="card-number"
                    className="text-xs font-semibold text-orange-500"
                  >
                    Card number
                  </label>
                  <input
                    type="text"
                    maxLength="19"
                    id="card-number"
                    name="card-number"
                    placeholder="1234-5678-XXXX-XXXX"
                    value={cardNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded border-gray-300 bg-white py-3 px-4 pr-10 text-sm placeholder-gray-500 shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500"
                  />
                  <img
                    src="/images/uQUFIfCYVYcLK0qVJF5Yw.png"
                    alt=""
                    className="absolute bottom-3 right-3 max-h-4"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-orange-500">
                    Expiration date
                  </p>
                  <div className="mr-6 flex flex-wrap">
                    <div className="my-1">
                      <label htmlFor="month" className="sr-only">
                        Select expiration month
                      </label>
                      <select
                        name="month"
                        id="month"
                        className="cursor-pointer rounded border-gray-300 bg-white py-3 px-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500"
                        style={{
                          color: "gray",
                          backgroundColor: "white",
                          borderColor: "#D1D5DB",
                        }}
                      >
                        <option value="">01</option>
                        <option value="">02</option>
                        <option value="">03</option>
                        <option value="">04</option>
                        <option value="">05</option>
                        <option value="">06</option>
                        <option value="">07</option>
                        <option value="">08</option>
                        <option value="">09</option>
                        <option value="">09</option>
                        <option value="">10</option>
                        <option value="">11</option>
                        <option value="">12</option>
                      </select>
                    </div>
                    <div className="my-1 ml-3 mr-6">
                      <label htmlFor="year" className="sr-only">
                        Select expiration year
                      </label>
                      <input
                        maxLength="4"
                        type="number"
                        name="year"
                        id="year"
                        className="cursor-pointer rounded border-gray-300 bg-white py-3 px-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div className="relative my-1">
                      <label htmlFor="security-code" className="sr-only">
                        Security code
                      </label>
                      <input
                        type="text"
                        id="security-code"
                        name="security-code"
                        placeholder="CVV"
                        className="block w-36 rounded border-gray-300 bg-white py-3 px-4 text-sm placeholder-gray-500 shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="card-name"
                    className="text-xs font-semibold text-orange-500"
                  >
                    Card name
                  </label>
                  <input
                    type="text"
                    id="card-name"
                    name="card-name"
                    placeholder="Name on the card"
                    className="mt-1 block w-full rounded border-gray-300 bg-white py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <p className="mt-10 text-center text-sm font-semibold text-gray-700">
                  By placing this order you agree to the{" "}
                  <a
                    href="#"
                    className="whitespace-nowrap text-blue-400 underline hover:text-blue-600"
                  >
                    Terms and Conditions
                  </a>
                </p>
                <button
                  type="submit"
                  className="mt-8 mb-5 inline-flex w-full items-center justify-center rounded bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white text-base font-semibold py-3 px-6 transition duration-300 ease-in-out"
                >
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-72 ">
        <img
          src={paymentphoto1}
          className=" pb-0"
          style={{ width: "100vh", height: "53vh " }}
        />
      </div>
    </div>
  );
}
