const connection = require('../../../database/mysql/db');

const solicitarPostergacion = async (req, res) => {
  const { cita_id, motivo } = req.body;

  // Validación
  if (!cita_id || !motivo) {
    return res.status(400).json({
      success: false,
      error: 'Validación fallida',
      detalles: {
        cita_id: !cita_id ? 'El ID de cita es requerido' : 'OK',
        motivo: !motivo ? 'El motivo es requerido' : 'OK'
      }
    });
  }

  if (motivo.length > 200) {
    return res.status(400).json({
      success: false,
      error: 'El motivo no puede exceder los 200 caracteres',
      caracteres_enviados: motivo.length
    });
  }

  try {
    // Verificar existencia y estado de la cita
    const [cita] = await connection.execute(
      `SELECT id FROM citas 
       WHERE id = ? AND estado IN ('pendiente', 'confirmada') 
       LIMIT 1`,
      [cita_id]
    );

    if (cita.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'La cita no existe o no puede ser postergada'
      });
    }

    const conn = await connection.getConnection();
    await conn.beginTransaction();

    try {
      // Insertar solicitud
      const [solicitudResult] = await conn.execute(
        `INSERT INTO solicitudes_postergacion (cita_id, motivo, estado)
         VALUES (?, ?, 'pendiente')`,
        [cita_id, motivo]
      );

      // Actualizar estado de la cita
      await conn.execute(
        `UPDATE citas SET estado = 'en_revision' WHERE id = ?`,
        [cita_id]
      );

      await conn.commit();
      conn.release();

      return res.status(201).json({
        success: true,
        mensaje: 'Solicitud de postergación registrada',
        data: {
          solicitud_id: solicitudResult.insertId,
          cita_id,
          estado_actual: 'pendiente',
          fecha_solicitud: new Date().toISOString()
        }
      });

    } catch (transactionError) {
      await conn.rollback();
      conn.release();
      console.error('Error en transacción:', transactionError);
      return res.status(500).json({
        success: false,
        error: 'Error al registrar la solicitud'
      });
    }

  } catch (error) {
    console.error('Error en solicitarPostergacion:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
};

const gestionarSolicitud = async (req, res) => {
  const solicitudId = req.params.id;
  const { accion, nueva_fecha } = req.body;

  if (!['aprobar', 'rechazar'].includes(accion)) {
    return res.status(400).json({
      success: false,
      error: 'Acción inválida. Usa "aprobar" o "rechazar".'
    });
  }

  try {
    const [solicitudes] = await connection.execute(
      `SELECT cita_id FROM solicitudes_postergacion 
       WHERE id = ? AND estado = 'pendiente'`,
      [solicitudId]
    );

    if (solicitudes.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Solicitud no encontrada o ya procesada'
      });
    }

    const citaId = solicitudes[0].cita_id;
    const conn = await connection.getConnection();
    await conn.beginTransaction();

    try {
      if (accion === 'aprobar') {
        if (!nueva_fecha) {
          return res.status(400).json({ error: 'Debes enviar la nueva fecha para aprobar.' });
        }

        await conn.execute(
          `UPDATE citas SET fecha = ?, estado = 'confirmada' WHERE id = ?`,
          [nueva_fecha, citaId]
        );

        await conn.execute(
          `UPDATE solicitudes_postergacion SET estado = 'aprobada' WHERE id = ?`,
          [solicitudId]
        );

      } else {
        await conn.execute(
          `UPDATE solicitudes_postergacion SET estado = 'rechazada' WHERE id = ?`,
          [solicitudId]
        );
      }

      await conn.commit();
      conn.release();

      return res.status(200).json({
        success: true,
        mensaje: `Solicitud ${accion} correctamente`
      });

    } catch (transactionError) {
      await conn.rollback();
      conn.release();
      console.error('Error en transacción:', transactionError);
      return res.status(500).json({
        success: false,
        error: 'Error al procesar la solicitud'
      });
    }

  } catch (error) {
    console.error('Error en gestionarSolicitud:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
  
};

const listarSolicitudesPendientes = async (req, res) => {
  try {
    const [result] = await connection.execute(
      `SELECT id, cita_id, motivo, estado, fecha_solicitud 
       FROM solicitudes_postergacion 
       WHERE estado = 'pendiente' 
       ORDER BY fecha_solicitud DESC`
    );

    return res.status(200).json({
      success: true,
      total: result.length,
      solicitudes: result
    });

  } catch (error) {
    console.error('Error al listar solicitudes:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener las solicitudes pendientes'
    });
  }
};

const listarSolicitudesHistorial = async (req, res) => {
  try {
    const [result] = await connection.execute(
      `SELECT id, cita_id, motivo, estado, fecha_solicitud
       FROM solicitudes_postergacion
       WHERE estado IN ('aprobada', 'rechazada')
       ORDER BY fecha_solicitud DESC`
    );

    return res.status(200).json({
      success: true,
      total: result.length,
      solicitudes: result
    });
  } catch (error) {
    console.error('Error al listar historial de solicitudes:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener el historial de solicitudes'
    });
  }
};


module.exports = {
  solicitarPostergacion,
  gestionarSolicitud,
  listarSolicitudesPendientes,
  listarSolicitudesHistorial
};
