import { getGptResponse } from "../helpers/gpt.js";
import { getParsedRedisData, redis } from "../helpers/redis.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const ask = asyncHandler(async (req, res) => {
  try {
    const sessionId = req.params.clientSessinId;
    const data = await redis.get(sessionId);
    await getGptResponse(sessionId, data, req.body.prompt);
    const conversationHistory = await getParsedRedisData(sessionId + "convo");

    return res.status(200).json(new ApiResponse(200, { conversationHistory }));
  } catch (error) {
    throw new ApiError(500, error.message || "Something Went Wrong");
  }
});

export const getConvos = asyncHandler(async (req, res) => {
  try {
    const sessionId = req.params.clientSessinId;
    const conversationHistory = await getParsedRedisData(sessionId + "convo");
    return res.status(200).json(new ApiResponse(200, { conversationHistory }));
  } catch (error) {
    throw new ApiError(500, error.message || "Something Went Wrong");
  }
});
