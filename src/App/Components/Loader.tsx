import React from "react";
import "./Loader.css";

export function Loader() {
  return (
    <div className="progress">
      <span className="progress-bar" />
      <span className="is-hidden" aria-hidden="true">
        Loading...
      </span>
    </div>
  );
}
