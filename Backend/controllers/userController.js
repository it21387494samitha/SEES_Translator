import mongoose from "../db/conn.js";
import userSchema from "../models/usermodel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const userModel = mongoose.model("User", userSchema);

export function hashPasswordNew(password) {
  return crypto
    .pbkdf2Sync(password, "no_salt", 1000, 64, `sha512`)
    .toString(`hex`);
}
//add new user

export function registerUser(req, res) {
  const { firstName, lastName, email, passwordHash, gender, age, address } =
    req.body;

  let newUser = new userModel();
  newUser.firstName = firstName;
  newUser.lastName = lastName;
  newUser.email = email;
  newUser.passwordHash = hashPasswordNew(passwordHash);
  newUser.gender = gender;
  newUser.age = age;
  newUser.address = address;

  newUser
    .save()
    .then((response) => {
      res.send(response);
      console.log("User added successfully");


    })
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
}

// create an admin account
export function adminAccount(req, res) {
  const { firstName, lastName, email, passwordHash, gender, age, address } =
    req.body;

  let newUser = new userModel();
  newUser.firstName = "admin";
  newUser.lastName = "superadmin";
  newUser.email = "admin@gmail.com";
  newUser.passwordHash = hashPasswordNew("0000");
  newUser.gender = "---";
  newUser.age = 12;
  newUser.address = "admin";

  newUser
    .save()
    .then((response) => {
      res.send(response);
      console.log("User added successfully");
    })
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
}

// login user

const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, "secret_key", {
    expiresIn: "18m",
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, "refresh_secret_key", {
    expiresIn: "18m",
  });
};

const loginUser = (req, res) => {
  const { email, passwordHash } = req.body;

  userModel
    .findOne({ email: email })
    .then((user) => {
      // check response is not null
      if (user != null) {
        // check if the user is admin
        if (
          user.email === "admin@gmail.com" &&
          user.passwordHash === hashPasswordNew("0000")
        ) {
          const A_token = generateAccessToken(user);
          const R_token = generateRefreshToken(user);

          // req.session.userId = response._id;

          refreashTokens.push(R_token);

          res.status(200).json({
            message: "Auth successful, admin",
            accessToken: A_token,
            refreshToken: R_token,
            user: user,
          });
        } else {
          if (user.passwordHash == hashPasswordNew(passwordHash)) {
            const A_token = generateAccessToken(user);
            const R_token = generateRefreshToken(user);

            res.status(200).json({
              message: "Auth successful",
              accessToken: A_token,
              refreshToken: R_token,
              user: user,
            });
          } else {
            res.send("Incorrect password");
          }
        }
      } else {
        res.send("User not found");
      }
    })
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
};

const userDetailsByEmail = (req, res) => {
  const email = req.params.email; // Assuming email is passed as a route parameter
  // console.log("Email:", email); // Log the email for debugging

  // Find the user by email in the database
  userModel
    .findOne({ email: email })
    .then((user) => {
      if (user) {
        // User found, send details
        // console.log("User found:", user); // Log user details for debugging
        res.status(200).json({
          message: "User Details",
          user: user,
        });
      } else {
        // User not found
        // console.log("User not found");
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      // Error occurred
      // console.error("Error fetching user details:", err); // Log error for debugging
      res.status(500).json({ error: "Internal Server Error" });
    });
};

//get user details
const userDetails = (req, res) => {
  const email = req.user.email;
  // console.log("User email:", email); // Log the email for debugging
  userModel
    .findOne({ email: email })
    .then((user) => {
      if (user) {
        // User found, send details
        // console.log("User found:", user); // Log user details for debugging
        res.status(200).json({
          message: "User Details",
          user: user,
        });
      } else {
        // User not found
        // console.log("User not found");
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      // Error occurred
      console.error("Error fetching user details:", err); // Log error for debugging
      res.status(500).json({ error: "Internal Server Error" });
    });
};

//checking age for safe browsing
export function checkAge(req, res) {
  const { age } = req.body;

  if (age < 18) {
    res.send("You are not eligible to register");
    // other code
  } else {
    res.send("You are eligible to register");
  }
}

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, "secret_key", (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated");
  }
};
let refreashTokens = [];

const refresh = (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) return res.status(401).json("You are not authenticated!");

  if (!refreashTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh Token Invalied!");
  }

  jwt.verify(refreshToken, "refresh_secret_key", (err, user) => {
    err && console.log(err);
    refreashTokens = refreashTokens.filter((token) => token !== refreshToken);

    const newA_token = generateAccessToken(user);
    const newR_token = generateRefreshToken(user);

    refreashTokens.push(newR_token);
    res.status(200).json({
      accessToken: newA_token,
      refreshToken: newR_token,
    });
  });
};

const showName = (req, res) => {
  console.log("auth work");
  if (req.user.id === req.params.id || req.user.isAdmin) {
    console.log("admin or user");
  }
  res.send("hellooo");
};

export function updateUser(req, re) {
  const { firstName, lastName, email, passwordHash, gender, age, address } =
    req.body;
}

export default {
  verify,
  refresh,
  showName,
  loginUser,
  userDetails,
  userDetailsByEmail,
};
