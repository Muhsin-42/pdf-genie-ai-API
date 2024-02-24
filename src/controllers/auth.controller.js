import jwt from "jsonwebtoken";
import { SESSION_SECRET_KEY } from "../utils/constants.js";

export const Authenticate = async (req, res, next) => {
  try {
    console.log("came for authentication");
    const token = req.headers.authorization.split(" ")[1];
    const { sessionId } = jwt.verify(token, SESSION_SECRET_KEY);
    if (req.params.clientSessinId !== sessionId)
      throw new Error("Unauthorized request");

    console.log("authenticated");
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
