import {
    getAllStudentsModel,
    getStudentByIdModel,
    createStudentModel,
    updateStudentByIdModel,
    deleteStudentByIdModel,
    checkDuplicateStudentModel 
} from '../models/students.model.js';

const getAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const getAllStudents = async (req, res) => {
    try {
        const students = await getAllStudentsModel();
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener estudiantes' });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const student = await getStudentByIdModel(req.params.id);
        if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el estudiante' });
    }
};

export const createStudent = async (req, res) => {
    const {
        first_name_student, last_name_student, date_of_birth_student,
        health_record, gender, street, city, zip_code,
        id_tutor, id_section, id_school_year
    } = req.body;

    if (!first_name_student || !last_name_student || !date_of_birth_student || !gender || !id_tutor || !id_section || !id_school_year) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    if (getAge(date_of_birth_student) < 3) {
        return res.status(400).json({ message: 'El estudiante debe tener al menos 3 años.' });
    }

    try {
        const isDuplicate = await checkDuplicateStudentModel(id_tutor, first_name_student, last_name_student, date_of_birth_student);
        if (isDuplicate) {
            return res.status(409).json({ message: 'Este estudiante ya está registrado con este tutor.' });
        }

        const student = await createStudentModel({
            first_name_student, last_name_student, date_of_birth_student,
            health_record, gender, street, city, zip_code,
            id_tutor, id_section, id_school_year
        });
        res.status(201).json(student);
    } catch (error) {
        console.error(error);
        if (error.code === '23503') return res.status(400).json({ message: 'El Tutor, Sección o Año Escolar seleccionado no existe.' });
        res.status(500).json({ message: 'Error al crear estudiante', error: error.message });
    }
};

export const updateStudentById = async (req, res) => {
    const { id } = req.params;
    const {
        first_name_student, last_name_student, date_of_birth_student,
        health_record, gender, street, city, zip_code,
        id_tutor, id_section, id_school_year
    } = req.body;

    if (!first_name_student || !last_name_student || !date_of_birth_student || !gender || !id_tutor || !id_section || !id_school_year) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    if (getAge(date_of_birth_student) < 3) {
        return res.status(400).json({ message: 'El estudiante debe tener al menos 3 años.' });
    }

    try {
        const isDuplicate = await checkDuplicateStudentModel(id_tutor, first_name_student, last_name_student, date_of_birth_student, id);
        if (isDuplicate) {
            return res.status(409).json({ message: 'Ya existe otro estudiante con estos datos.' });
        }

        const student = await updateStudentByIdModel(id, req.body);
        if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });
        res.json(student);
    } catch (error) {
        console.error(error);
        if (error.code === '23503') return res.status(400).json({ message: 'Datos referenciados no válidos.' });
        res.status(500).json({ message: 'Error al actualizar estudiante' });
    }
};

export const deleteStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await deleteStudentByIdModel(id);
        if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });
        res.json({ message: 'Estudiante eliminado correctamente' });
    } catch (error) {
        console.error(error);
        if (error.code === '23503') return res.status(409).json({ message: 'No se puede eliminar: El estudiante tiene registros asociados (Notas, Asistencia).' });
        res.status(500).json({ message: 'Error al eliminar estudiante' });
    }
};