import React from 'react';

export default function QuestionBoard({
  category,
  questionText,
  currentIndex,
  totalQuestions,
  roundPoints
}) {
  return (
    <div className="question-box">
      <div className="question-meta">
        SOAL {currentIndex + 1} / {totalQuestions} • {category || 'INFORMATIKA'}
      </div>
      <h2 className="question-text">{questionText}</h2>
      <div className="question-points-total">
        💰 POIN RONDA: <strong>{roundPoints}</strong> POIN
      </div>
    </div>
  );
}
