const Task = require('../models/Task')


const getTasks = async (req, res) => {
    try {
        
        const tasks = await Task.find().sort({createdAt: 1 });
        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({ message: "Server Error: could not get tasks" });
    }
}

const addTask = async (req, res) => {
    try {
        const { title, type, desc } = req.body;

        
        const newTask = await Task.create({
            title,
            type,
            desc
        });

        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: "Invalid task data" });
    }
};


const deleteTask = async (req, res) => {
    try {
        
        const task = await Task.findById(req.params.id);

        if (task) {
            await task.deleteOne();
            res.status(200).json({ message: "Task removed" });
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error: Could not delete" });
    }
};

module.exports = { getTasks, addTask, deleteTask };
