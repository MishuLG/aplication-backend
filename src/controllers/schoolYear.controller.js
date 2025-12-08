import {
    getAllSchoolYearsModel,
    getSchoolYearByIdModel,
    createSchoolYearModel,
    updateSchoolYearByIdModel,
    deleteSchoolYearByIdModel
} from '../models/schoolYear.model.js';

const parsePostgresUniqueError = (err) => {
    const result = { field: 'registro', value: null, message: 'Valor duplicado' };
    if (!err) return result;

    if (typeof err.detail === 'string') {
        const m = err.detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
        if (m) {
            result.field = m[1];
            result.value = m[2];
            result.message = `Ya existe un registro con ${result.field}: ${result.value}`;
            return result;
        }
    }

    if (err.message) result.message = err.message;
    return result;
};


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

      if (error && error.code === '23505') {
          const parsed = parsePostgresUniqueError(error);
          return res.status(409).json({ 
              message: parsed.message, 
              errors: { [parsed.field]: parsed.message } 
          });
      }

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

        if (error && error.code === '23505') {
            const parsed = parsePostgresUniqueError(error);
            return res.status(409).json({ 
                message: parsed.message, 
                errors: { [parsed.field]: parsed.message }
            });
        }

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
        if (error && error.code === '23503') {
            return res.status(409).json({ message: 'No se puede eliminar: El año escolar tiene registros asociados (alumnos, secciones, etc).' });
        }
        res.status(500).json({ message: 'Error deleting school year' });
    }
};