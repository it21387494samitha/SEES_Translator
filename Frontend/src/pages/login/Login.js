import React, { useState } from "react";
import axios from "axios";
import Jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import loginphoto from "../login/gif.gif"
import loginphoto2 from "../login/gif3.gif"
import loginphoto3 from "../login/formbg.jpg"
import loginV from "../login/Pinterest_2.mp4"
import logol from "../../assets/logo.svg"

export default function Login() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [error, seterror] = useState("");
  const [success, setsuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const url = "http://localhost:4000";
  const refreashToken = async () => {
    try {
      const response = await axios.post(`${url}/user/refresh`, {
        token: user.refreashToken,
      });

      console.log(response);

      setUser({
        ...user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = Jwt_decode(user.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreashToken();
        config.headers["authorization"] = `Bearer ${data.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("submit");
    try {
      const response = await axios
        .post(`${url}/user/login`, {
          email,
          passwordHash,
        })
        .then((res) => {
          console.log(res.data.user.firstName);
          const newUser = { user: res.data.user };
          console.log(newUser);
          setUser(newUser);

          if (user) {
            console.log(user);
            setsuccess(true);
            seterror(false);
          }
          console.log(res.data);
          const { accessToken, refreshToken } = { ...res.data };
          console.log(accessToken);
          console.log(refreshToken);
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          console.log(newUser.user.firstName);
          if (newUser.user.lastName === "superadmin") {
            console.log("i am adim");
            navigate("/adminController");
          } else {
            console.log("i am user");
            navigate("/");
          }
        });
    } catch (error) {
      seterror("Invalid email or password");
      console.log(error);
    }
  };

  return (


<div style={{height:"100vh"}}>
  <div className="flex w-full h-30 bg-white ">
    <div className="flex w-18 h-18 ml-4"  ><img src={logol} alt=""/></div>
    <div className=" py-3  mr-70  pt-20 text-5xl font-bold leading-9 tracking-tight text-gray-900">Get A Quick, 
    Free Translation</div>
    <div className=" mx-12 text-black text-3xl"></div>

  </div>

<div className="flex    bg-white" style={{ height: "90vh", width: "100vw" }}>


<div className=" flex mt-8 mx-5"  style={{width:"180vh",height:"80vh"}}  >
  
<video className="background-video" autoPlay loop muted>
        <source src={loginV} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
{/* ,backgroundImage: `url(${loginphoto2})` */}
<div className="w-1/2 p-6">
<div className=" text-center ">
    
      {/* <img src={loginphoto2} alt="gif" className=" w-full " style={{height:"70vh" ,width:"100vh"}}/> */}
    
  </div>
  </div>


    <div className="w-1/2 bg-white" >
     {!user ? (
        <div className=" px-16" >
         
         <div className="min-h-92 flex flex-col justify-center items-center py-12 lg:px-8 bg-white mt-7" style={{ height: "70vh", width: "60vh", border: "1px solid #E5E7EB", boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)" }}>
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
      Log in to your account
    </h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form className="space-y-6" onSubmit={handleSubmit}>
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
            className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
            Password
          </label>
          <div className="text-sm">
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a>
          </div>
        </div>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={(e) => setPasswordHash(e.target.value)}
            required
            className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-950 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 focus:outline-none"
        >
          Login
        </button>
        {error && <div className="error text-red-600">{error}</div>}
      </div>
    </form>

    <p className="mt-10 text-center text-sm text-gray-500">
      Not a member?{" "}
      <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500" onClick={() => navigate("/register")}>
        Register here
      </a>
    </p>
  </div>
</div>


        </div>
      ) : (
        <div className="bg-slate-100 w-96 h-60 rounded-md">
          <span className="text-red-500">{user.gender}</span> <br />
          <span>{user && user.lastName}</span> <br />
          <span>{user && user.email}</span> <br />
        </div>
      )}
    </div>
    </div>






</div>







</div>

   

  );
}
