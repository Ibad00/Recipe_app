var createError = require('http-errors'); // 404 error handler for express app 
var express = require('express');// Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
const mongoose = require('mongoose'); // Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.

var app = express(); // Create an express app

app.use(express.json()); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property. 
app.use(express.urlencoded({ extended: false })); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.

// Connect to MongoDB

(async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017")
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})() 
// Routes 

const router = require('./routes/index');// Import routes from routes/index.js
app.use('/', router); // Use the routes from routes/index.js 

app.use(function(req, res, next) { // catch 404 and forward to error handler
    next(createError(404)); 
});

const PORT = 5600;
app.listen(PORT, console.log(`Server running port ${PORT}`)); // Start the server on port 5600