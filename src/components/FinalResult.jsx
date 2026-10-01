import React, { useEffect } from 'react';
import { soundFX } from '../utils/soundFX';

export default function FinalResult({ teamA, teamB, scoreA, scoreB, onRestart }) {
  useEffect(() => {
    soundFX.playFanfare();
  }, []);

  const isTie = scoreA === scoreB;
  const winnerName = scoreA > scoreB ? teamA : teamB;

  return (
    <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
      <div className="modal-content" style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🏆</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#FCD34D' }}>
          {isTie ? 'HASIL SERI / IMBANG!' : `PEMENANG: ${winnerName.toUpperCase()}!`}
        </h2>
        <p style={{ color: '#94A3B8', marginTop: '4px' }}>Permainan Family 100 Informatika Telah Selesai</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            margin: '24px 0',
            background: '#0f172a',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #334155'
          }}
        >
          <div>
            <div style={{ fontWeight: 800, color: '#94A3B8' }}>{teamA}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: scoreA >= scoreB ? '#4ade80' : '#fff' }}>
              {scoreA}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#94A3B8' }}>{teamB}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: scoreB >= scoreA ? '#4ade80' : '#fff' }}>
              {scoreB}
            </div>
          </div>
        </div>

        <button
          className="btn btn-gold"
          style={{ width: '100%', minHeight: '48px', fontSize: '1.1rem' }}
          onClick={() => {
            soundFX.playClick();
            onRestart();
          }}
        >
          🔄 MAIN LAGI
        </button>

        <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#FCD34D', fontWeight: 800 }}>
          Created by Dian Syafira
        </div>
      </div>
    </div>
  );
}
