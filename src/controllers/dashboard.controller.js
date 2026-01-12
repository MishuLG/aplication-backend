import { 
    getTotalStudentsModel, 
    getTotalUsersModel, 
    getTotalEvaluationsModel,
    getStudentRegistrationsGraphModel
} from '../models/dashboard.model.js';

export const getDashboardStats = async (req, res) => {
    try {
        console.log("⚡ Calculando datos del Dashboard...");

        const [students, users, evaluations, registrations] = await Promise.all([
            getTotalStudentsModel(),
            getTotalUsersModel(),
            getTotalEvaluationsModel(),
            getStudentRegistrationsGraphModel()
        ]);

        res.json({
            kpi: {
                students: students,
                users: users,
                evaluations: evaluations,
                attendance: "0%" 
            },
            charts: {
                registrations: registrations,
                attendance: [] 
            }
        });

    } catch (error) {
        console.error("Error en Dashboard Controller:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};