const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, enum: ["styliste", "jury"], required: true }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
