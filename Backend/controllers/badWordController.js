import { application, response } from "express";
import BadWordModel from "../models/BadWordsModel.js";
import { myPromises } from "../controllers/myPromise.js";

//show all list of B words

const index = (req, res, next) => {
  BadWordModel.find()
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((err) => {
      res.json({
        messsage: "An Error occured!",
      });
    });
};

// const deletebadword = (req, res) => {
//   BadWordModel.findByIdAndDelete(req.params.id)
//     .then(() => res.json())
//     .catch((err) => res.json(err));
// };

const store = (req, res) => {
  const name = req.body.params.name;
  const textToTranslate = req.body.params.textToTranslate;

  console.log("Logging" + name);
  console.log("Logging" + textToTranslate);

  if (!name || !textToTranslate) {
    return res.status(400).json({
      message: "Name and textToTranslate must be provided.",
    });
  }

  let badPhase = new BadWordModel({
    userID: name,
    badPhase: textToTranslate,
  });

  badPhase
    .save()
    .then((response) => {
      console.log("first" + response);
      if (response) {
        res.json({
          message: "Bad", // Sending "Bad" message only after successful insertion
        });
      } else {
        res.json({
          message: "An error occurred while saving the bad word.",
        });
      }
    })
    .catch((err) => {
      console.error("Error saving bad word:", err);
      res.json({
        message: "An error occurred!",
      });
    });
};

//detect B word

const checkBword = (req, res, next) => {
  const phase = req.body.params.textToTranslate;

  console.log("Checkiiiing" + req.body);

  myPromises(phase)
    .then((result) => {
      console.log(result);
      if (result.hasBadWords) {
        next();
      } else res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send("error occured!");
    });
};
const remove = (req, res) => {
  BadWordModel.findByIdAndDelete(req.params.id)
    .then((history) => res.json(history))
    .catch((err) => res.json(err));
};

// const deletebadword = (req, res) => {
//   BadWordModel.findByIdAndDelete(req.params.id)
//     .then((badword) => res.json(badword))
//     .catch((err) => res.json(err));
// };

const getAllBWordsById = (req, res) => {
  // const id = req.body.params.id;
  const id = req.query.user || req.body.params?.id;

  if (!id) {
    return res.status(403).json({
      message: "User not found Login!",
    });
  }

  try {
    BadWordModel.find({ userID: id })
      .sort({ createdAt: -1 })
      .then((response) => {
        console.log("first");
        res.json({
          response,
        });
      })
      .catch(() => {
        console.log("Error");
        res.json({
          message: "error ocured deleting!",
        });
      });
  } catch (error) {
    console.log(error);
  }
};
const clearAllData = (req, res) => {
  BadWordModel.deleteMany({})
    .then(() => res.json({ message: "All data cleared successfully" }))
    .catch((err) => res.status(500).json({ error: err.message }));
};

export default {
  index,
  store,
  checkBword,
  remove,
  getAllBWordsById,
  clearAllData,
};
