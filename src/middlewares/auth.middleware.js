import jwt from "jsonwebtoken";
import { SESSION_SECRET_KEY } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const Authenticate = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { sessionId } = jwt.verify(token, SESSION_SECRET_KEY);
    if (req.params.clientSessinId !== sessionId)
      throw new ApiError(401, "Unauthorized Access");

    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Unauthorized Access");
  }
});
