// CORRECCIÓN: Agregamos 'Grade' a la lista de imports
import { sequelize, Student, Enrollment, Section, SchoolYear, Tutor, Grade } from "../models/Sequelize/index.js";

// --- OBTENER TODOS LOS ESTUDIANTES (CON FILTRO Y DATOS ACADÉMICOS) ---
export const getAllStudents = async (req, res) => {
  try {
    const { school_year } = req.query;

    const whereClause = school_year ? { id_school_year: school_year } : {};

    const students = await Student.findAll({
      where: whereClause,
      include: [
        { 
          model: Section,
          // Aquí es donde daba el error antes porque Grade no estaba importado
          include: [{ model: Grade, attributes: ['name_grade'] }] 
        },
        { model: SchoolYear, attributes: ['name_period'] }
      ],
      order: [['last_name', 'ASC']]
    });

    const formattedStudents = students.map(student => {
      const s = student.toJSON();
      return {
        ...s,
        first_name_student: s.first_name,
        last_name_student: s.last_name,
        date_of_birth_student: s.date_of_birth,
        
        grade_name: s.Section?.Grade?.name_grade || 'Sin Asignar',
        section_name: s.Section ? `Sección ${s.Section.num_section}` : 'N/A',
        period_name: s.SchoolYear?.name_period || 'Periodo Desconocido'
      };
    });

    res.json(formattedStudents);
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    res.status(500).json({ message: "Error al obtener estudiantes", error: error.message });
  }
};

// --- OBTENER UN ESTUDIANTE POR ID ---
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id, {
        include: [{ model: Section }, { model: SchoolYear }]
    });
    if (!student) return res.status(404).json({ message: "Estudiante no encontrado" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

// --- CREAR ESTUDIANTE ---
export const createStudent = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { 
        first_name_student, last_name_student, date_of_birth_student,
        id_tutor, id_section, id_school_year, 
        gender, street, city, zip_code, health_record 
    } = req.body;

    const newStudent = await Student.create({
        first_name: first_name_student,
        last_name: last_name_student,
        date_of_birth: date_of_birth_student,
        id_tutor,
        id_section,
        id_school_year,
        gender, street, city, zip_code, health_record
    }, { transaction: t });

    if (id_section && id_school_year) {
        await Enrollment.create({
            id_student: newStudent.id_student,
            id_section: id_section,
            status: 'Cursando',
            observations: 'Inscripción inicial'
        }, { transaction: t });
    }

    await t.commit();
    res.status(201).json(newStudent);
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Error al crear estudiante", error: error.message });
  }
};

// --- ACTUALIZAR ESTUDIANTE ---
export const updateStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
        first_name_student, last_name_student, date_of_birth_student,
        id_tutor, id_section, id_school_year, 
        gender, street, city, zip_code, health_record 
    } = req.body;

    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: "Estudiante no encontrado" });

    await student.update({
        first_name: first_name_student,
        last_name: last_name_student,
        date_of_birth: date_of_birth_student,
        id_tutor,
        id_section,
        id_school_year,
        gender, street, city, zip_code, health_record
    });

    res.json({ message: "Estudiante actualizado", student });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar", error: error.message });
  }
};

// --- ELIMINAR ESTUDIANTE ---
export const deleteStudentById = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    
    await Enrollment.destroy({ where: { id_student: id }, transaction: t });
    const deleted = await Student.destroy({ where: { id_student: id }, transaction: t });
    
    if (deleted) {
        await t.commit();
        res.json({ message: "Estudiante eliminado correctamente" });
    } else {
        await t.rollback();
        res.status(404).json({ message: "Estudiante no encontrado" });
    }
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Error al eliminar", error: error.message });
  }
};