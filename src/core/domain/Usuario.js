const bcrypt = require('bcryptjs');

class Usuario {
  constructor({ id = null, dni, nombres, apellidos, correo, celular = null, contrasena, rol = 'paciente' }, validar = true) {
    this.id = id;
    this.dni = dni;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.correo = correo;
    this.celular = celular;
    this._contrasena = contrasena;
    this.contrasena = null;
    this.rol = rol;
    this.creadoEn = new Date();
    this.actualizadoEn = new Date();

    if (validar) {
      this.validar();
      this.hashearContrasena();
    }
  }

  validar() {
    const errores = [];

    if (!this.dni) errores.push('El DNI es obligatorio');
    if (!this.nombres) errores.push('Los nombres son obligatorios');
    if (!this.apellidos) errores.push('Los apellidos son obligatorios');
    if (!this.correo) errores.push('El correo es obligatorio');
    if (!this._contrasena) errores.push('La contrasena es obligatoria');

    if (this.dni && !/^\d{8}$/.test(this.dni)) {
      errores.push('El DNI debe tener 8 dígitos');
    }

    if (this.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo)) {
      errores.push('Formato de correo inválido');
    }

    if (this._contrasena && this._contrasena.length < 8) {
      errores.push('La contrasena debe tener al menos 8 caracteres');
    }

    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(', ')}`);
    }
  }

  hashearContrasena() {
    if (this._contrasena) {
      this.contrasena = bcrypt.hashSync(this._contrasena, 10);
    }
  }

  compararContrasena(contrasenaPlana) {
    return bcrypt.compareSync(contrasenaPlana, this.contrasena);
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
