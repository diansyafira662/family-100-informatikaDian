import React from 'react';

export default function AnswerBoard({ answers, revealedAnswerIds, onRevealAnswer }) {
  return (
    <div className="answers-grid">
      {answers.map((answer, index) => {
        const isRevealed = revealedAnswerIds.includes(answer.id);
        return (
          <div
            key={answer.id}
            className={`answer-card ${isRevealed ? 'revealed' : ''}`}
            onClick={() => !isRevealed && onRevealAnswer(answer.id)}
            title={isRevealed ? answer.text : `Klik untuk membuka jawaban ${index + 1}`}
          >
            <div className="answer-card-inner">
              {/* Front side (Hidden) */}
              <div className="answer-card-front">
                <div className="answer-num-badge">{index + 1}</div>
                <div className="answer-card-front-bar"></div>
                <div style={{ opacity: 0.5, fontSize: '0.85rem' }}>████████</div>
              </div>

              {/* Back side (Revealed) */}
              <div className="answer-card-back">
                <div className="answer-text-val">{index + 1}. {answer.text}</div>
                <div className="answer-pts-badge">{answer.points}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
