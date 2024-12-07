import fs from 'fs';

const readData = () => {
    const data = fs.readFileSync('./src/db.json', 'utf-8');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync('./src/db.json', JSON.stringify(data, null, 2));
};

export const getAllUsers = (req, res) => {
    const users = readData().users;
    res.json(users);
};

export const getUserById = (req, res) => {
    const { id } = req.params;
    const users = readData().users;
    const user = users.find(u => u.Uid_users === parseInt(id));

    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
};

export const createUser = (req, res) => {
    const newUser = req.body;
    const data = readData();
    newUser.Uid_users = data.users.length ? Math.max(...data.users.map(u => u.Uid_users)) + 1 : 1; 
    data.users.push(newUser);
    
    writeData(data);
    res.status(201).json(newUser);
};

export const deleteUserById = (req, res) => {
    const { id } = req.params;
    let data = readData();
    const initialLength = data.users.length;

    data.users = data.users.filter(u => u.Uid_users !== parseInt(id));

    if (data.users.length < initialLength) {
        writeData(data);
        res.send('User deleted');
    } else {
        res.status(404).send('User not found');
    }
};

export const updateUserById = (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    
    let data = readData();
    const userIndex = data.users.findIndex(u => u.Uid_users === parseInt(id));

    if (userIndex !== -1) {
        updatedUser.Uid_users = parseInt(id); 
        data.users[userIndex] = updatedUser;

        writeData(data);
        res.json(updatedUser);
    } else {
        res.status(404).send('User not found');
    }
};