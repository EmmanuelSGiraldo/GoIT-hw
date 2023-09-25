const ContactModel = require("../../schemas/contacts");

const userAllContacts = async (req, res, next) => {
  try {
    const userId = req.user.id; // Obtener el ID del usuario autenticado

    // Obtener todos los contactos del usuario autenticado
    const userContacts = await ContactModel.find({ owner: userId });

    res.status(200).json(userContacts);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

module.exports = userAllContacts;
