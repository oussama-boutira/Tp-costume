const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const costumeRoutes = require("./routes/costumeRoutes");

const app = express();
app.use(express.json());

// Connexion à MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/costumDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté"))
  .catch(err => console.error("Erreur MongoDB :", err));

// Définition des routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/costumes", costumeRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
