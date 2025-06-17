const connection = require('../../../database/mysql/db');
const solicitarPostergacion = async (req, res) => {
  const { cita_id, motivo } = req.body;

  // Validación mejorada
  if (!cita_id || !motivo) {
    return res.status(400).json({
      success: false,
      error: 'Validación fallida',
      detalles: {
        campos_faltantes: {
          cita_id: !cita_id ? 'El ID de cita es requerido' : 'OK',
          motivo: !motivo ? 'El motivo es requerido' : 'OK'
        }
      }
    });
  }

  // Validación de longitud del motivo (200 caracteres máximo)
  if (motivo.length > 200) {
    return res.status(400).json({
      success: false,
      error: 'El motivo no puede exceder los 200 caracteres',
      caracteres_enviados: motivo.length
    });
  }

  try {
    
    // Verificar que la cita existe y está en estado válido para postergación
    const [cita] = await connection.execute(
      `SELECT id, estado FROM citas 
       WHERE id = ? 
       AND estado IN ('pendiente', 'confirmada') 
       LIMIT 1`,
      [cita_id]
    );

    if (cita.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se puede solicitar postergación',
        detalles: 'La cita no existe o no está en estado postergable'
      });
    }

    // Iniciar transacción
    await connection.beginTransaction();

    try {
      // 1. Registrar la solicitud de postergación
      const [solicitudResult] = await connection.execute(
        `INSERT INTO solicitudes_postergacion 
         (cita_id, motivo, estado) 
         VALUES (?, ?, 'pendiente')`,
        [cita_id, motivo]
      );

      // 2. Actualizar estado de la cita (opcional, según tu lógica de negocio)
      await connection.execute(
        `UPDATE citas 
         SET estado = 'en_revision' 
         WHERE id = ?`,
        [cita_id]
      );

      // Confirmar transacción
      await connection.commit();

      // Respuesta exitosa
      res.status(201).json({
        success: true,
        mensaje: 'Solicitud de postergación registrada',
        data: {
          solicitud_id: solicitudResult.insertId,
          cita_id: cita_id,
          estado_actual: 'pendiente',
          fecha_solicitud: new Date().toISOString()
        }
      });

    } catch (transactionError) {
      // Revertir transacción en caso de error
      await connection.rollback();
      throw transactionError;
    }

  } catch (error) {
    console.error('Error en solicitarPostergacion:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud',
      ...(process.env.NODE_ENV === 'development' && {
        detalles: error.message,
        stack: error.stack
      })
    });
  }
};

const gestionarSolicitud = async (req, res) => {
  const solicitudId = req.params.id;
  const { accion, nueva_fecha } = req.body;

  if (!['aprobar', 'rechazar'].includes(accion)) {
    return res.status(400).json({ error: 'Acción inválida. Usa "aprobar" o "rechazar"' });
  }

  try {
    const [solicitudes] = await connection.execute(
      'SELECT cita_id FROM solicitudes_postergacion WHERE id = ? AND estado = "en revision"',
      [solicitudId]
    );

    if (solicitudes.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada o ya procesada' });
    }

    const citaId = solicitudes[0].cita_id;

    const conn = await connection.getConnection();
    await conn.beginTransaction();

    if (accion === 'aprobar') {
      if (!nueva_fecha) {
        return res.status(400).json({ error: 'Debes enviar la nueva fecha para aprobar' });
      }

      await conn.execute(
        'UPDATE citas SET fecha = ? WHERE id = ?',
        [nueva_fecha, citaId]
      );

      await conn.execute(
        'UPDATE solicitudes_postergacion SET estado = "aprobada" WHERE id = ?',
        [solicitudId]
      );
    } else {
      await conn.execute(
        'UPDATE solicitudes_postergacion SET estado = "rechazada" WHERE id = ?',
        [solicitudId]
      );
    }

    await conn.commit();
    conn.release();

    res.status(200).json({ mensaje: `Solicitud ${accion} correctamente` });

  } catch (error) {
    console.error('Error al gestionar solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { solicitarPostergacion, gestionarSolicitud}