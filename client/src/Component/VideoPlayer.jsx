// src/components/VideoPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';

const VideoPlayer = ({ videoSrc, onNextVideo, onCloseWebsite, onShowComments }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, [videoSrc]);

  // Handle the gesture actions
  const handleTap = (e) => {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastTapTime;

    if (timeDifference < 300) {
      setTapCount(tapCount + 1);  // Count the taps
    } else {
      setTapCount(1);  // Reset the tap count if the tap is too slow
    }

    setLastTapTime(currentTime);

    if (tapCount === 1) {
      // Single tap in the middle - toggle play/pause
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    } else if (tapCount === 2) {
      // Double tap gesture
      if (e.clientX < window.innerWidth / 2) {
        // Left side - rewind 10 seconds
        if (videoRef.current) {
          videoRef.current.currentTime -= 10;
        }
      } else {
        // Right side - forward 10 seconds
        if (videoRef.current) {
          videoRef.current.currentTime += 10;
        }
      }
    } else if (tapCount === 3) {
      // Three tap gestures
      if (e.clientX < window.innerWidth / 3) {
        // Left side - show comments section
        onShowComments();
      } else if (e.clientX > (2 * window.innerWidth) / 3) {
        // Right side - close the website
        onCloseWebsite();
      } else {
        // Middle - next video
        onNextVideo();
      }

      // Reset tap count after 3 taps
      setTapCount(0);
    }
  };

  return (
    <div
      className="video-player-container"
      onClick={handleTap}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        controls={false}
        autoPlay={true}
        src={videoSrc}
      ></video>
      {!playing && (
        <button
          className="play-button"
          onClick={() => {
            if (videoRef.current) videoRef.current.play();
            setPlaying(true);
          }}
        >
          Play
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
