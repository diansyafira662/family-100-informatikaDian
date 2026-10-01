import React, { useState } from 'react';
import { saveQuestionBank, resetQuestionBank } from '../utils/storage';

export default function QuestionEditorModal({ questions, onQuestionsUpdated, onClose }) {
  const [bank, setBank] = useState(questions);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'add'

  // New Question Form state
  const [category, setCategory] = useState('Informatika Umun');
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState([
    { id: 1, text: '', points: 40, synonymsStr: '' },
    { id: 2, text: '', points: 30, synonymsStr: '' },
    { id: 3, text: '', points: 20, synonymsStr: '' },
    { id: 4, text: '', points: 10, synonymsStr: '' }
  ]);

  const handleAddAnswerSlot = () => {
    if (answers.length >= 8) return;
    setAnswers([...answers, { id: answers.length + 1, text: '', points: 5, synonymsStr: '' }]);
  };

  const handleSaveNewQuestion = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const validAnswers = answers
      .filter((a) => a.text.trim())
      .map((a) => ({
        id: a.id,
        text: a.text.trim(),
        points: parseInt(a.points) || 10,
        synonyms: a.synonymsStr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      }));

    if (validAnswers.length === 0) {
      alert('Minimal masukkan 1 jawaban valid!');
      return;
    }

    const newQuestionObj = {
      id: `custom_${Date.now()}`,
      category: category.trim() || 'Informatika',
      question: questionText.trim(),
      answers: validAnswers
    };

    const updatedBank = [...bank, newQuestionObj];
    setBank(updatedBank);
    saveQuestionBank(updatedBank);
    onQuestionsUpdated(updatedBank);

    // Reset Form
    setQuestionText('');
    setActiveTab('list');
  };

  const handleDeleteQuestion = (id) => {
    if (confirm('Yakin ingin menghapus soal ini dari bank soal?')) {
      const updated = bank.filter((q) => q.id !== id);
      setBank(updated);
      saveQuestionBank(updated);
      onQuestionsUpdated(updated);
    }
  };

  const handleResetDefault = () => {
    if (confirm('Kembalikan bank soal ke awal (Default Informatika)?')) {
      const reseted = resetQuestionBank();
      setBank(reseted);
      onQuestionsUpdated(reseted);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <h3 className="modal-title">📚 KELOLA BANK SOAL</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            className={`btn ${activeTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1 }}
            onClick={() => setActiveTab('list')}
          >
            Daftar Soal ({bank.length})
          </button>
          <button
            className={`btn ${activeTab === 'add' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1 }}
            onClick={() => setActiveTab('add')}
          >
            ➕ Tambah Soal Baru
          </button>
        </div>

        {activeTab === 'list' ? (
          <div>
            <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {bank.map((q, idx) => (
                <div
                  key={q.id}
                  style={{
                    background: '#0f172a',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#FCD34D', fontWeight: 800 }}>
                      {idx + 1}. [{q.category}]
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{q.question}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                      {q.answers.length} Opsi Jawaban
                    </div>
                  </div>
                  <button
                    className="btn btn-danger"
                    style={{ minHeight: '32px', padding: '4px 8px', fontSize: '0.75rem' }}
                    onClick={() => handleDeleteQuestion(q.id)}
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={handleResetDefault}>
                🔄 Reset Ke Default
              </button>
              <button className="btn btn-gold" onClick={onClose}>
                SELESAI
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveNewQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem' }}>Kategori:</label>
              <input
                type="text"
                className="answer-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Contoh: Hardware, Google Sheets"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem' }}>Pertanyaan:</label>
              <input
                type="text"
                className="answer-input"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Contoh: Sebutkan fungsi utama Google Sheets!"
                required
              />
            </div>

            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#FCD34D' }}>Daftar Jawaban (Urut Poin Tertinggi):</div>

            {answers.map((ans, index) => (
              <div key={ans.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 70px', gap: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  #{index + 1}
                </span>
                <input
                  type="text"
                  className="answer-input"
                  placeholder="Jawaban (opsional sinonim dipisah koma)"
                  value={ans.text}
                  onChange={(e) => {
                    const updated = [...answers];
                    updated[index].text = e.target.value;
                    setAnswers(updated);
                  }}
                />
                <input
                  type="number"
                  className="answer-input"
                  placeholder="Poin"
                  value={ans.points}
                  onChange={(e) => {
                    const updated = [...answers];
                    updated[index].points = e.target.value;
                    setAnswers(updated);
                  }}
                />
              </div>
            ))}

            {answers.length < 8 && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ minHeight: '32px' }}
                onClick={handleAddAnswerSlot}
              >
                + Tambah Slot Jawaban
              </button>
            )}

            <button type="submit" className="btn btn-gold" style={{ marginTop: '10px' }}>
              💾 SIMPAN SOAL BARU
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
