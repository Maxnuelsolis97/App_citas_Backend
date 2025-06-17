// src/core/domain/Especialidad.js
class Especialidad {
  constructor({ 
    id = null, 
    nombre, 
    descripcion = '', 
    duracionCitaMinutos = 30,
    activa = true,
    creadoEn = new Date(),
    actualizadoEn = new Date()
  }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.duracionCitaMinutos = duracionCitaMinutos;
    this.activa = activa;
    this.creadoEn = creadoEn;
    this.actualizadoEn = actualizadoEn;
    
    this.validar();
  }

  validar() {
    const errores = [];
    
    if (!this.nombre) errores.push('El nombre es obligatorio');
    if (this.nombre && this.nombre.length < 3) {
      errores.push('El nombre debe tener al menos 3 caracteres');
    }
    if (this.duracionCitaMinutos && this.duracionCitaMinutos < 15) {
      errores.push('La duración mínima de cita es 15 minutos');
    }

    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(', ')}`);
    }
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      duracionCitaMinutos: this.duracionCitaMinutos,
      activa: this.activa,
      creadoEn: this.creadoEn,
      actualizadoEn: this.actualizadoEn
    };
  }
}

module.exports = Especialidad;