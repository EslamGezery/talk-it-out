import { useState, useCallback } from "react";

const GEMINI_API_KEY = "AIzaSyAEEdMkxpRm57b9SkBp9swJKJ7indHMBb8";

const SYSTEM_PROMPT = `You are a warm, empathetic listener. Your job is to listen to the user and let them vent freely. 
- Never judge them
- Respond naturally and simply like a close friend
- Ask follow-up questions to encourage them to keep talking
- Keep responses short (2-3 sentences max)
- Be supportive and understanding
- If they speak Arabic, respond in Arabic. If English, respond in English.`;

export function useGemini() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [conversationHistory, setConversationHistory] = useState<{role: string, parts: {text: string}[]}[]>([]);

  const sendToGemini = useCallback(async (text: string) => {
    setIsLoading(true);
    try {
      const newHistory = [
        ...conversationHistory,
        { role: "user", parts: [{ text }] }
      ];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_PROMPT }]
            },
            contents: newHistory,
          }),
        }
      );
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here, keep talking...";
      
      setConversationHistory([
        ...newHistory,
        { role: "model", parts: [{ text: reply }] }
      ]);
      
      setResponse(reply);
      return reply;
    } catch (error) {
      setResponse("Sorry, I couldn't get a response.");
      return "Sorry, I couldn't get a response.";
    } finally {
      setIsLoading(false);
    }
  }, [conversationHistory]);

  const resetConversation = useCallback(() => {
    setConversationHistory([]);
    setResponse("");
  }, []);

  return { isLoading, response, sendToGemini, resetConversation };
}
