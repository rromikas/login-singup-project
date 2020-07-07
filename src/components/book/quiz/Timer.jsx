import React, { useState, useEffect } from "react";

function formatTime(sec_num) {
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
}

const Timer = ({ initialTime, go = false }) => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    let timeout;
    if (go) {
      timeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }
    return function cleanUp() {
      if (go) {
        clearTimeout(timeout);
      }
    };
  }, [go, time]);

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  return <div>{formatTime(time)}</div>;
};

export default Timer;
