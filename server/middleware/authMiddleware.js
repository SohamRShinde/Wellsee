import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
    const token = req.cookies.accessToken; 

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = verified; 
        next(); 
    } catch (error) {
        res.clearCookie("token");
        res.status(403).json({ message: "Invalid or Expired Token" });
    }
};