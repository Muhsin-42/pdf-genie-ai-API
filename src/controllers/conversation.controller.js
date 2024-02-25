import { getGptStreamResponse } from "../helpers/gpt-stream.js";
import { getGptResponse } from "../helpers/gpt.js";
import { getParsedRedisData, redis } from "../helpers/redis.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const ask = async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const sessionId = req.params.clientSessinId;
    const data = await redis.get(sessionId);
    getGptStreamResponse(sessionId, data, req.body.prompt, res);
  } catch (error) {
    throw new Error("eRROR ", error);
  }
};

export const getConvos = asyncHandler(async (req, res) => {
  try {
    const sessionId = req.params.clientSessinId;
    const conversationHistory = await getParsedRedisData(sessionId + "convo");
    return res.status(200).json(new ApiResponse(200, { conversationHistory }));
  } catch (error) {
    throw new ApiError(500, error.message || "Something Went Wrong");
  }
});
