import React, { createContext, useContext, useState } from "react";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: 2,
      type:'text',
      sender: "Sarah Wilson",
      text: "Hey! How are u?",
      timestamp: "12:04",
      fileName:'',
      fileSize:'',
      fileUrl:'',
      audioURL:"",
      image:""
    },
    {
      id: 2,
      sender: "You", 
      type: 'text',
      text: "good",
      timestamp: "12:04",
      fileName:'',
      fileSize:'',
      fileUrl:'',
      audioURL:"",
      image:""
    }
  ]);

  const addMessage = (newMessages) => {
    setMessages(newMessages);
  };

  return (
    <MessageContext.Provider value={{ messages, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
};