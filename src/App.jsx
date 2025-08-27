import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";
import ProfilePage from "./components/ProfilePage";
import { MessageProvider } from "./context/MessageContext.jsx";
import "./App.scss";

const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [activePage, setActivePage] = useState("chat");

  // const users = ["Alice", "Bob", "Charlie"];
  const handleBack = () => {
    setSelectedUser(null); 
  };

  return (
    <MessageProvider>
      <div className={`app ${selectedUser ? "chat-open" : "chat-close"}`}>
        <Sidebar onUserSelect={setSelectedUser} />

        {selectedUser ? (
          <>
            {activePage === "chat" && (
              <ChatBox
                user={selectedUser}
                onBack={handleBack}
                onOpenProfile={() => setActivePage("profile")}
              />
            )}
    
          </>
        ) : (
          <div className="placeholder">Select a user to start chatting</div>
        )}
      </div>
    </MessageProvider>
  );
};

export default App;
