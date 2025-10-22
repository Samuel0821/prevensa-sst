
const admin = require("../config/firebase");
const UserModel = require("../models/user.model");

class NotificationService {

  /**
   * Envía una notificación a un grupo de usuarios.
   * @param {number[]} userIds - Array con los IDs de los usuarios a notificar.
   * @param {string} title - El título de la notificación.
   * @param {string} body - El cuerpo (mensaje) de la notificación.
   * @param {object} [data={}] - Datos adicionales para enviar en la notificación.
   */
  static async sendNotification(userIds, title, body, data = {}) {
    // 1. Obtener los tokens FCM de los usuarios
    const tokens = [];
    for (const userId of userIds) {
      const user = UserModel.findById(userId);
      if (user && user.fcm_token) {
        tokens.push(user.fcm_token);
      }
    }

    if (tokens.length === 0) {
      console.log("No hay tokens FCM válidos para enviar la notificación.");
      return;
    }

    // 2. Construir el mensaje
    const message = {
      notification: {
        title,
        body,
      },
      data,
      tokens: tokens, // Enviar a múltiples dispositivos
    };

    // 3. Enviar el mensaje
    try {
      const response = await admin.messaging().sendMulticast(message);
      console.log("Notificaciones enviadas con éxito:", response.successCount);
      if (response.failureCount > 0) {
        console.log("Fallaron algunas notificaciones:", response.failureCount);
        // Aquí se podría añadir lógica para manejar los tokens que fallaron
      }
    } catch (error) {
      console.error("Error al enviar notificaciones:", error);
    }
  }
}

module.exports = NotificationService;
