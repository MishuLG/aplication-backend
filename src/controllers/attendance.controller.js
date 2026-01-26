import { Attendance, Student, Section, Grade } from '../models/Sequelize/index.js';

// --- OBTENER TODAS LAS ASISTENCIAS ---
export const getAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findAll({
            include: [
                { 
                    model: Student, 
                    attributes: ['id_student', 'first_name', 'last_name', 'dni'] 
                },
                { 
                    model: Section,
                    attributes: ['id_section', 'num_section'],
                    include: [{ model: Grade, attributes: ['name_grade'] }]
                }
            ],
            order: [['attendance_date', 'DESC']]
        });
        res.json(attendance);
    } catch (error) {
        console.error("Error al obtener asistencias:", error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

// --- OBTENER UNA POR ID ---
export const getAttendanceById = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Attendance.findByPk(id);
        if (!item) return res.status(404).json({ message: 'Registro no encontrado' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error interno' });
    }
};

// --- REGISTRAR ASISTENCIA ---
export const createAttendance = async (req, res) => {
    const { id_student, id_section, attendance_date, status, remarks } = req.body;

    // Validación básica
    if (!id_student || !id_section || !attendance_date || !status) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        // Verificar duplicados (Mismo estudiante, misma fecha)
        const exists = await Attendance.findOne({
            where: { id_student, attendance_date }
        });

        if (exists) {
            return res.status(409).json({ message: 'Este estudiante ya tiene asistencia registrada para esta fecha.' });
        }

        const newRecord = await Attendance.create({
            id_student,
            id_section,
            attendance_date,
            status, // 'Presente', 'Ausente', etc.
            observations: remarks // Mapeamos 'remarks' a 'observations' de la BD
        });

        res.status(201).json(newRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar asistencia', error: error.message });
    }
};

// --- ACTUALIZAR ---
export const updateAttendanceById = async (req, res) => {
    const { id } = req.params;
    const { status, remarks } = req.body;

    try {
        const record = await Attendance.findByPk(id);
        if (!record) return res.status(404).json({ message: 'Registro no encontrado' });

        await record.update({ 
            status, 
            observations: remarks 
        });
        
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar', error: error.message });
    }
};

// --- ELIMINAR ---
export const deleteAttendanceById = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Attendance.destroy({ where: { attendance_id: id } }); // Ojo: attendance_id es la PK en tu modelo
        if (deleted) res.json({ message: 'Eliminado correctamente' });
        else res.status(404).json({ message: 'Registro no encontrado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
};