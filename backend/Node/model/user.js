const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    uploads: {
        type: [String], // Array of strings to store filenames
        default: []    // Default value is an empty array
    }
},{timestamps:true});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
