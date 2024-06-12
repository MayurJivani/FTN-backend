const express = require('express');
const usersRoutes = require('./src/routes/usersRoute');
const zoomRoutes = require('./src/routes/zoomRoute');
const zoomSdkRoutes = require('./src/routes/zoomSdkRoute');
const paymentRoutes = require('./src/routes/paymentRoute');
const recLectureRoutes = require('./src/routes/recLecturesRoute');
const feedbackRoutes = require('./src/routes/feedbackRoute');
const leaveRoutes = require('./src/routes/leaveRoute');
const mentorRoutes = require('./src/routes/mentorRoute');
const fileRoutes = require('./src/routes/filesRoute');
const lecturesRoutes = require('./src/routes/lecturesRoute');
const app = express();
const cors = require('cors');
const PORT = process.env.SERVER_PORT;

const corsOptions = {
    origin: '*',
    methods: ['POST', 'GET', 'PUT'],
    allowedHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning'],
};

app.use(express.json()); 

app.use(cors(corsOptions));

app.use('/api/users', usersRoutes);
app.use('/api/zoom', zoomRoutes);
app.use('/api/meeting', zoomSdkRoutes);
app.use('/api/lecture', lecturesRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/recording', recLectureRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/leave', leaveRoutes)
app.use('/api/mentor', mentorRoutes)
app.use('/api/files', fileRoutes)

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
