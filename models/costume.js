const mongoose = require("mongoose");

const CostumeSchema = new mongoose.Schema({
    designation: { type: String, required: true },
    styliste: { type: String, required: true }
});

module.exports = mongoose.model("Costume", CostumeSchema);
