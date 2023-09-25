const express = require("express");
const router = express.Router();
const signupctrl = require("../controllers/signup");
const loginctrl = require("../controllers/login");
const meCtrl = require("../controllers/me");
const auth = require("../midddleware/auth");

const invalidatedTokens = new Set();

const validToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (invalidatedTokens.has(token)) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Unauthorized: Invalid token",
      data: "Unauthorized",
    });
  }
  next();
};


router.post("/signup", signupctrl);

router.post("/login", loginctrl);

router.get("/me", validToken, auth, meCtrl);

router.post("/logout", validToken, auth, (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  invalidatedTokens.add(token);
  console.log(Array.from(invalidatedTokens));
  res.status(204).json({
    status: "successs",
    code: 200,
    message: "Successfully logout",
    data: "Success",
  });
});

module.exports = router;
