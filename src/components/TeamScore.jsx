import React from 'react';
import { soundFX } from '../utils/soundFX';

export default function TeamScore({
  teamId,
  teamName,
  score,
  isActiveTurn,
  onNameChange,
  onSelectTurn,
  onAdjustScore
}) {
  return (
    <div className={`team-scoreboard ${isActiveTurn ? 'active-turn' : ''}`}>
      <input
        type="text"
        className="team-name-input"
        value={teamName}
        onChange={(e) => onNameChange(teamId, e.target.value)}
        title="Klik untuk mengubah nama tim"
      />

      <div className="team-score-val">{score}</div>

      {isActiveTurn ? (
        <span className="turn-pill">⚡ GILIRAN MAIN</span>
      ) : (
        <button
          className="btn btn-secondary"
          style={{ padding: '4px 10px', minHeight: '32px', fontSize: '0.8rem' }}
          onClick={() => {
            soundFX.playClick();
            onSelectTurn(teamId);
          }}
        >
          Ganti Turn
        </button>
      )}

      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '8px' }}>
        <button
          className="btn btn-secondary"
          style={{ padding: '2px 8px', minHeight: '28px', fontSize: '0.75rem' }}
          onClick={() => onAdjustScore(teamId, 10)}
        >
          +10
        </button>
        <button
          className="btn btn-secondary"
          style={{ padding: '2px 8px', minHeight: '28px', fontSize: '0.75rem' }}
          onClick={() => onAdjustScore(teamId, -10)}
        >
          -10
        </button>
      </div>
    </div>
  );
}
