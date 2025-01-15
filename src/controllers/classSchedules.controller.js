import {
    getAllClassSchedulesModel,
    getClassScheduleByIdModel,
    createClassScheduleModel,
    updateClassScheduleByIdModel,
    deleteClassScheduleByIdModel
} from '../models/classSchedules.model.js';


export const getAllClassSchedules = async (req, res) => {
    try {
        const schedules = await getAllClassSchedulesModel();
        res.json(schedules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching class schedules' });
    }
};


export const getClassScheduleById = async (req, res) => {
    const { id } = req.params;
    try {
        const schedule = await getClassScheduleByIdModel(id);
        if (!schedule) {
            return res.status(404).json({ message: 'Class schedule not found' });
        }
        res.json(schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching class schedule' });
    }
};


export const createClassSchedule = async (req, res) => {
    const { start_date, end_date, classroom, day_of_week, start_time, end_time, unforeseen_events } = req.body;

    
    if (!start_date || !end_date || !classroom || !day_of_week || !start_time || !end_time) {
        return res.status(400).json({ message: 'All fields except unforeseen_events are required' });
    }

    try {
        const schedule = await createClassScheduleModel({
            start_date,
            end_date,
            classroom,
            day_of_week,
            start_time,
            end_time,
            unforeseen_events
        });
        res.status(201).json(schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating class schedule' });
    }
};


export const updateClassScheduleById = async (req, res) => {
    const { id } = req.params;
    const { start_date, end_date, classroom, day_of_week, start_time, end_time, unforeseen_events } = req.body;

    try {
        const schedule = await updateClassScheduleByIdModel(id, {
            start_date,
            end_date,
            classroom,
            day_of_week,
            start_time,
            end_time,
            unforeseen_events
        });
        if (!schedule) {
            return res.status(404).json({ message: 'Class schedule not found' });
        }
        res.json(schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating class schedule' });
    }
};


export const deleteClassScheduleById = async (req, res) => {
    const { id } = req.params;

    try {
        const schedule = await deleteClassScheduleByIdModel(id);
        if (!schedule) {
            return res.status(404).json({ message: 'Class schedule not found' });
        }
        res.json({ message: 'Class schedule deleted successfully', schedule });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting class schedule' });
    }
};
