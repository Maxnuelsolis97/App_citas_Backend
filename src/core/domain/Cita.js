// src/core/domain/Cita.js
class Cita {
  constructor({ 
    id = null, 
    usuarioId, 
    especialidadId, 
    fecha, 
    hora, 
    estado = 'pendiente',
    motivoPostergacion = null,
    creadoEn = new Date(),
    actualizadoEn = new Date()
  }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.especialidadId = especialidadId;
    this.fecha = fecha;
    this.hora = hora;
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
      errores.push(`Estado '${this.estado}' no permitido`);
    }
    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(', ')}`);
    }
  }
  puedeSerCancelada() {
    return ['pendiente', 'confirmada'].includes(this.estado);
  }

  puedeSerPostergada() {
    return ['pendiente', 'confirmada'].includes(this.estado);
  }
  solicitarPostergacion(motivo) {
    if (!this.puedeSerPostergada()) {
      throw new Error('La cita no puede ser postergada en su estado actual');
    }
    
    if (!motivo || motivo.length < 10) {
      throw new Error('El motivo debe tener al menos 10 caracteres');
    }
    
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
      hora: this.hora,
      estado: this.estado,
      motivoPostergacion: this.motivoPostergacion,
      creadoEn: this.creadoEn,
      actualizadoEn: this.actualizadoEn
    };
  }
}
module.exports = Cita;