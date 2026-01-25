import { ClassSchedule, Section, Subject, Grade } from "../models/Sequelize/index.js";

// --- OBTENER TODOS ---
export const getAllClassSchedules = async (req, res) => {
  try {
    const schedules = await ClassSchedule.findAll({
      include: [
        { 
            model: Section, 
            include: [{ model: Grade, attributes: ['name_grade'] }]
        },
        { model: Subject, attributes: ['name_subject'] }
      ],
      // Ajustamos el orden también por si acaso
      order: [['id_section', 'ASC'], ['day_of_week', 'ASC']]
    });
    res.json(schedules);
  } catch (error) {
    console.error("Error al obtener horarios:", error);
    res.status(500).json({ message: "Error al obtener horarios", error: error.message });
  }
};

export const getClassScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await ClassSchedule.findByPk(id, {
        include: [{ model: Section }, { model: Subject }]
    });
    if (!schedule) return res.status(404).json({ message: "Horario no encontrado" });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

export const createClassSchedule = async (req, res) => {
  try {
    const { id_section, id_subject, day_of_week, start_time, end_time } = req.body;
    const newSchedule = await ClassSchedule.create({
      id_section, id_subject, day_of_week, start_time, end_time
    });
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error al crear horario", error: error.message });
  }
};

export const updateClassSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await ClassSchedule.findByPk(id);
    if (!schedule) return res.status(404).json({ message: "Horario no encontrado" });
    await schedule.update(req.body);
    res.json({ message: "Horario actualizado", schedule });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar", error: error.message });
  }
};

// --- ELIMINAR (CORREGIDO EL NOMBRE DE LA COLUMNA) ---
export const deleteClassSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    // CORRECCIÓN AQUÍ: id_class_schedules
    const deleted = await ClassSchedule.destroy({ where: { id_class_schedules: id } });
    
    if (deleted) res.json({ message: "Horario eliminado correctamente" });
    else res.status(404).json({ message: "Horario no encontrado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar", error: error.message });
  }
};