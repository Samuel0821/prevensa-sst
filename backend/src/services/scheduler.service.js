
// backend/src/services/scheduler.service.js
const cron = require('node-cron');
const db = require('../config/db');
const NotificationService = require('./notification.service');
const UserModel = require('../models/user.model');

/**
 * Inicia un trabajo programado que se ejecuta todos los días a las 9:00 AM.
 * Este trabajo busca capacitaciones que venzan en exactamente 7 días
 * y envía una notificación push de recordatorio a los usuarios afectados.
 */
const startTrainingReminderScheduler = () => {
  // Se ejecuta cada día a las 9:00 AM (en la zona horaria del servidor)
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰ Ejecutando el trabajo programado: Verificador de vencimiento de capacitaciones...');

    try {
      // 1. Calcular la fecha objetivo (hoy + 7 días)
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 7);
      const targetDateString = targetDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD

      // 2. Buscar en la BD las capacitaciones de usuario que vencen en la fecha objetivo
      const trainingsToRemind = db.prepare(`
        SELECT ut.user_id, t.name as training_name
        FROM user_trainings ut
        JOIN trainings t ON ut.training_id = t.id
        WHERE ut.due_date = ?
      `).all(targetDateString);

      if (trainingsToRemind.length === 0) {
        console.log('No hay capacitaciones por vencer en 7 días. Trabajo finalizado.');
        return;
      }

      console.log(`Encontradas ${trainingsToRemind.length} capacitaciones para recordar.`);

      // 3. Agrupar por usuario para no enviar múltiples notificaciones al mismo usuario
      const remindersByUser = {};
      for (const training of trainingsToRemind) {
        if (!remindersByUser[training.user_id]) {
          remindersByUser[training.user_id] = [];
        }
        remindersByUser[training.user_id].push(training.training_name);
      }

      // 4. Enviar las notificaciones
      for (const userId in remindersByUser) {
        const user = UserModel.findById(userId);
        if (user && user.fcm_token) { // Asegurarse de que el usuario existe y tiene token
          const trainingNames = remindersByUser[userId].join(', ');
          const notificationTitle = 'Recordatorio de Capacitación';
          const notificationBody = `Atención: Tu(s) capacitación(es) "${trainingNames}" está(n) por vencer en 7 días.`;
          
          await NotificationService.sendNotification(
            [userId], // El servicio espera un array de IDs
            notificationTitle,
            notificationBody,
            { type: 'training_reminder' } // Datos para la redirección en la app móvil
          );

          console.log(`Notificación de recordatorio enviada al usuario con ID: ${userId}`);
        }
      }

    } catch (error) {
      console.error('Error durante la ejecución del trabajo programado de recordatorios:', error);
    }
  }, {
    scheduled: true,
    timezone: "America/Bogota" // Ajusta esto a la zona horaria de tu servidor/operación
  });

  console.log('✅ Servicio de recordatorio de capacitaciones iniciado. Se ejecutará todos los días a las 9:00 AM.');
};

module.exports = { startTrainingReminderScheduler };
