import React from "react";

function Loading({ text = "Loading movies..." }) {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}

export default Loading;