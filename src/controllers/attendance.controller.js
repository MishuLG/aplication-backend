import {
    getAllAttendanceModel,
    getAttendanceByIdModel,
    createAttendanceModel,
    updateAttendanceByIdModel,
    deleteAttendanceByIdModel
} from '../models/attendance.model.js';


export const getAllAttendance = async (req, res) => {
    try {
        const attendance = await getAllAttendanceModel();
        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching attendance records' });
    }
};


export const getAttendanceById = async (req, res) => {
    const { id } = req.params;
    try {
        const attendance = await getAttendanceByIdModel(id);
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching attendance record' });
    }
};


export const createAttendance = async (req, res) => {
    const { id_student, id_section, attendance_date, status, comments } = req.body;

   
    if (!id_student || !id_section || !attendance_date || !status) {
        return res.status(400).json({ message: 'id_student, id_section, attendance_date, and status are required' });
    }

    try {
        const attendance = await createAttendanceModel({
            id_student,
            id_section,
            attendance_date,
            status,
            comments
        });
        res.status(201).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating attendance record' });
    }
};


export const updateAttendanceById = async (req, res) => {
    const { id } = req.params;
    const { id_student, id_section, attendance_date, status, comments } = req.body;

    try {
        const attendance = await updateAttendanceByIdModel(id, {
            id_student,
            id_section,
            attendance_date,
            status,
            comments
        });
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating attendance record' });
    }
};


export const deleteAttendanceById = async (req, res) => {
    const { id } = req.params;

    try {
        const attendance = await deleteAttendanceByIdModel(id);
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.json({ message: 'Attendance record deleted successfully', attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting attendance record' });
    }
};
