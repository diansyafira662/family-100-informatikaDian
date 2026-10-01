import React, { useState } from 'react';
import { soundFX } from '../utils/soundFX';
import { questionCategoriesList } from '../data/questions';

export default function SetupGame({ questionBank, onStartGame }) {
  const [teamAName, setTeamAName] = useState('TIM A');
  const [teamBName, setTeamBName] = useState('TIM B');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Compute actual counts per category from active questionBank
  const categoriesWithCounts = questionCategoriesList.map((cat) => {
    if (cat.id === 'ALL') {
      return { ...cat, count: questionBank.length };
    }
    const count = questionBank.filter((q) => q.category === cat.id).length;
    return { ...cat, count };
  });

  const handleStart = (e) => {
    e.preventDefault();
    soundFX.playFanfare();
    onStartGame({
      teamA: teamAName || 'TIM A',
      teamB: teamBName || 'TIM B',
      category: selectedCategory
    });
  };

  return (
    <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
      <div className="modal-content" style={{ maxWidth: '560px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #2E9914 0%, #155306 100%)',
              borderRadius: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '2rem',
              color: '#fff',
              marginBottom: '10px',
              boxShadow: '0 0 25px rgba(46, 153, 20, 0.6)',
              border: '2px solid #4ade80'
            }}
          >
            100
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FCD34D', letterSpacing: '0.5px' }}>
            GAME INFORMATIKA – FAMILY 100
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginTop: '4px' }}>
            Kuis Edukasi Informatika SMP • Pembelajaran Interaktif & Fun
          </p>
        </div>

        <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 800, marginBottom: '6px', color: '#F8FAFC' }}>
              🔴 Nama Tim A:
            </label>
            <input
              type="text"
              className="answer-input"
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
              placeholder="Contoh: TIM A / KELOMPOK 1"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, marginBottom: '6px', color: '#F8FAFC' }}>
              🔵 Nama Tim B:
            </label>
            <input
              type="text"
              className="answer-input"
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
              placeholder="Contoh: TIM B / KELOMPOK 2"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, marginBottom: '6px', color: '#F8FAFC' }}>
              🎯 Topik / Kategori Game:
            </label>
            <select
              className="answer-input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {categoriesWithCounts.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.count} Soal)
                </option>
              ))}
            </select>
            <div style={{ fontSize: '0.8rem', color: '#4ade80', marginTop: '6px', textAlign: 'right' }}>
              ✨ Random Question Pool & Tanpa Pengulangan
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-gold"
            style={{ minHeight: '52px', fontSize: '1.2rem', marginTop: '8px' }}
          >
            🚀 MULAI PERMAINAN
          </button>
        </form>

        <div
          style={{
            marginTop: '20px',
            paddingTop: '14px',
            borderTop: '1px solid #334155',
            textAlign: 'center',
            fontSize: '0.88rem',
            color: '#FCD34D',
            fontWeight: 800,
            letterSpacing: '0.5px'
          }}
        >
          ✍️ Created by Dian Syafira
        </div>
      </div>
    </div>
  );
}
