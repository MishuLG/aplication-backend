import { Student, Tutor, User, Section, Grade, SchoolYear } from "../models/Sequelize/index.js";

// --- OBTENER ESTUDIANTES (Con datos de Tutor y Sección) ---
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
            // CORRECCIÓN AQUÍ: Usamos 'name_period' en lugar de 'period'
            { model: SchoolYear, attributes: ['name_period'] } 
          ]
        }
      ],
      order: [['last_name', 'ASC']] 
    });
    res.json(students);
  } catch (error) {
    console.error("Error al listar estudiantes:", error);
    res.status(500).json({ message: "Error al obtener estudiantes", error: error.message });
  }
};

// --- OBTENER ESTUDIANTE POR ID ---
export const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id, {
      include: [
        { model: Tutor, include: [User] },
        { 
          model: Section, 
          include: [Grade, SchoolYear] // Traemos todos los datos para el form de edición
        }
      ]
    });
    if (!student) return res.status(404).json({ message: "Estudiante no encontrado" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

// --- CREAR ESTUDIANTE ---
export const createStudent = async (req, res) => {
  const { 
    id_tutor, id_section, id_school_year, 
    first_name, last_name, dni, date_of_birth, gender, address, enrollment_date 
  } = req.body;

  if (!id_tutor) {
      return res.status(400).json({ message: "Es obligatorio asignar un Tutor/Representante." });
  }

  try {
    // Validar duplicados por DNI
    if (dni) {
        const exists = await Student.findOne({ where: { dni } });
        if (exists) return res.status(409).json({ message: "Ya existe un estudiante con ese DNI." });
    }

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
    if (!student) return res.status(404).json({ message: "Estudiante no encontrado" });

    await student.update(req.body);
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar", error: error.message });
  }
};

// --- ELIMINAR ESTUDIANTE ---
export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Student.destroy({ where: { id_student: id } });
    if (!deleted) return res.status(404).json({ message: "Estudiante no encontrado" });
    res.json({ message: "Estudiante eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "No se puede eliminar (Tiene notas o registros asociados)" });
  }
};