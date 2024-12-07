import fs from 'fs';

const readData = () => {
    const data = fs.readFileSync('./src/db.json', 'utf-8');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync('./src/db.json', JSON.stringify(data, null, 2));
};

export const getAllStudents = (req, res) => {
    const students = readData().students;
    res.json(students);
};

export const getStudentById = (req, res) => {
    const { id } = req.params;
    const students = readData().students;
    const student = students.find(s => s.id_student === parseInt(id));

    if (student) {
        res.json(student);
    } else {
        res.status(404).send('Student not found');
    }
};

export const createStudent = (req, res) => {
    const newStudent = req.body;
    const data = readData();
    newStudent.id_student = data.students.length ? Math.max(...data.students.map(s => s.id_student)) + 1 : 1; 
    data.students.push(newStudent);
    
    writeData(data);
    res.status(201).json(newStudent);
};

export const deleteStudentById = (req, res) => {
    const { id } = req.params;
    let data = readData();
    const initialLength = data.students.length;

    data.students = data.students.filter(s => s.id_student !== parseInt(id));

    if (data.students.length < initialLength) {
        writeData(data);
        res.send('Student deleted');
    } else {
        res.status(404).send('Student not found');
    }
};

export const updateStudentById = (req, res) => {
    const { id } = req.params;
    const updatedStudent = req.body;
    
    let data = readData();
    const studentIndex = data.students.findIndex(s => s.id_student === parseInt(id));

    if (studentIndex !== -1) {
        updatedStudent.id_student = parseInt(id); 
        data.students[studentIndex] = updatedStudent;

        writeData(data);
        res.json(updatedStudent);
    } else {
        res.status(404).send('Student not found');
    }
};