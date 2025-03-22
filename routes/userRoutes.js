const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");

const router = express.Router();
const SECRET_KEY = "secret123";

// 1. Créer un compte (Inscription)
router.post("/register", async (req, res) => {
    try {
        const { nom, prenom, email, password, type } = req.body;

        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email déjà utilisé" });

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const newUser = new User({ nom, prenom, email, password: hashedPassword, type });
        await newUser.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Se connecter (Login)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Email ou mot de passe incorrect" });

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Email ou mot de passe incorrect" });

        // Générer un token JWT
        const token = jwt.sign({ userId: user._id, type: user.type }, SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ token, type: user.type });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Recevoir messages liés aux costumes (Seulement pour stylistes)
router.get("/messages_costume", authMiddleware, checkRole("styliste"), async (req, res) => {
    res.status(200).json({ messages: ["Votre costume a été noté", "Un commentaire a été ajouté"] });
});

// 4. Recevoir messages liés aux notes (Seulement pour jury)
router.get("/messages_notes", authMiddleware, checkRole("jury"), async (req, res) => {
    res.status(200).json({ messages: ["Vous avez donné une note à un costume", "Un styliste a répondu à votre commentaire"] });
});

module.exports = router;
