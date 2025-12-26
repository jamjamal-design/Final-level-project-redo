const Note = require('../models/Note');

const getNote = async (req, res) => {
    try {
        let note = await Note.findOne();
        
        if (!note) {
            note = await Note.create({ content: '' });
        }
        
        res.status(200).json(note);
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ message: 'Server Error: could not get note' });
    }
};


const saveNote = async (req, res) => {
    try {
        const { content } = req.body;
        
        let note = await Note.findOne();
        
        if (!note) {
            note = await Note.create({ content });
        } else {
            note.content = content;
            note.updatedAt = Date.now();
            await note.save();
        }
        
        res.status(200).json(note);
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(400).json({ message: 'Invalid note data' });
    }
};

module.exports = { getNote, saveNote };
