import React, { useState, useEffect } from 'react';
import { soundFX } from '../utils/soundFX';

export default function StrikeDisplay({ strikeCount, onAddStrike, onResetStrike }) {
  const [showFlash, setShowFlash] = useState(false);

  const handleAddStrike = () => {
    soundFX.playBuzzer();
    setShowFlash(true);
    onAddStrike();
    setTimeout(() => {
      setShowFlash(false);
    }, 700);
  };

  return (
    <>
      {showFlash && (
        <div className="strike-flash-overlay">
          <div className="strike-flash-content">❌</div>
        </div>
      )}

      <div className="strike-section">
        <div className="strike-title">STRIKE:</div>
        <div className="strike-icons-container">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`strike-x ${strikeCount >= num ? 'active' : ''}`}
            >
              {strikeCount >= num ? '✕' : '○'}
            </div>
          ))}
        </div>

        <button
          className="btn btn-danger"
          style={{ padding: '6px 12px', minHeight: '36px', fontSize: '0.85rem' }}
          onClick={handleAddStrike}
          title="Tambah Strike (Shortcut Key: S)"
        >
          ❌ Strike (S)
        </button>

        <button
          className="btn btn-secondary"
          style={{ padding: '6px 12px', minHeight: '36px', fontSize: '0.85rem' }}
          onClick={() => {
            soundFX.playClick();
            onResetStrike();
          }}
          title="Reset Strike (Shortcut Key: R)"
        >
          🔄 Reset (R)
        </button>
      </div>
    </>
  );
}
