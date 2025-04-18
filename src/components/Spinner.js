import React from 'react';
import '../styles/Spinner.css';

function Spinner({ ariaLabel = 'Loading' }) {
  return (
    <div className="spinner" aria-label={ariaLabel} />
  );
}

export default Spinner;