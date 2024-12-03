const { connectToDB, ObjectId } = require("./db");
const jwt = require('jsonwebtoken');

// Secret key for JWT
process.env.TOKEN_SECRET = 'secret'; // Use environment variables in production

// Generate JWT Token and store it in the database
const generateToken = async (user) => {
    const userData = { userId: user._id, role: user.role };
    const token = jwt.sign(userData, process.env.TOKEN_SECRET, { expiresIn: '24h' });

    const db = await connectToDB();
    try {
        await db.collection("users").updateOne(
            { _id: new ObjectId(user._id) },
            { $addToSet: { tokens: token } }
        );
        return token;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to generate token');
    } finally {
        await db.client.close();
    }
};

// Extract Bearer token from Authorization header
const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return null;
};

// Authenticate Middleware
const authenticate = async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    const db = await connectToDB();
    try {
        const user = await db.collection("users").findOne({ tokens: token });
        if (!user) {
            return res.status(401).send("Unauthorized: Invalid token");
        }

        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden: Invalid token" });
            }
            req.user = decoded;
            next();
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    } finally {
        await db.client.close();
    }
};

// Logout Functionality - Remove Token
const removeToken = async (token) => {
    const db = await connectToDB();
    try {
        await db.collection("users").updateOne(
            { tokens: token },
            { $pull: { tokens: token } }
        );
    } catch (err) {
        console.error("Error removing token from database:", err);
        throw new Error('Failed to remove token');
    } finally {
        await db.client.close();
    }
};

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
    const token = extractToken(req);

    if (token) {
        try {
            jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (err) {
            await removeToken(token);
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
    }

    next();
};

// Authorization Middleware
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden: Insufficient privileges" });
        }
    };
};

module.exports = { generateToken, authenticate, extractToken, removeToken, verifyToken, authorizeRole };