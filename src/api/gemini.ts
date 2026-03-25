const BASE_GEMINI_API = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export interface Message {
  role: "user" | "model";
  parts: Array<{
    text: string;
  }>;
}

export const sendMessageToGemini = async (
  userMessage: string,
  conversationHistory: Message[],
  apiKey: string
): Promise<string> => {
  try {
    const messages: Message[] = [
      ...conversationHistory,
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ];

    const response = await fetch(`${BASE_GEMINI_API}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Lỗi gọi API Gemini");
    }

    const data = await response.json();
    const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiMessage) {
      throw new Error("Không nhận được phản hồi từ AI");
    }

    return aiMessage;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
