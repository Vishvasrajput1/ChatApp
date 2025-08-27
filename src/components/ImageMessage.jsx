import React from "react";
import { FaFileAlt } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import { FaCheckDouble } from "react-icons/fa6";
import { LiaCheckDoubleSolid } from "react-icons/lia";

const ImageMessage = ({ fileName, fileSize, fileUrl, sender, id,type }) => {
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
       hour12: false
    });
  };
  const handleOpenDocument = () => {
    // const fileUrl = `${fileUrl}`;
    window.open(fileUrl, "_blank");
  };
  return (
    fileName && (
      <div className={`message ${sender === "You" ? "user" : "bot"}`}>
        <div className={`document-box ${(type === 'image' || type === 'video') && 'img'}`}  >
           {type == "video" && <div className="image-box" onClick={handleOpenDocument}>
             <video src={fileUrl} controls></video>
              </div>} 
         { type == "image" && <div className="image-box" onClick={handleOpenDocument}>

           <img src={fileUrl} alt={fileName} />
              </div>}
          {/* <div className="image-info grid-container">
            <div className="doc-name grid-item grid-item-1">{fileName}</div>
            <div className="doc-size grid-item grid-item-2">{fileSize}</div>
            <div className="download grid-item grid-item-3">
                 <a href={fileUrl} download={fileName} className="download-btn">
              <MdFileDownload size={20} />
            </a>
                </div>
          </div> */}
          
           
            <div className="message-meta">
              <span className="message-time">{getCurrentTime()}</span>
              {sender === "You" && (
                  <span className="message-status">
                  {" "}
                  <LiaCheckDoubleSolid size={13} color="#53BDEB" />
                </span>
              )}
            </div>
        </div>
      </div>
    )
  );
};

export default ImageMessage;