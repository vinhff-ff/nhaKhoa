import React, { useState, useRef, useEffect } from "react";
import { SendOutlined, CloseOutlined } from "@ant-design/icons";
import { message, Spin } from "antd";
import { sendMessageToGemini, Message } from "../../api/gemini";
import "../../page/Chat/chat.scss";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const GEMINI_API_KEY = "AIzaSyANGsQGpQtm6_RGrpcbtHdrm--Bsv74o5w"; // API Key cố định

  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([
    {
      role: "ai",
      text: "Xin chào! Tôi là trợ lý AI. Bạn cần giúp gì không? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) {
      message.warning("Vui lòng nhập tin nhắn");
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);

    try {
      setLoading(true);

      // Convert messages format for Gemini API
      const conversationHistory: Message[] = messages
        .filter(m => m.role === "ai")
        .map(m => ({
          role: "model",
          parts: [{ text: m.text }],
        }));

      const aiResponse = await sendMessageToGemini(
        userMessage,
        conversationHistory,
        GEMINI_API_KEY
      );

      setMessages(prev => [...prev, { role: "ai", text: aiResponse }]);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Lỗi gửi tin nhắn");
      setMessages(prev => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="chat-window-wrapper">
      <div className="chat-window">
        <div className="chat-header">
          <h3>Trợ lý AI</h3>
          <button className="chat-close-btn" onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message message-${msg.role}`}>
              <div className="message-content">{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className="message message-ai">
              <div className="message-content">
                <Spin size="small" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !loading) handleSendMessage();
            }}
            placeholder="Nhập tin nhắn..."
            className="chat-input"
            disabled={loading}
          />
          <button
            className="chat-send-btn"
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
          >
            <SendOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
