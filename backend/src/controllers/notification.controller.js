
const UserModel = require('../models/user.model');

class NotificationController {

  /**
   * Registra o actualiza el token FCM de un usuario.
   */
  static async registerToken(req, res) {
    const { token } = req.body;
    const userId = req.user.id; // Asume que el ID del usuario está en req.user

    if (!token) {
      return res.status(400).json({ message: 'El token es obligatorio.' });
    }

    try {
      const success = await UserModel.updateFcmToken(userId, token);
      if (success) {
        res.status(200).json({ message: 'Token registrado correctamente.' });
      } else {
        res.status(404).json({ message: 'No se pudo encontrar al usuario para actualizar el token.' });
      }
    } catch (error) {
      console.error("Error al registrar el token FCM:", error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}

module.exports = NotificationController;
