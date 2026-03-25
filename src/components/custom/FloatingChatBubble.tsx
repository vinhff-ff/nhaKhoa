import React, { useState } from "react";
import { MessageOutlined } from "@ant-design/icons";
import ChatWindow from "./ChatWindow";
import "./floatingChat.scss";

const FloatingChatBubble: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className="floating-chat-bubble" onClick={() => setIsChatOpen(true)}>
        <MessageOutlined />
      </div>
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default FloatingChatBubble;
