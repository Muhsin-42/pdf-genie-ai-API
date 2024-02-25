import OpenAI from "openai";
import { GPT_MAX_TOKEN, OPENAI_API_KEY } from "../utils/constants.js";
import { getParsedRedisData, redis } from "./redis.js";
import { getPrompt } from "../utils/index.js";
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const getGptStreamResponse = async (
  sessionId,
  pdfContent,
  userQuestion,
  res
) => {
  try {
    const parsedHistory = await getParsedRedisData(sessionId + "convo");
    const messages = getPrompt(pdfContent, parsedHistory, userQuestion);
    const response = await openai.chat.completions.create(
      {
        model: "gpt-3.5-turbo",
        stream: true,
        messages,
        max_tokens: GPT_MAX_TOKEN,
      },
      { responseType: "stream" }
    );
    let finalContent = "";
    for await (const chunk of response) {
      if (chunk.choices[0]?.delta?.content) {
        console.log(chunk.choices[0]?.delta?.content);
        finalContent += chunk.choices[0]?.delta?.content;
        res.write(`${chunk.choices[0]?.delta?.content}`);
      }
    }
    const updatedHistory = parsedHistory.concat(
      {
        role: "user",
        content: userQuestion,
      },
      {
        role: "system",
        content: finalContent,
      }
    );
    await redis.set(sessionId + "convo", JSON.stringify(updatedHistory));
    return res.end();
  } catch (error) {
    console.log("GPT ERROR ", error);
  }
};
