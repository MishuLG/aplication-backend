import { SchoolYear } from "../models/Sequelize/index.js"; 
// 1. IMPORTAMOS LA CALCULADORA VENEZOLANA
import { calculateSchoolDays } from "../utils/venezuelaCalendar.js"; 

// --- OBTENER TODOS LOS AÑOS ---
export const getAllSchoolYears = async (req, res) => {
  try {
    const schoolYears = await SchoolYear.findAll({
      order: [['start_year', 'DESC']]
    });
    res.json(schoolYears);
  } catch (error) {
    console.error("Error al obtener años escolares:", error);
    res.status(500).json({ message: "Error al obtener años escolares", error: error.message });
  }
};

// --- OBTENER UN AÑO POR ID ---
export const getSchoolYearById = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolYear = await SchoolYear.findByPk(id);
    
    if (!schoolYear) {
      return res.status(404).json({ message: "Año escolar no encontrado" });
    }
    res.json(schoolYear);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

// --- CREAR AÑO ESCOLAR (MANUAL) ---
export const createSchoolYear = async (req, res) => {
  try {
    const { school_grade, name_period, start_year, end_of_year, school_year_status } = req.body;

    const finalName = name_period || school_grade;

    // 2. MAGIA AUTOMÁTICA: Calculamos los días antes de guardar
    const calendarData = calculateSchoolDays(start_year, end_of_year);

    const newSchoolYear = await SchoolYear.create({
      name_period: finalName,
      start_year,
      end_of_year,
      school_year_status: school_year_status === 'active' || school_year_status === true ? 'Activo' : 'Cerrado',
      // Guardamos los datos calculados
      number_of_school_days: calendarData.schoolDays,
      scheduled_vacation: `Aprox. ${calendarData.vacationDays} días hábiles`,
      special_events: calendarData.specialEvents
    });

    res.status(201).json(newSchoolYear);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el año escolar", error: error.message });
  }
};

// --- ACTUALIZAR AÑO (MANUAL) ---
export const updateSchoolYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { school_grade, name_period, start_year, end_of_year, school_year_status } = req.body;

    const schoolYear = await SchoolYear.findByPk(id);
    if (!schoolYear) {
      return res.status(404).json({ message: "Año escolar no encontrado" });
    }

    const finalName = name_period || school_grade;

    // 3. RE-CÁLCULO: Si cambian las fechas, recalculamos los eventos
    // (Esto arreglará tus años viejos vacíos al editarlos)
    let updateData = {
      name_period: finalName,
      start_year,
      end_of_year,
      school_year_status: school_year_status === 'active' || school_year_status === true ? 'Activo' : 'Cerrado'
    };

    // Si enviaron fechas, recalculamos la agenda
    if (start_year && end_of_year) {
        const calendarData = calculateSchoolDays(start_year, end_of_year);
        updateData.number_of_school_days = calendarData.schoolDays;
        updateData.scheduled_vacation = `Aprox. ${calendarData.vacationDays} días hábiles`;
        updateData.special_events = calendarData.specialEvents;
    }

    await schoolYear.update(updateData);

    res.json({ message: "Año escolar actualizado y recalculado", data: schoolYear });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar", error: error.message });
  }
};

// --- ELIMINAR AÑO ---
export const deleteSchoolYear = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SchoolYear.destroy({
      where: { id_school_year: id }
    });

    if (deleted) {
      res.json({ message: "Año escolar eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Año escolar no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar", error: error.message });
  }
};