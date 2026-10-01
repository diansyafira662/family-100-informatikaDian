import React, { useState } from 'react';
import { soundFX } from '../utils/soundFX';

export default function GameControls({
  onCheckAnswer,
  onNextQuestion,
  onRevealNext,
  onAwardPoints,
  onEndMatch,
  activeTeamName,
  inputRef
}) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onCheckAnswer(inputText);
    setInputText('');
  };

  return (
    <div className="input-control-box">
      <form onSubmit={handleSubmit} className="answer-form">
        <input
          ref={inputRef}
          type="text"
          className="answer-input"
          placeholder="Ketik jawaban siswa di sini (Contoh: Google Sheets, Windows, Python)..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary" style={{ minWidth: '130px' }}>
          🔍 CEK JAWABAN
        </button>
      </form>

      <div className="game-action-row">
        <button
          className="btn btn-gold"
          onClick={() => {
            soundFX.playClick();
            onAwardPoints();
          }}
          title={`Berikan Poin Ronda ke ${activeTeamName}`}
        >
          🏆 KLAIM POIN ({activeTeamName})
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => {
            soundFX.playClick();
            onRevealNext();
          }}
          title="Buka Jawaban Berikutnya (Shortcut: Space)"
        >
          💡 BUKA JAWABAN
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => {
            soundFX.playClick();
            onNextQuestion();
          }}
          title="Lanjut ke Soal Berikutnya (Shortcut: N)"
        >
          ➡️ SOAL BERIKUTNYA (N)
        </button>

        {onEndMatch && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              soundFX.playClick();
              onEndMatch();
            }}
            title="Selesaikan Permainan & Tampilkan Hasil Akhir"
            style={{ borderColor: 'var(--gold)' }}
          >
            🏁 SELESAI GAME
          </button>
        )}
      </div>
    </div>
  );
}
