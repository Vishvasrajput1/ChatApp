import React, { useState, useCallback, useRef, useEffect } from "react";
import { useMessages } from "../context/MessageContext.jsx";
import { CiPause1 } from "react-icons/ci";
import { FaRegCirclePause } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";
import Picker from "emoji-picker-react";

import MessageList from "./MessageList";
import DocumentMessage from "./DocumentMessage";
import AudioMessage from "./AudioMessage";
import ImageMessage from "./ImageMessage";
import { Send } from "lucide-react";
import { AudioVisualizer } from "react-audio-visualize";
import {
  FaUserCircle,
  FaSearch,
  FaPhone,
  FaVideo,
  FaEllipsisV,
  FaPaperclip,
  FaMicrophone,
  FaPaperPlane,
} from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

import { BsEmojiSmile } from "react-icons/bs";
import { IoDocumentOutline } from "react-icons/io5";
import { MdOutlineInsertPhoto } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { Popup } from "reactjs-popup";

const ChatBox = ({ user, onBack, onOpenProfile }) => {
  const [attach, setAttach] = useState(false);
  const { messages, addMessage } = useMessages();
  const textareaRef = useRef(null);
  const [input, setInput] = useState("");
  const popupRef = useRef();
  const triggerRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const microPhoneRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const emojiRef = useRef(null);
  const emojitriggerRef = useRef(null);
  const [blob, setBlob] = useState();
  const visualizerRef = useRef(null);
  const [recorder, setRecorder] = useState();
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  const [formData, setFormData] = useState({
    ...user,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
        //  if (isFinite(audio.duration) && audio.duration > 0) {
        //   setDuration(audio.duration);
        // } else {
        //   audio.currentTime = Number.MAX_SAFE_INTEGER;
        //   audio.ontimeupdate = () => {
        //     audio.ontimeupdate = null;
        //     setDuration(audio.duration);
        //     audio.currentTime = 0;
        //   };
        // }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);

        setAudioURL(url);
        console.log("Audio ready:", url);

        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);

        // timer already has the recording length, so we don’t reset it here
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleEmojiClick = (emojiData, event) => {
    console.log("emojiData:", emojiData); // should show { unified: "...", names: [...] }
    // In v4 use unified → convert to emoji
    if (emojiData.unified) {
      const emoji = String.fromCodePoint(
        ...emojiData.unified.split("-").map((u) => "0x" + u)
      );
      setInput((prev) => prev + emojiData.emoji);
      setEmojiOpen(false);
      textareaRef.current.focus();
    }
  };

  const [mediaRecorder, setMediaRecorder] = useState(null);

  const handleStart = async () => {
    const recorder = await startRecording();
    setMediaRecorder(recorder);
  };

  const handleStop = async () => {
    if (isRecording) {
      await stopRecording();
      setMediaRecorder(null);
    }
  };

  const hadleMicroClick = () => {
    microPhoneRef.current.click();
    microPhoneRef.current.styly.display = "inline-block";
  };
  const handleFileClick = () => {
    fileInputRef.current.click();
    setShowPopup(false);
  };
  const handleImageClick = () => {
    imageInputRef.current.click();
    // setShowPopup(false);
  };
  // const handleEmojiBtnClik = ()=>{

  // }

  const handleClickOutside = (event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      triggerRef.current &&
      !triggerRef.current.contains(event.target)
    ) {
      setAttach(false);
    }
    if (
      emojiRef.current &&
      !emojiRef.current.contains(event.target) &&
      emojitriggerRef.current &&
      !emojitriggerRef.current.contains(event.target)
    ) {
      setEmojiOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const messagesContainer = document.querySelector(".messages");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages, user]);


  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "36px";
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    console.log(file.type.split("/")[0]);

    if (!file) return;

    const newMsg = [
      ...messages,
      {
        id: user.id,
        type: file.type.split("/")[0],
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + " KB",
        fileUrl: URL.createObjectURL(file),
        sender: "You",
      },
    ];

    addMessage([
      ...newMsg,
      {
        id: user.id,
        type: file.type.split("/")[0],
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + " KB", // size in KB
        fileUrl: URL.createObjectURL(file), // temporary preview
        sender: `${user.name}`,
      },
    ]);
    setAttach(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (!file) return;

    const newMsg = [
      ...messages,
      {
        id: user.id,
        type: "document",
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + " KB",
        fileUrl: URL.createObjectURL(file),
        sender: "You",
      },
    ];

    addMessage([
      ...newMsg,
      {
        id: user.id,
        type: "document",
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + " KB", // size in KB
        fileUrl: URL.createObjectURL(file), // temporary preview
        sender: `${user.name}`,
      },
    ]);
    setAttach(false);
  };
  const handleInput = useCallback((e) => {
    setInput(e.target.value);

    const textarea = e.target;
    const currentHeight = textarea.scrollHeight;
    const minHeight = 36;

    if (currentHeight > minHeight) {
      textarea.style.height = Math.min(currentHeight, 120) + "px";
    } else {
      textarea.style.height = minHeight + "px";
    }
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const newMessages = [
        ...messages,
        { id: user.id, sender: "You", text: input, type: "text" },
      ];
      addMessage([
        ...newMessages,
        { id: user.id, sender: `${user.name}`, text: input, type: "text" },
      ]);
      setInput("");
      setEmojiOpen(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "36px";
      }
    }
  };

  const sendAudio = () => {
    if (audioURL) {
      const newAudios = [
        ...messages,
        { id: user.id, sender: "You", type: "audio", audioURL },
      ];

      addMessage([
        ...newAudios,
        { id: user.id, sender: `${user.name}`, type: "audio", audioURL },
      ]);

      console.log("Audio sent:", audioURL);
      setAudioURL(null); // reset after sending
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setInput(input + "\n");
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =`${textareaRef.current.scrollHeight}px`;
        // Math.min(textareaRef.current.scrollHeight, 120) + "px";
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
    if (event.key === "Backspace" && input.length === 0) {
      event.preventDefault();
      textareaRef.current.focus();
      textareaRef.current.style.height = "36px";
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };

  // useEffect(() => {
  //   if (!input.trim()) {
  //     resetTextareaHeight();
  //   }
  // }, [input]);

  const handleUpdate = (e) => {
    e.preventDefault();
    user.name = formData.name;
    user.number = formData.number;
    user.about = formData.about;
    setIsEditing(false);
  };

  return (
    <div className="chatbox">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>
          <FaArrowLeft size={20} />
        </button>
        <Popup
          className="popup-content"
          trigger={
            <div className="contact-info">
              <FaUserCircle  className="profile-pic" />
              <div className="contact-details">
                <h3>{user.name}</h3>
                <span className="status">
                  {user.isOnline ? "online" : "last seen recently"}
                </span>
              </div>
            </div>
          }
          modal
          closeOnDocumentClick={!isEditing}
          nested
          contentStyle={{
            padding: "0",
            border: "none",
            width: "700px",
            borderRadius: "8px",
            top: "-2%",
            left: "4%",
          }}
        >
          {(close) => (
            <div className="whatsapp-profile-popup">
              <div className="popup-sidebar">
                <ul>
                  <li className="active">Overview</li>
                  <li>Media</li>
                  <li>Files</li>
                  <li>Links</li>
                  <li>Events</li>
                  <li>Encryption</li>
                </ul>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate}>
                  <div className="profile-content">
                    <button
                      className="close-btn"
                      onClick={() => {
                        close();
                      }}
                    >
                      &times;
                    </button>

                    <div className="profile-header">
                      <FaUserCircle className="profile-avatar" />
                      {/* <FiEdit
                      onClick={setIsEditing(true)}
                      className="edit-icon"
                    /> */}
                      <h2>
                        <input
                          type="text"
                          className=""
                          value={formData.name.toUpperCase()}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </h2>
                      <span className="nickname">~{user.username}</span>
                    </div>

                    <div className="profile-details">
                      <p>
                        <strong>About</strong>
                      </p>
                      <textarea
                        value={formData.about || ""}
                        className=""
                        onChange={(e) =>
                          setFormData({ ...formData, about: e.target.value })
                        }
                      ></textarea>

                      <p>
                        <strong>Phone number</strong>
                      </p>
                      <p>
                        {(
                          <input
                            className=""
                            type="number"
                            value={formData.number}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                number: e.target.value,
                              })
                            }
                          />
                        ) || 123456789}
                      </p>

                      <p>
                        <strong>Disappearing messages</strong>
                      </p>
                      <p>Off</p>

                      <p>
                        <strong>Advanced chat privacy</strong>
                      </p>
                      <p className="light">
                        This setting can only be updated on your phone.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="submit-btn">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="profile-content">
                  <button className="close-btn" onClick={close}>
                    &times;
                  </button>

                  <div className="profile-header">
                    <FaUserCircle  className="profile-avatar" />
                    <FiEdit
                      onClick={() => setIsEditing((prev) => !prev)}
                      className="edit-icon"
                    />
                    <h2>{user.name.toUpperCase()}</h2>
                    <span className="nickname">~{user.username}</span>
                  </div>

                  <div className="profile-details">
                    <p>
                      <strong>About</strong>
                    </p>
                      {user.about? <p className="light">{user.about}</p>:<p className="light">
                      
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Saepe, qui tenetur totam iusto, corporis, eum voluptas
                      eius quasi id a adipisci? Praesentium est suscipit, saepe
                      rerum architecto obcaecati distinctio atque.
                    </p>}

                    <p>
                      <strong>Phone number</strong>
                    </p>
                    <p>{user.number || 123456789}</p>

                    <p>
                      <strong>Disappearing messages</strong>
                    </p>
                    <p>Off</p>

                    <p>
                      <strong>Advanced chat privacy</strong>
                    </p>
                    <p className="light">
                      This setting can only be updated on your phone.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Popup>
        <div className="header-actions">
          <button className="action-btn">
            <FaVideo />
          </button>
          <button className="action-btn">
            <FaPhone />
          </button>
          <button className="action-btn">
            <FaSearch />
          </button>
          <Popup
            trigger={
              <button className="action-btn">
                <FaEllipsisV />
              </button>
            }
            position="right top"
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            contentStyle={{ padding: "0px", border: "none" }}
            arrow={false}
          >
            <div className="menu">
              <div className="menu-item"> Search</div>
              <div className="menu-item"> Media,Links & Documents</div>
              <div className="menu-item"> Chat Theme</div>
              <div className="menu-item"> More</div>
            </div>
          </Popup>
        </div>
      </div>

      <div className="messages">
        {/* {audioURL && <audio controls src={audioURL} />} */}
        {messages.map(
          (msg, index) =>
            msg.id === user.id && (
              <>
                {msg.type === "text" && (
                  <div
                    key={index}
                    className={`message ${
                      msg.sender === "You" ? "user" : "bot"
                    }`}
                  >
                    <MessageList msg={msg} />
                  </div>
                )}
                {msg.type == "document" && (
                  <DocumentMessage
                    key={index}
                    id={user.id}
                    fileName={msg.fileName}
                    fileSize={msg.fileSize}
                    fileUrl={msg.fileUrl}
                    sender={msg.sender}
                  />
                )}
                {msg.type == "audio" && (
                  <div
                    key={index}
                    className={`message ${
                      msg.sender === "You" ? "user" : "bot"
                    }`}
                  >
                    <AudioMessage audioURL={msg.audioURL} sender={msg.sender} />
                  </div>
                )}
                {(msg.type == "image" || msg.type == "video") && (
                  <ImageMessage
                    key={index}
                    id={user.id}
                    fileName={msg.fileName}
                    fileSize={msg.fileSize}
                    fileUrl={msg.fileUrl}
                    sender={msg.sender}
                    type={msg.type}
                  />
                )}
              </>
            )
        )}
      </div>
      <div className={`popup }`}>
        <div
          className={`popuptext ${attach && "show"}`}
          id="myPopup"
          ref={popupRef}
        >
          <button className="popuptext-list" onClick={handleFileClick}>
            <IoDocumentOutline />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            <span>Document</span>
          </button>
          <button className="popuptext-list" onClick={handleImageClick}>
            <MdOutlineInsertPhoto />
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={handleImageSelect}
            />
            <span>Photos & videos</span>
          </button>
        </div>
      </div>
      <div className="emoji-popup" ref={emojiRef}>
        <EmojiPicker
          open={emojiOpen}
          onEmojiClick={handleEmojiClick}
          theme="dark"
          closeOnDocumentClick
          className="emoji-picker"
        />
      </div>
      {/* <Picker
        pickerStyle={{ width: "70%" }}
        onEmojiClick={onEmojiClick}
        reactionsDefaultOpen={emojiOpen}
      /> */}
      <div className="input-area">
        <button
          ref={emojitriggerRef}
          className={`emoji-btn ${isRecording || audioURL ? "hide-emoji" : ""}`}
          onClick={() => {
            setEmojiOpen((prev) => !prev);
          }}
          onKeyDown={handleKeyDown}
        >
          <BsEmojiSmile />
        </button>
        <button
          ref={triggerRef}
          className={`attach-btn ${isRecording || audioURL ? "hide-attach" : ""}`}
          onClick={() => {
            setAttach(!attach);
          }}
        >
          <FaPaperclip />
        </button>

        <div className={`message-input-wrapper  ${isRecording || audioURL ? "hide-input" : ""}`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className={`message-input`}
            spellCheck={false}
            style={{ height: "36px" }}
          />
        </div>
        {isRecording && (
          <div className="recording-ui">
            <button className="voice-btn recording" onClick={handleStop}>
              <FaRegCirclePause />
            </button>
            {recorder && (
              <LiveAudioVisualizer
                mediaRecorder={recorder}
                width={200}
                height={50}
                barColor={"#1db954"}
              />
            )}
            {/* {blob && (
              <AudioVisualizer
                ref={visualizerRef}
                blob={blob}
                width={500}
                height={75}
                barWidth={1}
                gap={0}
                barColor={"#f76565"}
              />
            )} */}
            <span className="recording-timer">
              {String(Math.floor(recordingTime / 60)).padStart(2, "0")}:
              {String(recordingTime % 60).padStart(2, "0")}
            </span>
          </div>
        )}

        <div className={`chat-actions ${isRecording ? "recording" : ""}`}>
          {audioURL && !isRecording && (
            <>
              <AudioMessage audioURL={audioURL} />
              <button className="cancel-btn" onClick={() => setAudioURL(null)}>
                ❌
              </button>
              {!input.trim() && (
                <button
                  className="send-btn"
                  onClick={() => {
                    sendAudio();
                  }}
                >
                  <FaPaperPlane size={16} />
                </button>
              )}
            </>
          )}

          {!isRecording && !input.trim() && !audioURL && (
            <button className="voice-btn" onClick={handleStart}>
              <FaMicrophone />
            </button>
          )}

          {input.trim() && !isRecording && (
            <button
              className="send-btn"
              onClick={() => {
                sendMessage();
                if (audioURL) {
                  sendAudio();
                }
              }}
            >
              <FaPaperPlane size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
