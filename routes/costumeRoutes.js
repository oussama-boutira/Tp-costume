const express = require("express");
const Costume = require("../models/costume");
const Note = require("../models/note");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Récupérer un costume par ID
router.get("/costume/:idCostume", authMiddleware, async (req, res) => {
    try {
        const costume = await Costume.findById(req.params.idCostume);
        if (!costume) return res.status(404).json({ error: "Costume non trouvé" });

        res.status(200).json(costume);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Calculer la moyenne des notes d’un costume donné
router.get("/notes_costume/:idCostume", authMiddleware, async (req, res) => {
    try {
        const notes = await Note.find({ idCostume: req.params.idCostume });

        if (notes.length === 0) {
            return res.status(200).json({ message: "Aucune note trouvée pour ce costume", moyenne: null });
        }

        const sommeNotes = notes.reduce((acc, note) => acc + note.valeur_note, 0);
        const moyenne = sommeNotes / notes.length;

        res.status(200).json({ idCostume: req.params.idCostume, moyenne: moyenne.toFixed(2) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ajouter un nouveau costume
router.post("/costume", authMiddleware, checkRole("styliste"), async (req, res) => {
    try {
        const { designation, styliste } = req.body;

        if (!designation || !styliste) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        const newCostume = new Costume({ designation, styliste });
        await newCostume.save();

        res.status(201).json({ message: "Costume ajouté avec succès", costume: newCostume });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Supprimer un costume
router.delete("/costume/:idCostume", authMiddleware, checkRole("styliste"), async (req, res) => {
    try {
        const costume = await Costume.findById(req.params.idCostume);
        if (!costume) return res.status(404).json({ error: "Costume non trouvé" });

        await Costume.findByIdAndDelete(req.params.idCostume);
        res.status(200).json({ message: "Costume supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
