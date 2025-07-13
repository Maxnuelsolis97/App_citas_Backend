const Cita = require('../domain/Cita');

class CitaService {
  constructor(citaRepository) {
    this.citaRepository = citaRepository;
  }

  async obtenerCitas() {
    const citas = await this.citaRepository.obtenerTodas();
    return citas.map(cita => new Cita(cita));
  }

  async crearCita(datos) {
    const cita = new Cita(datos);
    return await this.citaRepository.guardar(cita);
  }

  async cancelarCita(id) {
    if (!id) throw new Error('El ID de cita es obligatorio');
    
    const citaExistente = await this.citaRepository.buscarPorId(id);
    if (!citaExistente) throw new Error('Cita no encontrada');
    
    const cita = new Cita(citaExistente);
    if (!cita.puedeSerCancelada()) {
      throw new Error('La cita no puede cancelarse en su estado actual');
    }

    return await this.citaRepository.actualizar(
      cita.id, 
      { estado: 'cancelada', actualizadoEn: new Date() }
    );
  }

  async solicitarPostergacion(id, motivo) {
    const citaExistente = await this.citaRepository.buscarPorId(id);
    if (!citaExistente) throw new Error('Cita no encontrada');
    
    const cita = new Cita(citaExistente);
    cita.solicitarPostergacion(motivo);
    
    return await this.citaRepository.actualizar(
      cita.id, 
      { 
        estado: cita.estado,
        motivoPostergacion: cita.motivoPostergacion,
        actualizadoEn: cita.actualizadoEn
      }
    );
  }
}

module.exports = CitaService;