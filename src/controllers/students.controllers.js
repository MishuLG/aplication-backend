// 1. IMPORTAR EL MODELO ENROLLMENT (¡CRUCIAL!)
import { Student, Tutor, User, Section, Grade, SchoolYear, Enrollment } from "../models/Sequelize/index.js";

// --- OBTENER ESTUDIANTES ---
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { 
          model: Tutor,
          include: [{ model: User, attributes: ['first_name', 'last_name'] }] 
        },
        {
          model: Section,
          include: [
            { model: Grade, attributes: ['name_grade'] },
            { model: SchoolYear, attributes: ['name_period'] } 
          ]
        },
        // --- AJUSTE APLICADO: Incluir Enrollment para ver el estado ---
        {
            model: Enrollment,
            attributes: ['status'],
            // Ordenamos por ID descendente para que el frontend tome siempre la inscripción más reciente (la [0])
            limit: 1, 
            order: [['id_enrollment', 'DESC']]
        }
        // -------------------------------------------------------------
      ],
      order: [['last_name', 'ASC']] 
    });
    res.json(students);
  } catch (error) {
    console.error("Error al listar estudiantes:", error);
    res.status(500).json({ message: "Error al obtener estudiantes" });
  }
};

// --- OBTENER ESTUDIANTE POR ID ---
export const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id, {
      include: [
        { model: Tutor, include: [User] },
        { model: Section, include: [Grade, SchoolYear] }
      ]
    });
    if (!student) return res.status(404).json({ message: "Estudiante no encontrado" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// --- CREAR ESTUDIANTE (CON AUTO-INSCRIPCIÓN) ---
export const createStudent = async (req, res) => {
  const { 
    id_tutor, id_section, id_school_year, 
    first_name, last_name, dni, date_of_birth, gender, address, enrollment_date 
  } = req.body;

  if (!id_tutor) return res.status(400).json({ message: "Es obligatorio asignar un Tutor." });

  try {
    if (dni) {
        const exists = await Student.findOne({ where: { dni } });
        if (exists) return res.status(409).json({ message: "Ya existe un estudiante con ese DNI." });
    }

    // 1. Crear el Estudiante
    const newStudent = await Student.create({
      id_tutor,
      id_section: id_section || null,
      id_school_year: id_school_year || null,
      first_name,
      last_name,
      dni,
      date_of_birth,
      gender,
      address,
      enrollment_date: enrollment_date || new Date(),
      status: 'active'
    });

    // 2. --- MAGIA AQUÍ: GENERAR PRE-INSCRIPCIÓN AUTOMÁTICA ---
    // Esto asegura que aparezca en "Validar Ingresos"
    if (id_section) {
        await Enrollment.create({
            id_student: newStudent.id_student,
            id_section: id_section,
            status: 'Pre-Inscrito', // Estado clave para la validación
            final_average: 0,
            observations: 'Ingreso Nuevo - Pendiente por Validar'
        });
    }
    // ---------------------------------------------------------

    res.status(201).json(newStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al inscribir estudiante", error: error.message });
  }
};

// --- ACTUALIZAR ESTUDIANTE ---
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: "No encontrado" });
    await student.update(req.body);
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar" });
  }
};

// --- ELIMINAR ESTUDIANTE ---
export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Student.destroy({ where: { id_student: id } });
    if (!deleted) return res.status(404).json({ message: "No encontrado" });
    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "No se puede eliminar (Tiene registros asociados)" });
  }
};