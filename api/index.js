const express = require("express");
const router = express.Router();
const signupctrl = require("../controllers/authctrl/signup");
const loginctrl = require("../controllers/authctrl/login");
const meCtrl = require("../controllers/authctrl/me");
const auth = require("../midddleware/auth");
const allContactsCtrl = require("../controllers/crudctrl/allContacts");
const contactForId = require("../controllers/crudctrl/contactForId");
const updateForId = require("../controllers/crudctrl/updateForId");
const addContact = require("../controllers/crudctrl/addContact");
const changeFavoriteId = require("../controllers/crudctrl/changeFavoriteId");
const deleteContact = require("../controllers/crudctrl/deleteContact");

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

// Ruta para registro de usuarios
router.post("/signup", signupctrl);

// Ruta para inicio de sesión
router.post("/login", loginctrl);

// Ruta para obtener información del usuario autenticado
router.get("/me", validToken, auth, meCtrl);

// Ruta para cerrar sesión y agregar el token a invalidatedTokens
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

// RUTAS DEL CRUD

// Ruta para obtener todos los contactos
router.get("/contacts", validToken, allContactsCtrl);

// Ruta para obtener un contacto por su ID
router.get("/contacts/:contactId", validToken, auth, contactForId);

// Ruta para actualizar un contacto por su ID
router.put("/contacts/:contactId", validToken, auth, updateForId);

// Ruta para agregar un nuevo contacto
router.post("/contacts", validToken, auth, addContact);

// // Ruta para cambiar favorito por id
// router.delete("/contacts/:contactId", validToken, auth, deleteContact);

// Ruta para actualizar el estado favorito de un contacto por su ID
router.patch(
  "/contacts/:contactId/favorite",
  validToken,
  auth,
  changeFavoriteId
);

// Ruta para Eliminar contacto por idgit status
router.delete("/contacts/:contactId", validToken, auth, deleteContact);

module.exports = router;
