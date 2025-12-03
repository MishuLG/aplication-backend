import {
    createUserModel,
    validateProfessorModel,
    getUsersByRoleModel,
    deleteUserByIdModel,
    updateUserByIdModel,
    getUserByIdModel,
    getAllUsersModel
} from '../models/users.model.js';

const parsePostgresUniqueError = (err) => {
    const result = { field: 'registro', value: null, message: 'Valor duplicado' };
    if (!err) return result;

    // typical err.detail: "Ya existe la llave (dni)=(30651788)."
    if (typeof err.detail === 'string') {
        const m = err.detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
        if (m) {
            result.field = m[1];
            result.value = m[2];
            result.message = `Ya existe ${result.field}: ${result.value}`;
            return result;
        }
    }

    // fallback to constraint name parsing: e.g. users_identification_number_key
    if (err.constraint && typeof err.constraint === 'string') {
        const c = err.constraint;
        if (/identif/i.test(c) || /dni/i.test(c) || /identification/i.test(c)) {
            result.field = 'dni';
            result.message = 'DNI duplicado';
            return result;
        }
        // try to extract field name from constraint pattern like table_column_key
        const parts = c.split('_');
        if (parts.length >= 3) {
            // last meaningful part before 'key'
            const possibleField = parts.slice(1, parts.length - 1).join('_');
            result.field = possibleField || result.field;
            result.message = `Valor duplicado en ${result.field}`;
            return result;
        }
    }

    // generic
    if (err.message) result.message = err.message;
    return result;
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersModel();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving the users' });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserByIdModel(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};

export const createUser = async (req, res) => {
    const { id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender, status = 'Active' } = req.body;

    if (!id_rols || !first_name || !last_name || !dni || !number_tlf || !email || !password || !date_of_birth || !gender) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await createUserModel({
            id_rols,
            first_name,
            last_name,
            dni,
            number_tlf,
            email,
            password,
            date_of_birth,
            gender,
            status
        });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error(error);

        // Postgres unique violation
        if (error && error.code === '23505') {
            const parsed = parsePostgresUniqueError(error);
            const errors = {};
            errors[parsed.field] = parsed.value ? `Ya existe ${parsed.value}` : parsed.message;
            return res.status(409).json({ message: parsed.message, errors });
        }

        // forward validation-style errors from model (if any)
        if (error && error.status && error.message) {
            return res.status(error.status).json({ message: error.message, errors: error.errors || null });
        }

        res.status(500).json({ message: 'Error creating user' });
    }
};

export const validateProfessor = async (req, res) => {
    const { uid_users } = req.params;

    try {
        const user = await validateProfessorModel(uid_users);
        if (!user) {
            return res.status(404).json({ message: 'User not found or already validated' });
        }
        res.json({ message: 'Professor validated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error validating professor' });
    }
};

export const getUsersByRole = async (req, res) => {
    const { role } = req.params;

    try {
        const users = await getUsersByRoleModel(role);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users by role' });
    }
};

export const updateUserById = async (req, res) => {
    const { id } = req.params;
    const { id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender, status } = req.body;

    try {
        const user = await updateUserByIdModel(id, {
            id_rols,
            first_name,
            last_name,
            dni,
            number_tlf,
            email,
            password,
            date_of_birth,
            gender,
            status
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);

        if (error && error.code === '23505') {
            const parsed = parsePostgresUniqueError(error);
            const errors = {};
            errors[parsed.field] = parsed.value ? `Ya existe ${parsed.value}` : parsed.message;
            return res.status(409).json({ message: parsed.message, errors });
        }

        if (error && error.status && error.message) {
            return res.status(error.status).json({ message: error.message, errors: error.errors || null });
        }

        res.status(500).json({ message: 'Error updating user' });
    }
};

export const deleteUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await deleteUserByIdModel(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    validateProfessor,
    getUsersByRole,
    updateUserById,
    deleteUserById
};
