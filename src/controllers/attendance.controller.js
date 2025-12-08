import {
    getAllAttendanceModel,
    getAttendanceByIdModel,
    createAttendanceModel,
    updateAttendanceByIdModel,
    deleteAttendanceByIdModel,
    checkDuplicateAttendanceModel
} from '../models/attendance.model.js';

const isFutureDate = (dateString) => {
    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    return inputDate > today; 
};

export const getAllAttendance = async (req, res) => {
    try {
        const attendance = await getAllAttendanceModel();
        res.json(attendance);
    } catch (error) {
        console.error("Error en getAllAttendance:", error);
        res.status(500).json({ message: 'Error al obtener registros', error: error.message });
    }
};

export const getAttendanceById = async (req, res) => {
    const { id } = req.params;
    try {
        const attendance = await getAttendanceByIdModel(id);
        if (!attendance) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json(attendance);
    } catch (error) {
        console.error("Error en getAttendanceById:", error);
        res.status(500).json({ message: 'Error al obtener registro' });
    }
};

export const createAttendance = async (req, res) => {
    const { id_student, id_section, attendance_date, status, remarks, comments } = req.body;
    const finalRemarks = remarks || comments;

    if (!id_student || !id_section || !attendance_date || !status) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    if (isFutureDate(attendance_date)) {
        return res.status(400).json({ message: 'No se puede registrar asistencia en una fecha futura.' });
    }

    try {
        const isDuplicate = await checkDuplicateAttendanceModel(id_student, attendance_date);
        if (isDuplicate) {
            return res.status(409).json({ message: 'El estudiante ya tiene asistencia registrada en esta fecha.' });
        }

        const attendance = await createAttendanceModel({
            id_student,
            id_section,
            attendance_date,
            status,
            remarks: finalRemarks
        });
        res.status(201).json(attendance);
    } catch (error) {
        console.error("Error en createAttendance:", error);
        if (error.code === '23503') {
             return res.status(400).json({ message: 'El Estudiante o la Sección especificados no existen.' });
        }
        res.status(500).json({ message: 'Error al crear registro', error: error.message });
    }
};

export const updateAttendanceById = async (req, res) => {
    const { id } = req.params;
    const { id_student, id_section, attendance_date, status, remarks, comments } = req.body;
    const finalRemarks = remarks || comments;

    if (!id_student || !id_section || !attendance_date || !status) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para la actualización.' });
    }

    if (isFutureDate(attendance_date)) {
        return res.status(400).json({ message: 'No se puede registrar asistencia en una fecha futura.' });
    }

    try {

        const isDuplicate = await checkDuplicateAttendanceModel(id_student, attendance_date, id);
        if (isDuplicate) {
            return res.status(409).json({ message: 'Ya existe OTRO registro con este estudiante y fecha.' });
        }

        const attendance = await updateAttendanceByIdModel(id, {
            id_student,
            id_section,
            attendance_date,
            status,
            remarks: finalRemarks
        });

        if (!attendance) {
            return res.status(404).json({ message: 'Registro no encontrado para actualizar.' });
        }
        res.json(attendance);
    } catch (error) {
        console.error("Error en updateAttendanceById:", error);
        if (error.code === '23503') {
             return res.status(400).json({ message: 'El Estudiante o la Sección especificados no existen.' });
        }
        res.status(500).json({ message: 'Error al actualizar registro', error: error.message });
    }
};

export const deleteAttendanceById = async (req, res) => {
    const { id } = req.params;
    try {
        const attendance = await deleteAttendanceByIdModel(id);
        if (!attendance) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Registro eliminado correctamente', attendance });
    } catch (error) {
        console.error("Error en deleteAttendanceById:", error);
        res.status(500).json({ message: 'Error al eliminar registro' });
    }
};