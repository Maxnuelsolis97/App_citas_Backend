const bcrypt = require('bcryptjs');

class Usuario {
  constructor({ id = null, dni, nombres, apellidos, correo, celular = null, contraseña, rol = 'paciente' }, validar = true) {
    this.id = id;
    this.dni = dni;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.correo = correo;
    this.celular = celular;
    this._contraseña = contraseña; // contraseña en texto plano solo para registro
    this.contraseña = null; // aquí se guarda el hash
    this.rol = rol;
    this.creadoEn = new Date();
    this.actualizadoEn = new Date();

    if (validar) {
      this.validar();
      this.hashearContraseña(); // solo si estamos registrando
    }
  }

  validar() {
    const errores = [];

    if (!this.dni) errores.push('El DNI es obligatorio');
    if (!this.nombres) errores.push('Los nombres son obligatorios');
    if (!this.apellidos) errores.push('Los apellidos son obligatorios');
    if (!this.correo) errores.push('El correo es obligatorio');
    if (!this._contraseña) errores.push('La contraseña es obligatoria');

    if (this.dni && !/^\d{8}$/.test(this.dni)) {
      errores.push('El DNI debe tener 8 dígitos');
    }

    if (this.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo)) {
      errores.push('Formato de correo inválido');
    }

    if (this._contraseña && this._contraseña.length < 8) {
      errores.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(', ')}`);
    }
  }

  hashearContraseña() {
    if (this._contraseña) {
      this.contraseña = bcrypt.hashSync(this._contraseña, 10);
    }
  }

  compararContraseña(contraseñaPlana) {
    return bcrypt.compareSync(contraseñaPlana, this.contraseña);
  }

  esAdministrativo() {
    return this.rol === 'administrativo';
  }

  toJSON() {
    return {
      id: this.id,
      dni: this.dni,
      nombres: this.nombres,
      apellidos: this.apellidos,
      correo: this.correo,
      celular: this.celular,
      rol: this.rol,
      creadoEn: this.creadoEn,
      actualizadoEn: this.actualizadoEn
    };
  }
}

module.exports = Usuario;
