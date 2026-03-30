import { useState, useCallback } from "react";

const GEMINI_API_KEY = "AIzaSyAEEdMkxpRm57b9SkBp9swJKJ7indHMBb8";

export function useGemini() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const sendToGemini = useCallback(async (text: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
          }),
        }
      );
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
      setResponse(reply);
      return reply;
    } catch (error) {
      setResponse("Sorry, I couldn't get a response.");
      return "Sorry, I couldn't get a response.";
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, response, sendToGemini };
}