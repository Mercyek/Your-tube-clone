// VideoPlayer.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Videoplayer = ({ userId }) => {
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const checkWatchTime = async () => {
      const response = await axios.get(`/api/watch/${userId}`);
      setRemainingTime(response.data.remainingTime);
    };
    checkWatchTime();
  }, [userId]);

  if (remainingTime === 0) {
    return <p>Watch time limit reached. Upgrade your plan to watch more.</p>;
  }

  return (
    <div>
      <h3>Video Player</h3>
      <p>Remaining time: {remainingTime} minutes</p>
      <button onClick={() => setRemainingTime(remainingTime - 1)}>
        Watch 1 minute
      </button>
    </div>
  );
};

export default Videoplayer;
