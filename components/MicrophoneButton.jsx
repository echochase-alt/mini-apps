import React from 'react';
import '../styles/microphone-button.css';

function MicrophoneButton({ onClick, listening }) {
  return (
    <div className="microphone-wrapper">
      <button
        className={`microphone-button ${listening ? 'listening' : ''}`}
        onClick={onClick}
        aria-label="Toggle microphone"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="microphone-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zm-5 9v-2a7 7 0 0 0 6.93-6h-2.02a5 5 0 0 1-9.82 0H5.07a7 7 0 0 0 6.93 6v2h1z"/>
          <ellipse cx="12" cy="22" rx="2" ry="1" />
        </svg>
      </button>
      {listening && <p>Recording...</p>}
    </div>
  );
}

export default MicrophoneButton;
