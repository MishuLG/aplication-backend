import {
    createUserModel,
    validateProfessorModel,
    getUsersByRoleModel,
    deleteUserByIdModel,
    updateUserByIdModel,
    getUserByIdModel,
    getAllUsersModel
} from '../models/users.model.js';


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
    const { id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender, status = true } = req.body;

    
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
    const { id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender } = req.body;

    
    if (!id_rols && !first_name && !last_name && !dni && !number_tlf && !email && !password && !date_of_birth && !gender) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

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
            gender
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
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
