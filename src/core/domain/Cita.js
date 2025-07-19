// src/core/domain/Cita.js

class Cita {
  constructor({
    id = null,
    usuarioId,
    especialidadId,
    fecha,
    hora, // ✅ Campo agregado
    estado = 'pendiente',
    motivoPostergacion = null,
    creadoEn = new Date(),
    actualizadoEn = new Date()
  }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.especialidadId = especialidadId;
    this.fecha = fecha;
    this.hora = hora; // ✅ Asignación
    this.estado = estado;
    this.motivoPostergacion = motivoPostergacion;
    this.creadoEn = creadoEn;
    this.actualizadoEn = actualizadoEn;

    this.validar();
  }

  validar() {
    const errores = [];

    if (!this.usuarioId) errores.push('El ID de usuario es obligatorio');
    if (!this.especialidadId) errores.push('El ID de especialidad es obligatorio');
    if (!this.fecha) errores.push('La fecha es obligatoria');
    if (!this.hora) errores.push('La hora es obligatoria');

    const estadosPermitidos = ['pendiente', 'confirmada', 'cancelada', 'en_revision', 'completada'];
    if (this.estado && !estadosPermitidos.includes(this.estado)) {
      errores.push(`Estado '${this.estado}' no es válido`);
    }

    if (errores.length > 0) {
      throw new Error(errores.join(', '));
    }
  }

  puedeSerCancelada() {
    return ['pendiente', 'confirmada'].includes(this.estado);
  }

  solicitarPostergacion(motivo) {
    this.estado = 'en_revision';
    this.motivoPostergacion = motivo;
    this.actualizadoEn = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      usuarioId: this.usuarioId,
      especialidadId: this.especialidadId,
      fecha: this.fecha,
      hora: this.hora, // ✅ Exportación
      estado: this.estado,
      motivoPostergacion: this.motivoPostergacion,
      creadoEn: this.creadoEn,
      actualizadoEn: this.actualizadoEn
    };
  }
}

module.exports = Cita;
