const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    valeur_note: { type: Number, required: true, min: 0, max: 20 },
    membre_jury: { type: String, required: true },
    idCostume: { type: mongoose.Schema.Types.ObjectId, ref: "Costume", required: true }
});

module.exports = mongoose.model("Note", NoteSchema);
