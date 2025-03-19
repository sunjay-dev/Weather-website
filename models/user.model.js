const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        sparse: true,
        unique: true
    },
    profilePicture: {
        type: String
    },
    city:{
        type: String
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
