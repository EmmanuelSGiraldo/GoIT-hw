const User = require("../../schemas/user");
const { NotFound } = require("http-errors");

// Controlador para verificar el correo electrónico del usuario
const emailVerify = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    // Buscar al usuario por el token de verificación
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw new NotFound("User not found");
    }

    // Actualizar el estado de verificación del usuario
    user.verify = true;
    user.verificationToken = null; // Marcar el token como nulo después de la verificación
    await user.save();

    // Responder con éxito
    res.status(200).json({
      status: "success",
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};


module.exports = emailVerify;