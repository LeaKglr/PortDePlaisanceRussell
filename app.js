const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const morgan = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catwayRoutes = require('./routes/catway');
const reservationRoutes = require('./routes/reservation');
const authRoutes = require('./routes/auth');

const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();

const app = express();


app.use(cors({
    exposedHeaders: ['Content-Type', 'Authorization'],
    origin: "*"
}))

app.use(logger('dev'));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRouter);
app.use('/api/catways', reservationRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/catways', catwayRoutes);




app.use('/api', indexRouter);
app.use((req, res, next) => {
    console.log(`Requête non gérée : ${req.method} ${req.url}`);
    res.status(404).send('Route introuvable');
});

module.exports = app;
