import {
    getAllClassSchedulesModel,
    getClassScheduleByIdModel,
    createClassScheduleModel,
    updateClassScheduleByIdModel,
    deleteClassScheduleByIdModel,
    checkScheduleOverlapModel
} from '../models/classSchedules.model.js';

export const getAllClassSchedules = async (req, res) => {
    try {
        const schedules = await getAllClassSchedulesModel();
        res.json(schedules);
    } catch (error) {
        console.error("Error getAllClassSchedules:", error);
        res.status(500).json({ message: 'Error al obtener horarios', error: error.message });
    }
};

export const getClassScheduleById = async (req, res) => {
    try {
        const schedule = await getClassScheduleByIdModel(req.params.id);
        if (!schedule) return res.status(404).json({ message: 'Horario no encontrado' });
        res.json(schedule);
    } catch (error) {
        console.error("Error getClassScheduleById:", error);
        res.status(500).json({ message: 'Error al obtener horario' });
    }
};

export const createClassSchedule = async (req, res) => {
    const { start_date, end_date, classroom, day_of_week, start_time, end_time, unforeseen_events } = req.body;
    
    if (!start_date || !end_date || !classroom || !day_of_week || !start_time || !end_time) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    if (new Date(start_date) > new Date(end_date)) {
        return res.status(400).json({ message: 'La fecha de inicio no puede ser posterior a la fecha de fin.' });
    }

    if (start_time >= end_time) {
        return res.status(400).json({ message: 'La hora de inicio debe ser anterior a la hora de fin.' });
    }

    try {
        const isOverlap = await checkScheduleOverlapModel(classroom, day_of_week, start_time, end_time);
        if (isOverlap) {
            return res.status(409).json({ message: `Conflicto: El aula ${classroom} ya está ocupada en ese horario los ${day_of_week}.` });
        }

        const schedule = await createClassScheduleModel({
            start_date, end_date, classroom, day_of_week, start_time, end_time, unforeseen_events
        });
        res.status(201).json(schedule);
    } catch (error) {
        console.error("Error createClassSchedule:", error);
        res.status(500).json({ message: 'Error al crear horario', error: error.message });
    }
};

export const updateClassScheduleById = async (req, res) => {
    const { id } = req.params;
    const { start_date, end_date, classroom, day_of_week, start_time, end_time, unforeseen_events } = req.body;

    if (!start_date || !end_date || !classroom || !day_of_week || !start_time || !end_time) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para actualizar.' });
    }

    if (new Date(start_date) > new Date(end_date)) {
        return res.status(400).json({ message: 'La fecha de inicio no puede ser posterior a la fecha de fin.' });
    }
    if (start_time >= end_time) {
        return res.status(400).json({ message: 'La hora de inicio debe ser anterior a la hora de fin.' });
    }

    try {
        const isOverlap = await checkScheduleOverlapModel(classroom, day_of_week, start_time, end_time, id);
        if (isOverlap) {
            return res.status(409).json({ message: `Conflicto: El aula ${classroom} ya está ocupada en ese horario los ${day_of_week}.` });
        }

        const schedule = await updateClassScheduleByIdModel(id, {
            start_date, end_date, classroom, day_of_week, start_time, end_time, unforeseen_events
        });
        if (!schedule) {
            return res.status(404).json({ message: 'Horario no encontrado' });
        }
        res.json(schedule);
    } catch (error) {
        console.error("Error updateClassScheduleById:", error);
        res.status(500).json({ message: 'Error al actualizar horario', error: error.message });
    }
};

export const deleteClassScheduleById = async (req, res) => {
    const { id } = req.params;
    try {
        const schedule = await deleteClassScheduleByIdModel(id);
        if (!schedule) {
            return res.status(404).json({ message: 'Horario no encontrado' });
        }
        res.json({ message: 'Horario eliminado correctamente' });
    } catch (error) {
        console.error("Error deleteClassScheduleById:", error);
        res.status(500).json({ message: 'Error al eliminar horario' });
    }
};