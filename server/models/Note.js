const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    content: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
