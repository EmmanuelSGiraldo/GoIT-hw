
const User = require("../schemas/user");
require("dotenv").config()
// const secret = process.env.SECRET
// const passport = require("passport")
// const jwt = require("jsonwebtoken");


 const signupctrl =  async (req, res, next) => {
  const {username, email, password} = req.body;
  const user = await User.findOne({email});
  
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use ",
      data: "Conflict",
    });
  }
  try {
    const newUser = new User ({username, email})
    newUser.setPassword(password)
    await newUser.save()
  
    res.status(201).json({
      status: "success",
      code:201,
    data:{
      message:"registration successfull",
    }  })
  } catch (error) {
    next(error);
  }
  };


module.exports = signupctrl;