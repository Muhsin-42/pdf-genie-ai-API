export const generateSessionId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(7)}`;

export const getPrompt = (pdfContent, parsedHistory, userQuestion) => {
  const defaultPrompt = [
    {
      role: "system",
      content: `You are a PDF analyzer. Analyze the PDF and provide answers related to its content only. Pretend to be the subject of the PDF when answering questions. For example, if the PDF is a resume for a person named Sam, and the user asks for your name, respond with "My name is Sam". The content of the PDF is as follows: ${pdfContent}.`,
    },
  ];
  defaultPrompt.push(...parsedHistory);
  defaultPrompt.push({ role: "user", content: userQuestion });
  console.log("user quest", userQuestion);
  return defaultPrompt;
};
