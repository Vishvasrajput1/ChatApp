import React, { useEffect, useState,useRef } from "react";
import { FaUserCircle, FaSearch, FaEdit, FaFilter } from 'react-icons/fa'

const Sidebar = ({ onUserSelect }) => {
  const  [mockUsers,setMockUsers] = useState([
    { 
      id: 1, 
      name: "Alex Thompson",
      lastMessage: "Great meeting today! Let's follow up next week",
      lastMessageTime: "17:40",
      isOnline: true,
      unreadCount: 3,
      number: 1234567890
    },
    { 
      id: 2, 
      name: "Sarah Wilson",
      lastMessage: "Thanks for the information, really helpful",
      lastMessageTime: "15:30",
      isOnline: false,
      unreadCount: 0
    },
    { 
      id: 3, 
      name: "Mike Chen",
      lastMessage: "Document has been updated and shared",
      lastMessageTime: "Yesterday",
      isOnline: false,
      unreadCount: 1
    },
    { 
      id: 4, 
      name: "Emma Davis",
      lastMessage: "Looking forward to our collaboration",
      lastMessageTime: "15-08-2025",
      isOnline: true,
      unreadCount: 0
    },
    { 
      id: 5, 
      name: "David Rodriguez",
      lastMessage: "Project deadline confirmed for next month",
      lastMessageTime: "14:20",
      isOnline: false,
      unreadCount: 2
    },
    { 
      id: 6, 
      name: "Lisa Park",
      lastMessage: "Team meeting scheduled for Friday",
      lastMessageTime: "13:45",
      isOnline: true,
      unreadCount: 0
    }
  ]);
  
  // const [addedUser,setAddedUser]=useState(mockUsers)
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUserId, setActiveUserId] = useState(2); 
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const formRef = useRef(null);


  const clearSearch = () => {
    setSearchTerm('')
    setUsers(mockUsers)
  }
   const handleAddUser = (e) => {
    
    e.preventDefault();
    if (!firstName.trim() || !newNumber.trim()) return;

    const newUser = {
      id: users.length + 1,
      name: firstName + " " + lastName,
      number: newNumber,
      lastMessage: "Hey! I just joined the chat.",
      lastMessageTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOnline: true,
      unreadCount: 0,
    };

    setMockUsers(mockUsers.concat(newUser))
    setUsers([...users, newUser]);
    setFirstName("");
    setLastName("");
    setNewNumber("");
    setShowForm(false); 
  };

  const handleClickOutside = (event) => {
    
    if (
      formRef.current &&
      !formRef.current.contains(event.target) 
    
    ) {
      setShowForm(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const SearchFilter = (value) => {
    if (!value.trim()) {  
      setUsers(mockUsers)
      return
    }
    
    const filteredName = mockUsers.filter((item) =>
      item.name.toLowerCase().trim().includes(value.toLowerCase().trim())
    );
    setUsers(filteredName)
  }

  useEffect(() => {
    setActiveUserId(2)
    onUserSelect(mockUsers[1]); 
  }, [])

  return (
    <div className="sidebar">
      <div className="chat-header">
        <h3>Chats</h3>
        <div className="header-actions">
          <button className="action-btn" onClick={() => setShowForm(true)}><FaEdit /></button>
          <button className="action-btn"><FaFilter /></button>
        </div>
      </div>
      
      <div className="searchbox">
        <FaSearch className="search-icon" />
        <input 
          type="text"
          placeholder="Search or start a new chat"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            SearchFilter(e.target.value)
          }}
          className="input-field"
        />
        {searchTerm.trim() && (
          <button onClick={clearSearch} className="clear-btn">✕</button>
        )}
      </div>
      {showForm && (
        <div className="form-popup">
          <form className="form-container" ref={formRef}  onSubmit={handleAddUser}>
            <h3>Add New User</h3>
            <input
              type="text"
              placeholder="Enter first Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              
            />
            <input
              type="text"
              placeholder="Enter Number"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              required
            />
            <button type="submit">Add User</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
       {
        users.length == 0 && <div className="warning">
          No user found!
        </div>
       }
      <div className="chat-list">
        {users.map((user) => (
          <div
            key={user.id}
            className={`chat-entry ${activeUserId === user.id ? 'active' : ''}`}
            onClick={() => {
              setActiveUserId(user.id)
              user.unreadCount =0;
              onUserSelect(user);
            }}
          >
            <div className="profile-pic">
              <FaUserCircle />
              {user.isOnline && <span className="online-indicator"></span>}
            </div>
            <div className="chat-info">
              <div className="chat-name">{user.name}</div>
              <div className="last-message">{user.lastMessage}</div>
            </div>
            <div className="chat-meta">
              <div className="message-time">{user.lastMessageTime}</div>
              {user.unreadCount > 0 && (
                activeUserId !== user.id && <div className="unread-badge">{user.unreadCount}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
