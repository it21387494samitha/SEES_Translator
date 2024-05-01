import React, { useState } from "react";
import axios from "axios";

export default function CreateNewMemberShip() {
  const [membership, setMembership] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const url = "http://localhost:4000";
  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a POST request to your API to add the new membership plan
    axios
      .post(`${url}/membershipType/`, formData)
      .then((result) => {
        // Update the state or perform any other necessary actions
        setMembership([...membership, result.data]);
        // Clear the form data
        setFormData({
          name: "",
          price: 0,
          description: "",
        });
      })
      .catch((err) => console.log(err));
  };

  return (


<div className=" bg-slate-300 h-screen flex justify-center items-center">
  <div style={{ width: "30%" }} className="bg-blue-950 p-10 rounded-lg">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white">Pricing plans</h1>
    </div>

    <form onSubmit={handleSubmit} className="mt-8">
      <div className="mb-6">
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">
          Membership Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="bg-white border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2"
          placeholder="Name for Membership"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="price" className="block mb-2 text-sm font-medium text-white">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          className="bg-white border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2"
          placeholder="Price"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="description" className="block mb-2 text-sm font-medium text-white">
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="bg-white border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2"
          placeholder="Description"
          required
        />
      </div>
      <div className="flex items-start mb-6">
        <input
          id="remember"
          type="checkbox"
          value=""
          className="w-4 h-4 border border-blue-300 rounded bg-white focus:ring-3 focus:ring-blue-500"
          required
        />
        <label htmlFor="remember" className="ml-2 text-sm font-medium text-white">
          Remember me
        </label>
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-4 py-2"
      >
        Submit
      </button>
    </form>
  </div>
</div>



  );
}
