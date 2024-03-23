import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import myphot1 from "../registration/image_processing20191104-3658-12n18dk.gif"
import backgroundImage from "../registration/pexels-pixabay-268533.jpg"

export default function Registration() {
  const [firstName, setFname] = useState("");
  const [lastName, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [passwordHash, setPassword] = useState("");
  const [cnfirmPassword, setCnfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  

  const navigation = useNavigate();
  const url = "http://localhost:4000";
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");
    if (passwordHash !== cnfirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      console.log("heeee" + gender);
      const response = await axios.post(`${url}/user`, {
        firstName,
        lastName,
        email,
        passwordHash,
        gender,
        age,
        address,
      });
      console.log(response);
      alert("Registration successful!");
      setTimeout(() => {
        navigation("/login");
      }, 3000); // Redirect to login page after 3 seconds
    } catch (error) {
      setError("Error with registration");
      console.log(error);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    return null;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
    } else {
      setPassword(newPassword);
      setError("");
    }
  };


  return (
    <div className=" w-full h-80px bg-white rounded-md overflow-auto" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }} >
     <div className=" flex justify-center"> <p className=" text-4xl text-black ">Register Here...  </p></div>
     
      <div className=" flex justify-center">
       
         



          {/* <div className=".h-auto w-full  text-cente bg-white" >
            <div className=" mt-40  "> <img src={myphoto}  alt="photo1"/> </div>
      </div> */}

        <div className="flex-auto w-full max-w-lg bg-white shadow-2xl rounded-xl px-8 pt-6 pb-8 mb-4" >
        {/* {successMessage && ( // Display success message if exists
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )} */}
        <form className="space-y-6" onSubmit={handleSubmit}>
    <div className="flex flex-row place-content-between">
      <div>
        <label htmlFor="fname" className="block text-sm font-medium leading-6 text-gray-900">
          First name
        </label>
        <div className="mt-2">
          <input
            id="fname"
            name="fname"
            type="text"
            autoComplete="first name"
            placeholder="First Name"
            required
            onChange={(e) => setFname(e.target.value)}
            className="block w-full rounded-md border-gray-300 px-2.5 py-1.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="lname" className="block text-sm font-medium leading-6 text-gray-900">
          Last name
        </label>
        <div className="mt-2">
          <input
            id="lname"
            name="lname"
            type="text"
            autoComplete="last name"
            placeholder="Last Name"
            onChange={(e) => setLname(e.target.value)}
            required
            className="block w-full rounded-md border-gray-300 px-2.5 py-1.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>

    <div className="flex flex-row place-content-between">
      <div>
        <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
          Gender
        </label>
        <div className="mt-2">
          <select
            id="gender"
            name="gender"
            required
            onChange={(e) => console.log(e.target.value)}
            className="block w-48 h-10 rounded-md border-gray-300 px-2.5 py-1.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="Age" className="block text-sm font-medium leading-6 text-gray-900">
          Age
        </label>
        <div className="mt-2">
          <input
            id="Age"
            name="Age"
            onChange={(e) => setAge(e.target.value)}
            type="number"
            required
            className="block w-full rounded-md border-gray-300 px-2.5 py-1.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>

    <div>
      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
        Email address
      </label>
      <div className="mt-2">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email Address"
          className="block w-full rounded-md border-gray-300 px-2.5 py-1.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={handlePasswordChange}
                  className="block w-full rounded-md border-gray-300 px-2.5 py-1.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>


            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="cnfirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="cnfirmPassword"
                  name="cnfirmPassword"
                  type="password"
                  onChange={(e) => setCnfirmPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Address{" "}
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="current-address"
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <span className="text-red-600 font-semibold">{error}</span>

            <div className=" flex">

              <div className="w-56" style={{ marginLeft: "8px",marginBottom: "-20px", marginRight:"35px"}} ><button
                type="button"
                onClick={() => {
                  navigation("/login");
                }}
                className="mt-2 flex w-full justify-center rounded-md bg-red-600 h-9 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-center"
                style={{display: "flex", alignItems: "center"}}
              >
                Back
              </button></div>
              <div className=" w-56 "style={{ marginRight: "8px",marginTop:"9.4px "}}>
<button
                type="submit"
                className=" h-9 flex w-full justify-center rounded-md bg-orange-600 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                style={{display: "flex", alignItems: "center"}}
              >
                Register
              </button>
</div>
            </div>
          </form>
        </div>
        {/* <div className=". pt-4  w-full text-center mb-0  "  >
        <img src={myphot1}  alt="photo1" className=" mt-80 w-fit"/> 
      </div> */}
      </div>
    </div>
  );
}
