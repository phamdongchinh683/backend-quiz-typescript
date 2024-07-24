const responseStatus = (res, statusCode, status, data) => {
  if (status === "success") {
    return res.status(statusCode).json({
      status: status,
      data: data,
    });
  } else {
    return res.status(statusCode).json({
      status: status,
      message: data,
    });
  }
};

const convertTime = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};



const formatTime = (seconds) => {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${secs}`;
};


module.exports = {
  responseStatus,
  convertTime,
  formatTime,
};
