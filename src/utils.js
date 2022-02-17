import {
  ABSENT, CORRECT, PRESENT, UNUSED, EPOCH, GAME_PENDING,
  placeWords, alphabet
} from './constants.js';

export function compareWords (keyword, attempt) {
  // build a row of tiles
  const row = [ 0, 1, 2, 3, 4 ].map(i => ({ index: i, char: attempt[i], state: ABSENT }));
  // mark correct tiles
  const hinted = new Set();
  row.forEach(d => {
    if (d.char === keyword[d.index]) {
      d.state = CORRECT;
      hinted.add(d.char);
    }
  });
  // mark present letters
  row.forEach(d => {
    if (d.state !== CORRECT && !hinted.has(d.char) && keyword.includes(d.char)) {
      d.state = PRESENT;
      hinted.add(d.char);
    }
  });
  return row;
}

export function getShareText (seed, keyword, attempts, darkMode = false) {
  const rows = attempts.filter(Boolean);
  const solved = attempts.some(w => w === keyword);
  const txt = `Ordla.us ${seed - EPOCH}: ${solved ? rows.length : 'X'}/6\n\n`;
  return txt + rows
    .map(attempt => (
      compareWords(keyword, attempt)
        .map(tile => {
          if (tile.state === CORRECT) {
            return '🟩';
          }
          else if (tile.state === PRESENT) {
            return '🟨';
          }
          return darkMode ? '⬛' : '⬜️';
        })
        .join('')
    ))
    .join('\n');
}

export function letterUsage (keyword, attempts) {
  const m = Object.create(null);
  attempts.forEach(word => {
    compareWords(keyword, word).forEach(d => {
      if (!m[d.char]) {
        m[d.char] = d.state || UNUSED;
      }
      else if (d.state > m[d.char]) {
        m[d.char] = d.state;
      }
    });
  });
  return m;
}

// There is an A in the keyword
// I guess KAFAR
// Do I color both the A's?
export function hardModeGuess (keyword, attempts, currentAttempt) {
  const knownPresent = new Set();
  for (const word of attempts) {
    const states = compareWords(keyword, word);
    for (let i = 0; i < states.length; i++) {
      if (states[i].state === CORRECT) {
        // "3rd letter must be X"
        if (currentAttempt[i] !== states[i].char) {
          return placeWords[i] + ' stafur þarf að vera ' + states[i].char;
        }
      }
      if (states[i].state === PRESENT) {
        knownPresent.add(states[i].char);
      }
    }
  }
  // now check if all present chars have been used
  currentAttempt.split('').forEach(d => knownPresent.delete(d));
  if (knownPresent.size) {
    return 'Ágiskun þarf að innihalda ' + Array.from(knownPresent.values())[0];
  }
  return null;
}

export function validLetter (char) {
  return alphabet.includes(char.toUpperCase());
}

export function weightedPick (letters, rndNum, weights = {}) {
  const ww = [];
  let sum = 0;
  letters.forEach(c => ww.push((sum += weights[c] || 1)));
  const r = rndNum * sum;
  return letters[ww.findIndex(w => r < w) || 0];
}

export function mulberry32 (a) {
  return () => {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function permutations (str) {
  if (!str || typeof str !== 'string') {
    throw new Error('input must be a string');
  }
  if (str.length === 1) {
    return str;
  }
  const result = [];
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (str.indexOf(char) !== i) {
      continue;
    }
    const remainder = str.slice(0, i) + str.slice(i + 1, str.length);
    for (const p of permutations(remainder)) {
      result.push(char + p);
    }
  }
  return result;
}

/* globals localStorage */
export function readStats () {
  let stats = {
    currentStreak: 0,
    maxStreak: 0,
    guesses: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      fail: 0
    },
    gamesPlayed: 0,
    gamesWon: 0
  };
  try {
    const s = JSON.parse(localStorage.getItem('gameStats'));
    if (s) {
      stats = s;
    }
  }
  catch (err) {
  }
  return stats;
}

export function writeStats (stats) {
  localStorage.setItem('gameStats', JSON.stringify(stats));
}

/* globals window */
function detectDarkDefault () {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }
  return false;
}

export function readSettings () {
  let settings = {
    qwerty: false,
    handicap6: true,
    keys4: false,
    hardMode: false,
    darkMode: detectDarkDefault()
  };
  try {
    const s = JSON.parse(localStorage.getItem('gameSettings'));
    if (s) {
      settings = s;
    }
  }
  catch (err) {
  }
  return settings;
}

export function writeSettings (settings) {
  localStorage.setItem('gameSettings', JSON.stringify(settings));
}

export function getSeed () {
  return Math.floor(Date.now() / 864e5);
}

export function readState (seed) {
  try {
    const s = JSON.parse(localStorage.getItem('gameState'));
    // we have state and it is current
    if (s && s.seed === seed) {
      if (!s.gameStatus) {
        s.gameStatus = GAME_PENDING;
      }
      return s;
    }
  }
  catch (err) {
  }
  return null;
}

export function writeState (state) {
  const data = {
    gameStatus: state.gameStatus,
    keyword: state.keyword,
    rowIndex: state.rowIndex,
    seed: state.seed,
    attempts: [ ...state.attempts ],
    given: { ...state.given }
  };
  localStorage.setItem('gameState', JSON.stringify(data));
}

/* globals document */
let clipBoardHelper;
export function writeToClipboard (text) {
  if (!clipBoardHelper) {
    clipBoardHelper = document.createElement('textarea');
    clipBoardHelper.setAttribute('tabIndex', -1);
    clipBoardHelper.setAttribute('aria-hidden', true);
    clipBoardHelper.setAttribute('readOnly', true);
    clipBoardHelper.style.position = 'fixed';
    clipBoardHelper.style.top = '-100rem';
    clipBoardHelper.style.left = '-100rem';
    clipBoardHelper.style.opacity = '0';
    clipBoardHelper.style.height = '1px';
    clipBoardHelper.style.width = '1px';
    clipBoardHelper.value = '';
    document.body.appendChild(clipBoardHelper);
  }
  clipBoardHelper.value = String(text);
  clipBoardHelper.select();
  document.execCommand('copy');
}

