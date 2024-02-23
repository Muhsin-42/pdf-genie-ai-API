import OpenAI from "openai";
import { GPT_MAX_TOKEN, OPENAI_API_KEY } from "../utils/constants.js";
import { getParsedRedisData, redis } from "./redis.js";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const getGptResponse = async (sessionId, pdfContent, userQuestion) => {
  try {
    const parsedHistory = await getParsedRedisData(sessionId + "convo");
    const messages = [
      {
        role: "system",
        content: `You are a PDF analyzer. Analyze the PDF and provide answers related to its content only if a user asks unrelated questions give a sarcastic reply. Pretend to be the subject of the PDF when answering questions. For example, if the PDF is a resume for a person named Sam, and the user asks for your name, respond with "My name is Sam". The content of the PDF is as follows: ${pdfContent}. You have a token limit of ${GPT_MAX_TOKEN}, so please ensure your responses fit within this constraint.`,
      },
    ];

    messages.push(...parsedHistory);

    messages.push({ role: "user", content: userQuestion });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: GPT_MAX_TOKEN,
    });

    if (response) {
      const updatedHistory = parsedHistory.concat(
        {
          role: "user",
          content: userQuestion,
        },
        {
          role: "system",
          content: response.choices[0].message.content,
        }
      );
      await redis.set(sessionId + "convo", JSON.stringify(updatedHistory));
      return response.choices[0].message.content;
    }
  } catch (error) {
    console.log("GPT ERROR ", error);
  }
};
