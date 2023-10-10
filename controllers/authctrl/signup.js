// authController.js
const User = require("../../schemas/user");
const { Conflict, BadRequest } = require("http-errors");
const gravatar = require("gravatar");
const emailService = require("../../config/emailService");
const tokenService = require("../../config/tokenService");

// Controlador para registrar un nuevo usuario
const signupctrl = async (req, res, next) => {
  const { username, email, password, subscription } = req.body;

  try {
    // Verificar si el correo electrónico ya está en uso
    const user = await User.findOne({ email });

    if (user) {
      throw new Conflict("Email is already in use");
    }

    // Generar una URL de gravatar para el avatar
    const avatarURL = gravatar.url(email);

    // Generar un token de verificación único
    const verificationToken = tokenService.generateVerificationToken();

    // Crear un nuevo usuario
    const newUser = new User({
      username,
      email,
      subscription,
      avatarURL,
      verificationToken,
    });

    // Establecer la contraseña del usuario y guardarlo en la base de datos
    newUser.setPassword(password);
    await newUser.save();

    // Enviar un correo de verificación al usuario
    await emailService.sendVerificationEmail(email, verificationToken);

    // Respuesta exitosa
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        user: {
          username,
          email,
          avatarURL,
          verificationToken,
        },
      },
    });
  } catch (error) {
    // Manejo de errores
    if (error.name === "ValidationError") {
      return next(new BadRequest("Validation error"));
    }
    next(error);
  }
};

module.exports = signupctrl;
