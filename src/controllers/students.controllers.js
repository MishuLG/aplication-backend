import {
    getAllStudentsModel,
    getStudentByIdModel,
    createStudentModel,
    updateStudentByIdModel,
    deleteStudentByIdModel
} from '../models/students.model.js';


export const getAllStudents = async (req, res) => {
    try {
        const students = await getAllStudentsModel();
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching students' });
    }
};


export const getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await getStudentByIdModel(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching student' });
    }
};


export const createStudent = async (req, res) => {
    try {
        const student = await createStudentModel(req.body);
        res.status(201).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating student' });
    }
};


export const updateStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await updateStudentByIdModel(id, req.body);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating student' });
    }
};


export const deleteStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await deleteStudentByIdModel(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully', student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting student' });
    }
};
