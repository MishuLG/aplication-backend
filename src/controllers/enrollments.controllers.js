// AGREGAMOS 'Evaluation' y 'Subject' A LOS IMPORTS PARA EL CÁLCULO
import { Enrollment, Student, Section, Grade, SchoolYear, Evaluation, Subject } from "../models/Sequelize/index.js";

// --- OBTENER TODAS LAS INSCRIPCIONES (CON CÁLCULO DE PROMEDIO EN VIVO) ---
export const getAllEnrollments = async (req, res) => {
    try {
        // 1. Traer todas las inscripciones con sus datos relacionados
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

        // 2. Traer TODAS las evaluaciones del sistema (para cruzar datos y calcular)
        const allEvaluations = await Evaluation.findAll({
            include: [{ model: Subject }]
        });

        // 3. Procesar: Calcular promedio real para cada estudiante "al vuelo"
        const data = enrollments.map(enr => {
            const e = enr.toJSON(); // Convertir instancia Sequelize a objeto plano JSON
            
            // a) Filtrar notas de este estudiante específico
            const studentGrades = allEvaluations.filter(ev => ev.id_student === e.id_student);

            // b) Calcular Promedio (Misma lógica matemática del PDF)
            let calculatedAvg = "0.00";
            
            if (studentGrades.length > 0) {
                const subjectsMap = {};
                // Agrupar notas por materia
                studentGrades.forEach(g => {
                    const sName = g.Subject?.name_subject || g.id_subject;
                    if(!subjectsMap[sName]) subjectsMap[sName] = { sum: 0, count: 0 };
                    subjectsMap[sName].sum += parseFloat(g.score);
                    subjectsMap[sName].count++;
                });

                // Promedio de promedios (Suma de promedios de materias / Cantidad de materias)
                let sumAvgs = 0; 
                let numSubj = 0;
                Object.values(subjectsMap).forEach(s => {
                    sumAvgs += (s.sum / s.count);
                    numSubj++;
                });
                
                if (numSubj > 0) calculatedAvg = (sumAvgs / numSubj).toFixed(2);
            }

            // c) Sobrescribir 'final_average' con el cálculo fresco, ignorando el 0.00 de la BD
            return { 
                ...e, 
                final_average: calculatedAvg 
            };
        });

        res.json(data);
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