const express = require("express");
const UserCollection = require("../Schemas/Users");

const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "qwertyuiop";

// user register route
router.post(
  "/userregister",
  [
    body("name", "Enter name").exists(),
    body("phone", "Enter valid phone number").isLength({min:10,max:10}),
    body("otp", "Enter otp").exists(),
    body("password", "Enter password").exists(),
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ sucess: sucess, field:true, msg: errors.array() });
    }

    try {
        let user = await UserCollection.findOne({ phone: req.body.phone });
        //check phone number already exist or not
      if (user) {
        return res.status(400).json({
          sucess: sucess,
          msg: "phone number already registered",
        });
      }

      //converting password to encrypted text
      const salt = await bcrypt.genSalt(10);
      secpass = await bcrypt.hash(req.body.password, salt);

      //creating ney user
      user = await UserCollection.create({
        name: req.body.name,
        password: secpass,
        phone: req.body.phone,
        otp: req.body.otp,
      });

      const data = {
        user: {
          id: user.id,
        },
        };
        //generating token 
      const authtoken = jwt.sign(data, JWT_SECRET);
      sucess = true;
      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
        res.status(500).send({ sucess: false, msg: "some error occured" });
    }
  }
);


// user login route
router.post(
  "/userlogin",
  [
   body("phone", "Enter phone number").exists(),
    body("password", "Enter password").exists(),
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await UserCollection.findOne({ phone:req.body.phone });
      if (!user) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, msg: "phone number is not registered" });
        }
        //comparing password
        const passcompare = await bcrypt.compare(req.body.password, user.password);

        //if password not matched
      if (!passcompare) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, msg: "incorrect password" });
        }
        
      const data = {
        user: {
          id: user.id,
        },
        };
        
         //generating token 
      const authtoken = jwt.sign(data, JWT_SECRET);
      sucess = true;

      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ sucess: false, msg: "some error occured" });
    }
  }
);

module.exports = router;
