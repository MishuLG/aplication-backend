import { Section, Grade, SchoolYear, Subject, Enrollment, sequelize } from "../models/Sequelize/index.js";

// --- OBTENER TODAS LAS SECCIONES ---
export const getAllSections = async (req, res) => {
  try {
    const sections = await Section.findAll({
      include: [
        { 
            model: Grade, 
            attributes: ['id_grade', 'name_grade'] 
        },
        { 
            model: SchoolYear, 
            attributes: ['id_school_year', 'name_period', 'school_year_status'] 
        }
      ],
      order: [
        ['id_school_year', 'DESC'], 
        ['id_grade', 'ASC'],        
        ['num_section', 'ASC']      
      ]
    });
    res.json(sections);
  } catch (error) {
    console.error("Error crítico obteniendo secciones:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

// --- OBTENER UNA SECCIÓN POR ID ---
export const getSectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await Section.findByPk(id, {
      include: [
        { 
            model: Grade,
            include: [{
                model: Subject,
                attributes: ['id_subject', 'name_subject'],
                through: { attributes: [] } 
            }]
        },      
        { model: SchoolYear }
      ]
    });

    if (!section) return res.status(404).json({ message: "Sección no encontrada" });

    res.json(section);
  } catch (error) {
    res.status(500).json({ message: "Error interno", error: error.message });
  }
};

// --- CREAR SECCIÓN ---
export const createSection = async (req, res) => {
  const t = await sequelize.transaction(); 
  try {
    const { num_section, id_grade, id_school_year, capacity } = req.body;
    
    if (!num_section || !id_grade || !id_school_year) {
        await t.rollback();
        return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    const newSection = await Section.create({
      num_section,
      id_grade,
      id_school_year,
      capacity: capacity || 30
    }, { transaction: t });

    await t.commit();
    res.status(201).json(newSection);

  } catch (error) {
    await t.rollback();
    console.error("Error creando sección:", error);
    res.status(500).json({ message: "Error al crear la sección", error: error.message });
  }
};

// --- ACTUALIZAR SECCIÓN ---
export const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await Section.findByPk(id);
    
    if (!section) return res.status(404).json({ message: "Sección no encontrada" });

    await section.update(req.body);
    res.json({ message: "Actualizado correctamente", section });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar", error: error.message });
  }
};

// --- ELIMINAR SECCIÓN ---
export const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollmentsCount = await Enrollment.count({ where: { id_section: id } });
    
    if (enrollmentsCount > 0) {
        return res.status(400).json({ 
            message: `No se puede eliminar: Tiene ${enrollmentsCount} estudiantes inscritos.` 
        });
    }

    const deleted = await Section.destroy({ where: { id_section: id } });
    if (deleted) res.json({ message: "Sección eliminada correctamente" });
    else res.status(404).json({ message: "Sección no encontrada" });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar", error: error.message });
  }
};