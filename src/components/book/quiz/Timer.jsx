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

const Timer = ({ initialTime, go = false, onFinish = () => {} }) => {
  const [time, setTime] = useState(100);
  useEffect(() => {
    let timeout;
    if (go) {
      if (time > 0) {
        timeout = setTimeout(() => {
          setTime(time - 1);
        }, 1000);
      } else {
        onFinish();
      }
    }
    return function cleanUp() {
      if (go && time > 0) {
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
