const  express = require('express');

const connectDB = require('./config/db')

const app = express()
require('dotenv').config();

const cors = require('cors');
app.use(cors());

app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;

const taskRoutes = require('./routes/taskRoutes')
app.use('/api/tasks', taskRoutes)

const noteRoutes = require('./routes/noteRoutes')
app.use('/api/notes', noteRoutes)

app.get('/', (req, res) =>{
  res.send('Task scheduling & Notes API is running')
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MongoDB backend is connected' });
});

app.listen(PORT, () =>{
  console.log(`Server is running on ${PORT}`);
});