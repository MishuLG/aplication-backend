import {
    getAllSchoolYearsModel,
    getSchoolYearByIdModel,
    createSchoolYearModel,
    updateSchoolYearByIdModel,
    deleteSchoolYearByIdModel
} from '../models/schoolYear.model.js';


export const getAllSchoolYears = async (req, res) => {
    try {
        const schoolYears = await getAllSchoolYearsModel();
        res.json(schoolYears);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving school years' });
    }
};


export const getSchoolYearById = async (req, res) => {
    const { id } = req.params;
    try {
        const schoolYear = await getSchoolYearByIdModel(id);
        if (!schoolYear) {
            return res.status(404).json({ message: 'School year not found' });
        }
        res.json(schoolYear);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving school year' });
    }
};


export const createSchoolYear = async (req, res) => {
    const { school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, school_year_status } = req.body;
  
    if (!school_grade || !start_year || !end_of_year || !number_of_school_days || !school_year_status) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben estar completos.' });
    }
  
    try {
      const newSchoolYear = await createSchoolYearModel({
        school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, school_year_status
      });
  
      res.status(201).json({ message: 'School year created successfully', schoolYear: newSchoolYear });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || 'Error creating school year' });
    }
  };


export const updateSchoolYearById = async (req, res) => {
    const { id } = req.params;
    const { school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, school_year_status } = req.body;

    try {
        const updatedSchoolYear = await updateSchoolYearByIdModel(id, {
            school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, school_year_status
        });

        if (!updatedSchoolYear) {
            return res.status(404).json({ message: 'School year not found' });
        }

        res.json({ message: 'School year updated successfully', schoolYear: updatedSchoolYear });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating school year' });
    }
};


export const deleteSchoolYearById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSchoolYear = await deleteSchoolYearByIdModel(id);
        if (!deletedSchoolYear) {
            return res.status(404).json({ message: 'School year not found' });
        }
        res.json({ message: 'School year deleted successfully', schoolYear: deletedSchoolYear });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting school year' });
    }
};
