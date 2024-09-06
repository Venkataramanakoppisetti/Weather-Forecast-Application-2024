import React from 'react';
import './index.css';

const BackButton = ({ onClick }) => {
  return (
    <button className="back-button" onClick={onClick}>
      &larr; Back
    </button>
  );
};

export default BackButton;
