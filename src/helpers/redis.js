import { Redis } from "ioredis";
import { REDIS_URL } from "../utils/constants.js";

const getRedisUrl = () => {
  if (REDIS_URL) return REDIS_URL;
  throw new Error("REDIS_URL IS NOT DEFINED");
};

export const redis = new Redis(getRedisUrl());

export const getParsedRedisData = async (key) => {
  const data = await redis.get(key);
  const parsedData = data ? JSON.parse(data) : [];
  return parsedData;
};
