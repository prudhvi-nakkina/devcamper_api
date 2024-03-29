const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorhandler = require('./middleware/error');
const connectDB = require('./config/db');

// load env vars
dotenv.config({ path: './config/config.env' });

// connect to DB
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');

const app = express();

// Body Parser
app.use(express.json());

const logger = require('./middleware/logger');

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
// make sure its after routes
app.use(errorhandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));


// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error ${err.message}`.red);
    // close server & exit process
    server.close(() => process.exit(1));
});