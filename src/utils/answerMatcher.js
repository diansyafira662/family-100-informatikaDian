// Clean string for fuzzy comparison
export function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Calculate Levenshtein Distance between two strings
export function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Check if user answer matches a question answer slot
export function matchAnswer(userInput, questionAnswers, revealedAnswerIds = []) {
  const cleanInput = normalizeText(userInput);
  if (!cleanInput) return null;

  for (const answerObj of questionAnswers) {
    // Skip if already revealed
    if (revealedAnswerIds.includes(answerObj.id)) {
      continue;
    }

    const mainText = normalizeText(answerObj.text);
    const synonyms = (answerObj.synonyms || []).map(s => normalizeText(s));

    // 1. Direct or exact match
    if (cleanInput === mainText || synonyms.includes(cleanInput)) {
      return answerObj;
    }

    // 2. Keyword contained / Substring match (min length 3 to prevent false positives)
    if (cleanInput.length >= 3) {
      if (mainText.includes(cleanInput) || cleanInput.includes(mainText)) {
        return answerObj;
      }

      for (const syn of synonyms) {
        if (syn.length >= 3 && (syn.includes(cleanInput) || cleanInput.includes(syn))) {
          return answerObj;
        }
      }
    }

    // 3. Typo tolerance using Levenshtein distance
    // Allow 1 edit for short words (length 4-7), 2 edits for longer words (length 8+)
    const allowedEdits = cleanInput.length > 7 ? 2 : (cleanInput.length >= 4 ? 1 : 0);

    if (allowedEdits > 0) {
      if (levenshteinDistance(cleanInput, mainText) <= allowedEdits) {
        return answerObj;
      }

      for (const syn of synonyms) {
        if (levenshteinDistance(cleanInput, syn) <= allowedEdits) {
          return answerObj;
        }
      }
    }
  }

  return null; // No match found
}
