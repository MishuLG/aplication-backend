import { getTotalUsersModel, getStudentRegistrationsByDayModel } from '../models/dashboard.model.js';

export const getTotalUsers = async (req, res) => {
    try {
        const totalUsers = await getTotalUsersModel();
        res.json({ totalUsers });
    } catch (error) {
        console.error('Error fetching total users:', error);
        res.status(500).json({ message: 'Error retrieving total users' });
    }
};

export const getStudentRegistrationsByDay = async (req, res) => {
    try {
        const registrations = await getStudentRegistrationsByDayModel();
        res.json(registrations);
    } catch (error) {
        console.error('Error fetching student registrations:', error);
        res.status(500).json({ message: 'Error retrieving student registrations' });
    }
};
