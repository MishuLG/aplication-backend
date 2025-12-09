import {
    getAllSchoolYearsModel,
    getSchoolYearByIdModel,
    createSchoolYearModel,
    updateSchoolYearByIdModel,
    deleteSchoolYearByIdModel,
    checkDuplicateSchoolYearModel
} from '../models/schoolYear.model.js';

export const getAllSchoolYears = async (req, res) => {
    try {
        const schoolYears = await getAllSchoolYearsModel();
        res.json(schoolYears);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener años escolares' });
    }
};

export const getSchoolYearById = async (req, res) => {
    const { id } = req.params;
    try {
        const schoolYear = await getSchoolYearByIdModel(id);
        if (!schoolYear) return res.status(404).json({ message: 'Año escolar no encontrado' });
        res.json(schoolYear);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener año escolar' });
    }
};

export const createSchoolYear = async (req, res) => {
    const { school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, school_year_status } = req.body;

    if (!school_grade || !start_year || !end_of_year || !number_of_school_days || !school_year_status) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    const statusBoolean = school_year_status === 'active' || school_year_status === true;

    try {
        // --- VALIDACIÓN ---
        const isDuplicate = await checkDuplicateSchoolYearModel(school_grade, start_year, end_of_year);
        if (isDuplicate) return res.status(409).json({ message: 'Ya existe un año escolar con el mismo grado y fechas.' });

        const newSchoolYear = await createSchoolYearModel({ ...req.body, school_year_status: statusBoolean });
        res.status(201).json(newSchoolYear);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno al crear año escolar' });
    }
};

export const updateSchoolYearById = async (req, res) => {
    const { id } = req.params;
    const { school_grade, start_year, end_of_year, school_year_status } = req.body;

    const statusBoolean = school_year_status === 'active' || school_year_status === true;

    try {
        const isDuplicate = await checkDuplicateSchoolYearModel(school_grade, start_year, end_of_year, id);
        if (isDuplicate) return res.status(409).json({ message: 'Ya existe un año escolar con el mismo grado y fechas.' });

        const updatedSchoolYear = await updateSchoolYearByIdModel(id, { ...req.body, school_year_status: statusBoolean });
        if (!updatedSchoolYear) return res.status(404).json({ message: 'Año escolar no encontrado' });
        res.json(updatedSchoolYear);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar año escolar' });
    }
};

export const deleteSchoolYearById = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await deleteSchoolYearByIdModel(id);
        if (!deleted) return res.status(404).json({ message: 'Año escolar no encontrado' });
        res.json({ message: 'Año escolar eliminado correctamente' });
    } catch (error) {
        console.error(error);
        if (error.code === '23503') return res.status(409).json({ message: 'No se puede eliminar: Tiene registros asociados.' });
        res.status(500).json({ message: 'Error al eliminar año escolar' });
    }
};