import { defaultQuestions } from '../data/questions';

const STORAGE_KEYS = {
  GAME_STATE: 'f100_game_state',
  CUSTOM_QUESTIONS: 'f100_custom_questions',
  SETTINGS: 'f100_settings',
  HIGH_SCORES: 'f100_high_scores'
};

// Retrieve custom questions or fallback to default
export function getQuestionBank() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load saved questions:', e);
  }
  return defaultQuestions;
}

// Save modified or custom question bank
export function saveQuestionBank(questions) {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(questions));
  } catch (e) {
    console.error('Failed to save questions:', e);
  }
}

// Reset questions back to default Informatika bank
export function resetQuestionBank() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
  } catch (e) {
    console.error('Failed to reset questions:', e);
  }
  return defaultQuestions;
}

// Save active game progress
export function saveGameState(state) {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game state:', e);
  }
}

// Load active game progress
export function loadGameState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.warn('Failed to load game state:', e);
    return null;
  }
}

// Clear game progress
export function clearGameState() {
  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  } catch (e) {
    console.error('Failed to clear game state:', e);
  }
}

// Load App Settings
export function getSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : { soundEnabled: true, hostMode: true };
  } catch (e) {
    return { soundEnabled: true, hostMode: true };
  }
}

// Save App Settings
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}
