import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import TeamScore from './components/TeamScore';
import QuestionBoard from './components/QuestionBoard';
import AnswerBoard from './components/AnswerBoard';
import StrikeDisplay from './components/StrikeDisplay';
import GameControls from './components/GameControls';
import SetupGame from './components/SetupGame';
import FinalResult from './components/FinalResult';
import QRCodeModal from './components/QRCodeModal';
import QuestionEditorModal from './components/QuestionEditorModal';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';

import { matchAnswer } from './utils/answerMatcher';
import { soundFX } from './utils/soundFX';
import { getQuestionBank } from './utils/storage';

// Fisher-Yates Random Shuffle algorithm
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [questionBank, setQuestionBank] = useState(() => getQuestionBank());
  const [gameState, setGameState] = useState('setup'); // 'setup' | 'playing' | 'final'
  
  // Active Game Session State
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playedQuestionIds, setPlayedQuestionIds] = useState([]);
  const [revealedAnswerIds, setRevealedAnswerIds] = useState([]);
  const [strikeCount, setStrikeCount] = useState(0);

  // Scoreboard
  const [teamAName, setTeamAName] = useState('TIM A');
  const [teamBName, setTeamBName] = useState('TIM B');
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [activeTurn, setActiveTurn] = useState('teamA');

  // Network & PWA State
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Modals
  const [showQR, setShowQR] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const inputRef = useRef(null);

  // Online / Offline & PWA listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;

      const tagName = e.target.tagName.toUpperCase();
      if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
        return;
      }

      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleAddStrike();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleResetStrike();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleNextQuestion();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleRevealNextAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentIndex, activeQuestions, revealedAnswerIds, strikeCount]);

  // Current Question
  const currentQ = activeQuestions[currentIndex];

  // Calculate current round points
  const roundPoints = currentQ
    ? currentQ.answers
        .filter((a) => revealedAnswerIds.includes(a.id))
        .reduce((sum, a) => sum + a.points, 0)
    : 0;

  // Filter full pool by category
  const getCategoryPool = (categoryKey, bank = questionBank) => {
    if (categoryKey && categoryKey !== 'ALL') {
      const filtered = bank.filter((q) => q.category === categoryKey);
      if (filtered.length > 0) return filtered;
    }
    return bank;
  };

  // Start new game match
  const handleStartGame = ({ teamA, teamB, category }) => {
    setSelectedCategory(category);
    setTeamAName(teamA);
    setTeamBName(teamB);
    setScoreA(0);
    setScoreB(0);
    setActiveTurn('teamA');

    const pool = getCategoryPool(category);
    // Shuffle pool
    const shuffled = shuffleArray(pool);
    setActiveQuestions(shuffled);
    setCurrentIndex(0);
    setPlayedQuestionIds([shuffled[0].id]);
    setRevealedAnswerIds([]);
    setStrikeCount(0);

    setGameState('playing');
  };

  // Check input answer
  const handleCheckAnswer = (userInput) => {
    if (!currentQ) return;

    const matched = matchAnswer(userInput, currentQ.answers, revealedAnswerIds);
    if (matched) {
      soundFX.playDing();
      setRevealedAnswerIds((prev) => [...prev, matched.id]);
    } else {
      handleAddStrike();
    }
  };

  // Reveal card slot
  const handleRevealAnswerSlot = (answerId) => {
    if (!revealedAnswerIds.includes(answerId)) {
      soundFX.playDing();
      setRevealedAnswerIds((prev) => [...prev, answerId]);
    }
  };

  // Reveal next answer
  const handleRevealNextAnswer = () => {
    if (!currentQ) return;
    const unrevealed = currentQ.answers.find((a) => !revealedAnswerIds.includes(a.id));
    if (unrevealed) {
      soundFX.playDing();
      setRevealedAnswerIds((prev) => [...prev, unrevealed.id]);
    }
  };

  // Award round points to active team
  const handleAwardPoints = () => {
    if (roundPoints <= 0) return;

    if (activeTurn === 'teamA') {
      setScoreA((prev) => prev + roundPoints);
    } else {
      setScoreB((prev) => prev + roundPoints);
    }

    handleNextQuestion();
  };

  // Move to next question with random selection & no-repeat tracking
  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      const nextIndex = currentIndex + 1;
      const nextQ = activeQuestions[nextIndex];
      setCurrentIndex(nextIndex);
      if (nextQ && !playedQuestionIds.includes(nextQ.id)) {
        setPlayedQuestionIds((prev) => [...prev, nextQ.id]);
      }
      setRevealedAnswerIds([]);
      setStrikeCount(0);
    } else {
      // Reached end of current shuffled queue. Check remaining unplayed questions in pool.
      const fullPool = getCategoryPool(selectedCategory);
      let unplayed = fullPool.filter((q) => !playedQuestionIds.includes(q.id));

      if (unplayed.length === 0) {
        // All questions in the pool have been played! Reset played tracking for next round cycle.
        unplayed = fullPool;
        setPlayedQuestionIds([unplayed[0]?.id]);
      }

      const freshShuffled = shuffleArray(unplayed);
      setActiveQuestions(freshShuffled);
      setCurrentIndex(0);
      setRevealedAnswerIds([]);
      setStrikeCount(0);
    }
  };

  // Strike Management
  const handleAddStrike = () => {
    setStrikeCount((prev) => Math.min(prev + 1, 3));
  };

  const handleResetStrike = () => {
    setStrikeCount(0);
  };

  // Adjust score
  const handleAdjustScore = (teamId, delta) => {
    soundFX.playClick();
    if (teamId === 'teamA') {
      setScoreA((prev) => Math.max(0, prev + delta));
    } else {
      setScoreB((prev) => Math.max(0, prev + delta));
    }
  };

  // Install PWA trigger
  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    }
  };

  // End match manually to view final results
  const handleEndMatch = () => {
    setGameState('final');
  };

  return (
    <div className="app-container">
      <Header
        isOnline={isOnline}
        onOpenQR={() => setShowQR(true)}
        onOpenEditor={() => setShowEditor(true)}
        onOpenShortcuts={() => setShowShortcuts(true)}
        onResetGame={() => setGameState('setup')}
        deferredInstallPrompt={deferredPrompt}
        onInstallPWA={handleInstallPWA}
      />

      {gameState === 'setup' && (
        <SetupGame
          questionBank={questionBank}
          onStartGame={handleStartGame}
        />
      )}

      {gameState === 'playing' && currentQ && (
        <main className="main-game-layout">
          {/* TIM A Scoreboard (Left) */}
          <TeamScore
            teamId="teamA"
            teamName={teamAName}
            score={scoreA}
            isActiveTurn={activeTurn === 'teamA'}
            onNameChange={(id, name) => setTeamAName(name)}
            onSelectTurn={() => setActiveTurn('teamA')}
            onAdjustScore={handleAdjustScore}
          />

          {/* Center Game Arena */}
          <section className="center-play-area">
            <QuestionBoard
              category={currentQ.category}
              questionText={currentQ.question}
              currentIndex={playedQuestionIds.length}
              totalQuestions={getCategoryPool(selectedCategory).length}
              roundPoints={roundPoints}
            />

            <AnswerBoard
              answers={currentQ.answers}
              revealedAnswerIds={revealedAnswerIds}
              onRevealAnswer={handleRevealAnswerSlot}
            />

            <StrikeDisplay
              strikeCount={strikeCount}
              onAddStrike={handleAddStrike}
              onResetStrike={handleResetStrike}
            />

            <GameControls
              onCheckAnswer={handleCheckAnswer}
              onNextQuestion={handleNextQuestion}
              onRevealNext={handleRevealNextAnswer}
              onAwardPoints={handleAwardPoints}
              onEndMatch={handleEndMatch}
              activeTeamName={activeTurn === 'teamA' ? teamAName : teamBName}
              inputRef={inputRef}
            />
          </section>

          {/* TIM B Scoreboard (Right) */}
          <TeamScore
            teamId="teamB"
            teamName={teamBName}
            score={scoreB}
            isActiveTurn={activeTurn === 'teamB'}
            onNameChange={(id, name) => setTeamBName(name)}
            onSelectTurn={() => setActiveTurn('teamB')}
            onAdjustScore={handleAdjustScore}
          />
        </main>
      )}

      {gameState === 'final' && (
        <FinalResult
          teamA={teamAName}
          teamB={teamBName}
          scoreA={scoreA}
          scoreB={scoreB}
          onRestart={() => setGameState('setup')}
        />
      )}

      <footer style={{
        textAlign: 'center',
        padding: '12px 0 6px 0',
        fontSize: '0.85rem',
        color: 'var(--gold-bright)',
        fontWeight: 800,
        marginTop: 'auto'
      }}>
        Family 100 Informatika • Created by Dian Syafira
      </footer>

      {/* Modals */}
      {showQR && <QRCodeModal onClose={() => setShowQR(false)} />}

      {showEditor && (
        <QuestionEditorModal
          questions={questionBank}
          onQuestionsUpdated={(updated) => setQuestionBank(updated)}
          onClose={() => setShowEditor(false)}
        />
      )}

      {showShortcuts && <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}
