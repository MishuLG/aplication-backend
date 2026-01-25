import { Section, Grade, SchoolYear, Subject, Enrollment, sequelize } from "../models/Sequelize/index.js";

// --- OBTENER TODAS LAS SECCIONES (Listado General) ---
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
        ['id_school_year', 'DESC'], // Primero lo más reciente
        ['id_grade', 'ASC'],        // Ordenado por grado
        ['num_section', 'ASC']      // Ordenado por letra (A, B...)
      ]
    });
    res.json(sections);
  } catch (error) {
    console.error("Error crítico obteniendo secciones:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

// --- OBTENER UNA SECCIÓN CON SU PENSUM (Lógica Fuerte) ---
export const getSectionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validación 1: El ID debe ser un número
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "El ID de la sección debe ser un número válido." });
    }

    const section = await Section.findByPk(id, {
      include: [
        { 
            model: Grade,
            // AQUÍ ESTÁ LA MAGIA: Traemos las materias (Subjects) asociadas a este Grado
            include: [{
                model: Subject,
                attributes: ['id_subject', 'name_subject'],
                through: { attributes: [] } // Omitimos datos de la tabla intermedia
            }]
        },      
        { model: SchoolYear }
      ]
    });

    // Validación 2: Existencia
    if (!section) {
        return res.status(404).json({ message: `No se encontró la sección con ID: ${id}` });
    }

    res.json(section);
  } catch (error) {
    console.error("Error al obtener detalle de sección:", error);
    res.status(500).json({ message: "Error interno", error: error.message });
  }
};

// --- CREAR SECCIÓN (Con validación de integridad) ---
export const createSection = async (req, res) => {
  const t = await sequelize.transaction(); // Usamos transacción por seguridad
  try {
    const { num_section, id_grade, id_school_year, capacity } = req.body;
    
    // Validación 1: Campos obligatorios
    if (!num_section || !id_grade || !id_school_year) {
        await t.rollback();
        return res.status(400).json({ message: "Faltan datos: Nombre, Grado y Año Escolar son obligatorios." });
    }

    // Validación 2: Verificar que el Grado y Año existan antes de intentar crear
    const gradeExists = await Grade.findByPk(id_grade);
    const yearExists = await SchoolYear.findByPk(id_school_year);

    if (!gradeExists || !yearExists) {
        await t.rollback();
        return res.status(400).json({ message: "El Grado o el Año Escolar seleccionados no existen en la base de datos." });
    }

    // Creación
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
    
    if (!id || isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const section = await Section.findByPk(id);
    
    if (!section) return res.status(404).json({ message: "Sección no encontrada" });

    await section.update(req.body);
    res.json({ message: "Sección actualizada correctamente", section });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar", error: error.message });
  }
};

// --- ELIMINAR SECCIÓN (Protegida) ---
export const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    // Validación de seguridad: No borrar si tiene alumnos
    const enrollmentsCount = await Enrollment.count({ where: { id_section: id } });
    
    if (enrollmentsCount > 0) {
        return res.status(400).json({ 
            message: `No se puede eliminar la sección. Tiene ${enrollmentsCount} estudiantes inscritos. Primero debe reubicarlos o eliminarlos.` 
        });
    }

    const deleted = await Section.destroy({ where: { id_section: id } });
    
    if (deleted) res.json({ message: "Sección eliminada correctamente" });
    else res.status(404).json({ message: "Sección no encontrada" });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar", error: error.message });
  }
};