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

  console.log("Logging"+name)
  console.log("Logging"+textToTranslate)

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
      res.json({
        message: "post added successfully!",
      });
    })
    .catch((err) => {
      res.json({
        message: "An error occured!",
      });
    });
};

//detect B word

const checkBword = (req, res, next) => {
  const phase = req.body.params.textToTranslate;

  console.log("Checkiiiing" +req.body);

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
  const wordID = req.body.userID; // Make sure the property name is correct
  BadWordModel.findByIdAndDelete(wordID)
    .then(() => {
      res.status(200).json({
        message: "Post deleted successfully!",
      });
    })
    .catch((error) => {
      console.error("Error deleting post:", error);
      res.status(500).json({
        message: "An error occurred while deleting the post.",
      });
    });
};



// const deletebadword = (req, res) => {
//   BadWordModel.findByIdAndDelete(req.params.id)
//     .then((badword) => res.json(badword))
//     .catch((err) => res.json(err));
// };

const getAllBWordsById = (req, res) => {
    // const id = req.body.params.id;
    const id = req.query.user || req.body.params?.id;

    if(!id){
      return res.status(403).json({
        message: "User not found Login!",
      });
    }

    try {
      BadWordModel.find({userID: id}).sort({createdAt: -1})
      .then((response) => {      
        console.log("first")  
          res.json({
              response
          })
      }).catch(() => {
          console.log("Error")
          res.json({
            message: "error ocured deleting!",
          })
      });
    } catch (error) {
      console.log(error)
    }


}




export default {
  index,
  store,
  checkBword,
  remove,
  getAllBWordsById,
 
  
};
