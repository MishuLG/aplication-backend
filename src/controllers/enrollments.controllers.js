import { Enrollment, Student, Section, Grade, SchoolYear } from "../models/Sequelize/index.js";

// --- OBTENER TODAS LAS INSCRIPCIONES ---
export const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll({
            include: [
                { 
                    model: Student, 
                    attributes: ['id_student', 'first_name', 'last_name', 'dni'] 
                },
                { 
                    model: Section,
                    attributes: ['id_section', 'num_section'],
                    include: [
                        { model: Grade, attributes: ['name_grade'] },
                        { model: SchoolYear, attributes: ['name_period'] }
                    ]
                }
            ],
            order: [['id_enrollment', 'DESC']]
        });
        res.json(enrollments);
    } catch (error) {
        console.error("Error al obtener inscripciones:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// --- OBTENER UNA POR ID ---
export const getEnrollmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const enrollment = await Enrollment.findByPk(id, {
            include: [{ model: Student }, { model: Section }]
        });
        if (!enrollment) return res.status(404).json({ message: 'Inscripción no encontrada' });
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ message: "Error del servidor" });
    }
};

// --- CREAR INSCRIPCIÓN ---
export const createEnrollment = async (req, res) => {
    const { id_student, id_section, status, final_average, observations } = req.body;
    
    try {
        // Verificar si ya está inscrito en esa sección
        const exists = await Enrollment.findOne({ where: { id_student, id_section } });
        if (exists) return res.status(409).json({ message: "El estudiante ya está inscrito en esta sección." });

        const newEnrollment = await Enrollment.create({
            id_student,
            id_section,
            status: status || 'Cursando',
            final_average: final_average || 0,
            observations
        });
        res.status(201).json(newEnrollment);
    } catch (error) {
        res.status(500).json({ message: "Error al inscribir", error: error.message });
    }
};

// --- ACTUALIZAR ---
export const updateEnrollmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const enrollment = await Enrollment.findByPk(id);
        if (!enrollment) return res.status(404).json({ message: 'Inscripción no encontrada' });

        await enrollment.update(req.body);
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar" });
    }
};

// --- ELIMINAR ---
export const deleteEnrollmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Enrollment.destroy({ where: { id_enrollment: id } });
        if (deleted) res.json({ message: 'Inscripción eliminada' });
        else res.status(404).json({ message: 'No encontrada' });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar" });
    }
};