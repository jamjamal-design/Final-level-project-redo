const mongoose = require('mongoose')
const taskSchema = mongoose.Schema({
    title:{
        type:String,
        required: [true, 'Please add a title']
    },
    desc:{
        type:String,
        default: ''
    },
    type:{
        type: String,
        enum: ['Email', 'File Upload', 'Message', 'Other'],
        default: 'Other'
    },
    completed: {
        type:Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;