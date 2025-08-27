import React, { useEffect, useState, useRef } from "react";
// import DocumentMessage from './DocumentMessage'
import { FaCheckDouble } from "react-icons/fa6";
import ReactAudioPlayer from "react-audio-player";
import ReactHowler from "react-howler";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { LiaCheckDoubleSolid } from "react-icons/lia";

const AudioMessage = ({ audioURL,sender=null }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  // const src = msg.audioURL || audioURL2;

  
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const fixAudioDuration = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      } else {
        audio.currentTime = Number.MAX_SAFE_INTEGER;
        audio.ontimeupdate = () => {
          audio.ontimeupdate = null;
          setDuration(audio.duration); 
          audio.currentTime = 0; 
        };
      }
    };
    if(audio){

      audio.addEventListener("loadedmetadata", fixAudioDuration);
      return () => audio.removeEventListener("loadedmetadata", fixAudioDuration);
    }
  }, []);


  const handleTimeUpdate = () => {
    setProgress(audioRef.current.currentTime);
  };


  const handleSeek = (e) => {
    audioRef.current.currentTime = e.target.value;
    setProgress(e.target.value);
  };

  const handleLoadedMetadata = () => {
    console.log("audioRef.current.duration", audioRef.current.duration);
    setDuration(audioRef.current.duration);
  };
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    audioURL && (
      <div className="message-bubble">
        <div className="message-content">
          <div className="player">
            <audio
              ref={audioRef}
              src={audioURL}
              onTimeUpdate={handleTimeUpdate}
              preload="metadata"
              onEnded={() => {
                setIsPlaying(false);
                setProgress(audioRef.current.duration); 
              }}
            />

            <button onClick={togglePlay}>{isPlaying ? <FaPause /> : <FaPlay />}</button>

            <input
              type="range"
              min="0"
              max={Math.floor(duration)} 
              value={Math.min(progress, duration)}
              onChange={(e) => {
                audioRef.current.currentTime = e.target.value;
                setProgress(e.target.value);
              }}
            />

            <span>
              {Math.floor(progress)} / {Math.floor(duration)} sec
            </span>
          </div>
          {/* <audio 
          className="audio"
            controls
            style={{
              backgroundColor: "transparent",
            }}
            src={msg.audioURL}
          /> */}
          {/* <ReactAudioPlayer src={msg.audioURL} 
          style={{
              backgroundColor: "transparent",
            }} autoPlay controls /> */}
          {/* <ReactHowler
            src={msg.audioURL}
            playing={true}
          /> */}
        </div>
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
    )
  );
};

export default AudioMessage;
