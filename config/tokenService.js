// tokenService.js
const { v4: uuidv4 } = require("uuid");

// Genera un token de verificación único
exports.generateVerificationToken = () => {
  return uuidv4();
};
