import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_in_production";

export const verifyAdmin = (req, res, next) => {
  // Check for token in cookies first, then fallback to Authorization header
  let token = null;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if the user is an admin
    // Note: Adjust the role string based on your exact database values
    const role = decoded.role?.toLowerCase();
    
    if (role === "admin" || role === "chief information security officer") {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ success: false, error: "Access Denied. Admin privileges required." });
    }
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid or expired token." });
  }
};
