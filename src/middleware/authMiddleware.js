import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.header("Authorization");

  // Check if the Authorization header exists and has the 'Bearer ' prefix
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided or invalid token format." });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret key stored in environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "FDLHF3123KSDFJDSFKF");

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // Provide a more specific error message for expired or invalid tokens
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;
