const express = require("express");
const Note = require("../models/note");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 1. Ajouter une note (Réservé aux membres du jury)
router.post("/add_note", authMiddleware, checkRole("jury"), async (req, res) => {
    try {
        const { valeur_note, membre_jury, idCostume } = req.body;

        // Vérifier si le membre du jury a déjà noté ce costume
        const noteExistante = await Note.findOne({ membre_jury, idCostume });
        if (noteExistante) {
            return res.status(400).json({ error: "Vous avez déjà noté ce costume" });
        }

        // Vérifier si la note est bien entre 0 et 20
        if (valeur_note < 0 || valeur_note > 20) {
            return res.status(400).json({ error: "La note doit être entre 0 et 20" });
        }

        const newNote = new Note({ valeur_note, membre_jury, idCostume });
        await newNote.save();

        res.status(201).json({ message: "Note ajoutée avec succès", note: newNote });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 2. Récupérer les notes d’un costume donné (Accessible à toute personne authentifiée)
router.get("/notes/:idCostume", authMiddleware, async (req, res) => {
    try {
        const notes = await Note.find({ idCostume: req.params.idCostume });
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
