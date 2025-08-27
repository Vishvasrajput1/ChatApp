import React from "react";
import DocumentMessage from "./DocumentMessage";
import { FaCheckDouble } from "react-icons/fa6";
import { LiaCheckDoubleSolid } from "react-icons/lia";


const MessageList = ({ msg }) => {
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
       hour12: false
    });
  };

  return (
    msg.type === "text" && (
      <div className="message-bubble">
        <div className="message-content">
          {msg.text
            .trimStart()
            .trimEnd()
            .split("\n")
            .map((line, index) => (
              <span className="message-text" key={index}>
                {line}
                {index < msg.text.split("\n").length - 1 && <br />}
                {line.length > 30 && <br />}
              </span>
            ))}
            </div>
        <div className="message-meta">
          <span className="message-time">{getCurrentTime()}</span>
          {msg.sender === "You" && (
            <span className="message-status">
              {" "}
              <LiaCheckDoubleSolid size={13} color="#53BDEB" />
            </span>
          )}
        </div>
      </div>
    )
  );
};

export default MessageList;
