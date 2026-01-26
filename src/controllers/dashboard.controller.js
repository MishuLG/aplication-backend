import { Student, User, Evaluation } from '../models/Sequelize/index.js';

export const getDashboardStats = async (req, res) => {
    try {
        console.log("⚡ Calculando datos del Dashboard con Sequelize...");

        const [totalStudents, totalUsers, totalEvaluations, studentsData] = await Promise.all([
            Student.count({ where: { status: 'active' } }),
            User.count(),
            Evaluation.count(),
            Student.findAll({
                attributes: ['enrollment_date'],
                where: { status: 'active' },
                order: [['enrollment_date', 'ASC']]
            })
        ]);

        // Procesar gráfico de inscripciones
        const registrationsMap = {};
        studentsData.forEach(student => {
            if (student.enrollment_date) {
                const date = new Date(student.enrollment_date);
                // Formato YYYY-MM
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                registrationsMap[monthKey] = (registrationsMap[monthKey] || 0) + 1;
            }
        });

        const registrationsGraph = Object.entries(registrationsMap).map(([month, count]) => ({
            month,
            count
        })).sort((a, b) => a.month.localeCompare(b.month));

        res.json({
            kpi: {
                students: totalStudents,
                users: totalUsers,
                evaluations: totalEvaluations,
                attendance: "0%" 
            },
            charts: {
                registrations: registrationsGraph,
                attendance: [] 
            }
        });

    } catch (error) {
        console.error("❌ Error en Dashboard Controller:", error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};