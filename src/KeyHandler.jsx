/* global document */
import { useEffect } from 'react';

const codeToKey = {
  32: ' ',
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  16: 'shift',
  17: 'CONTROL',
  18: 'ALT',
  20: 'capslock',
  27: 'escape',
  33: 'pageup',
  34: 'pagedown',
  35: 'end',
  36: 'home',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  46: 'delete',
  91: 'META', // command
  93: 'META', // command (right)
  192: '°'
};

let nextAccent = null;

const accentMap = {
  '´A': 'Á',
  '´E': 'É',
  '´I': 'Í',
  '´O': 'Ó',
  '´U': 'Ú',
  '´Y': 'Ý',
  '`A': 'À',
  '`E': 'È',
  '`I': 'Ì',
  '`O': 'Ò',
  '`U': 'Ù'
};

const KeyHandler = props => {
  const { onKey, children } = props;

  useEffect(() => {
    const keyPressHandler = e => {
      const code = e.keyCode;
      let key = null;
      if (code in codeToKey) {
        e.preventDefault();
        key = codeToKey[code];
      }
      else if (code === 222) {
        // next char should have an acute accent (if possible)
        nextAccent = '´';
      }
      else if (code === 187) {
        // next char should have a grave accent (if possible)
        nextAccent = '`';
      }
      else {
        const char = e.key.toUpperCase();
        const accented = nextAccent + char;
        if (nextAccent && accented in accentMap) {
          key = (e.key === char)
            ? accentMap[accented]
            : accentMap[accented].toLowerCase();
        }
        else {
          key = e.key;
        }
        nextAccent = null;
      }
      if (key && onKey) {
        onKey({
          key: key,
          shift: e.shiftKey,
          ctrl: e.ctrlKey,
          alt: e.altKey,
          meta: e.metaKey
        });
      }
    };
    document.addEventListener('keydown', keyPressHandler);
    return () => {
      document.removeEventListener('keydown', keyPressHandler);
    };
  }, []);

  return children || null;
};

export default KeyHandler;
