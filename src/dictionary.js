import { weightedPick, mulberry32, permutations } from './utils.js';
import { GIVEN, alphabet, vowels, consonants } from './constants.js';
import _acceptedWords from './dict-accepted-pack.json';
const acceptedWords = unpack(_acceptedWords);
import _solutionWords from './dict-solutions-pack.json';
const solutionWords = unpack(_solutionWords);

const sylFreq = {
  1: 1323,
  2: 5577,
  3: 711
};

const letterFreq = {
  A: 11220,
  Á: 1218,
  B: 1957,
  D: 2348,
  E: 2345,
  É: 236,
  F: 2004,
  G: 3283,
  H: 1155,
  I: 8409,
  Í: 1145,
  J: 709,
  K: 4849,
  L: 5524,
  M: 3769,
  N: 6318,
  O: 1455,
  Ó: 1647,
  P: 2364,
  R: 8495,
  S: 7495,
  T: 6202,
  U: 5861,
  Ú: 1271,
  V: 1111,
  X: 157,
  Y: 885,
  Ý: 638,
  Þ: 583,
  Æ: 1239,
  Ð: 3265,
  Ö: 827
};

function unpack (dict) {
  const list = [];
  Object.keys(dict).forEach(key => {
    dict[key].split(/(...)/).forEach(d => {
      d && list.push(key + d);
    });
  });
  return list;
}

export function getGivenLetters (seed, keyword) {
  const rng = mulberry32(seed);
  const used = new Set(keyword.split(''));
  const letters = alphabet
    .split('')
    .filter(char => !used.has(char));
  const given = {};
  for (let i = 0; i < 6; i++) {
    const nth = Math.floor(rng() * letters.length);
    const char = letters.splice(nth, 1)[0];
    given[char] = GIVEN;
  }
  return given;
}

export function inDictionary (word) {
  const lcWord = word.toLowerCase();
  if (lcWord === 'orðla') { return true; }
  return acceptedWords.includes(lcWord) || solutionWords.includes(lcWord);
}

export function getTargetWord (seed) {
  const rng = mulberry32(seed);
  // pick the number of vowels to use
  const numVowels = weightedPick([ 1, 2, 3 ], rng(), sylFreq);
  // until we have a word selected...
  let word = null;
  while (!word) {
    const letters = [];
    let v0 = [ ...vowels ];
    let c0 = [ ...consonants ];
    // pick 5 letters
    for (let i = 0; i < 5; i++) {
      let x;
      // if we still need a vowel
      if (i < numVowels) {
        // pick one and exclude from the pool
        x = weightedPick(v0, rng());
        v0 = v0.filter(d => d !== x);
      }
      // if we have all vowels, we need a consonant
      else {
        // pick one and exclude from the pool
        x = weightedPick(c0, rng(), letterFreq);
        c0 = c0.filter(d => d !== x);
      }
      // add the letter to our selection
      letters.push(x.toLowerCase());
    }
    // create a list of all permutations of the letters
    const list = permutations(letters.join(''))
      // and filter it down to permitted words
      .filter(w => solutionWords.includes(w));
    // if there are valid words in the list
    if (list.length) {
      // pick a random one
      word = list[Math.floor(rng() * list.length)];
    }
  }
  // return the selected word
  return word.toUpperCase();
}
