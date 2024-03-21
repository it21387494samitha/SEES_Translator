import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import premiumphoto from "../features/vecteezy_e-wallet-digital-payment-online-transaction-with-woman_9646297.jpg"

export default function PremiumFeature() {
  const [membership, SetMembership] = useState([]);
  //   const history = useHistory();
  const navigate = useNavigate();
  const url = "http://localhost:4000";
  useEffect(() => {
    axios
      .get(`http://localhost:4000/membershipType/view`)
      .then((result) => SetMembership(result.data))
      .catch((err) => console.log(err));
  }, []);

  //   const handleCardClick = (cardId) => {
  //     // Find the selected card data based on the cardId
  //     // const selectedCard = membership.find((card) => card.id === cardId);

  //     // Navigate to the CardDetailPage and pass the card data as a URL parameter
  //     // history.push(`/card-detail/${cardId}`, { cardData: selectedCard });
  //   };

  return (
    <div className="  h-80 bg-white">
      <div className="container mx-auto">
        <div className="mt-10">
          <h1 className="  mx-24  text-5xl font-bold leading-9 tracking-tight text-gray-900">
            Premium plans
          </h1>
        </div>
        <hr className="mt-10" />
        <div className="flex justify-center items-start pt-10">
          <div className="mx-4">
            <img src={premiumphoto} alt="Premium Feature" className="max-w-[300px] h-auto" />
          </div>
          {membership.map((plan) => (
            <div key={plan._id} className="py-12 mx-4">
              <div className="bg-white pt-4 w-[300px] h-[300px] rounded-xl space-y-6 overflow-hidden transition-all duration-500 transform hover:-translate-y-6 hover:scale-105 shadow-xl hover:shadow-2xl cursor-pointer" style={{border:"1px",boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)"}}>
                <div className="px-8 flex justify-between items-center">
                  <h4 className="text-xl font-bold text-gray-800">
                    {plan.name}
                  </h4>
                </div>
                <h1 className="text-4xl text-black text-center font-bold">
                  ${plan.price}
                </h1>
                <p className="px-4 text-center text-gray-400 text-sm">
                  {plan.description}
                </p>
                <div className="text-center bg-orange-500">
                  <button
                    className="inline-block my-6 font-bold text-white"
                    onClick={() => navigate(`/checkout/${plan._id}`)}
                  >
                    Get started today
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
