export const generateSessionId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(7)}`;
