import React from 'react';

export default function KeyboardShortcutsModal({ onClose }) {
  const shortcuts = [
    { key: 'Enter', desc: 'Cek / Submit Jawaban pada input text' },
    { key: 'Space (Spasi)', desc: 'Buka jawaban berikutnya di papan' },
    { key: 'S', desc: 'Tambah 1 Poin Strike (❌ Buzzer)' },
    { key: 'R', desc: 'Reset Jumlah Strike kembali ke 0' },
    { key: 'N', desc: 'Lanjut ke Soal / Ronda Berikutnya' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3 className="modal-title">⌨️ KEYBOARD SHORTCUTS</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '16px' }}>
          Gunakan tombol keyboard ini pada mode Desktop / Windows / Laptop untuk mempermudah pemandu game (Host/Guru):
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {shortcuts.map((s) => (
            <div
              key={s.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#0f172a',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #334155'
              }}
            >
              <kbd
                style={{
                  background: '#334155',
                  color: '#FCD34D',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  fontSize: '0.95rem'
                }}
              >
                {s.key}
              </kbd>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{s.desc}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-gold" style={{ width: '100%' }} onClick={onClose}>
          MENGERTI
        </button>
      </div>
    </div>
  );
}
