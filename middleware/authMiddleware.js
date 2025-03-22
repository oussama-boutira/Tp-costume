const jwt = require("jsonwebtoken");

const SECRET_KEY = "secret123";
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Accès non autorisé" });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ error: "Token invalide ou expiré" });
    }
};


const checkRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.type !== role) {
            return res.status(403).json({ error: "Accès interdit" });
        }
        next();
    };
};

module.exports = { authMiddleware, checkRole };
