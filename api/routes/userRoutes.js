const express = require("express");
const router = express.Router();
const validToken = require("../../midddleware/validToken");
const auth = require("../../midddleware/auth");
const meCtrl = require("../../controllers/userctrl/me");


// Ruta para obtener información del usuario autenticado
router.get("/users/current", validToken, auth, meCtrl);

module.exports = router;