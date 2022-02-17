/* globals setTimeout localStorage document */
import React from 'react';
import csx from 'classnames';
import Header from './Header.jsx';
import Board from './Board.jsx';
import Keyboard from './Keyboard.jsx';
import KeyHandler from './KeyHandler.jsx';
import Modal from './Modal.jsx';
import Toaster from './Toaster.jsx';
import Stats from './Stats.jsx';
import Settings from './Settings.jsx';
import Help from './Help.jsx';
import {
  letterUsage, validLetter,
  readStats, writeStats,
  readState, writeState,
  readSettings, writeSettings,
  getSeed, getShareText, hardModeGuess
} from './utils.js';
import { GAME_SOLVED, GAME_FAILED, GAME_ONGOING, GAME_PENDING, EPOCH, winMessages } from './constants.js';
import { getTargetWord, getGivenLetters, inDictionary } from './dictionary.js';
import css from './Game.css';

export default class Game extends React.PureComponent {
  constructor () {
    super();
    const seed = getSeed();
    const oldState = readState(seed);
    let initialModal = null;
    // never been played before?
    if (!localStorage.getItem('gameState')) {
      initialModal = 'help';
    }
    // saved state is "game over"?
    else if (oldState && (
      oldState.gameStatus === GAME_SOLVED || oldState.gameStatus === GAME_FAILED)) {
      initialModal = 'stats';
    }
    this.state = {
      reject: null,
      modal: initialModal,
      stats: readStats(),
      currentAttempt: '',
      lockUI: false,
      settings: readSettings(),
      ...this.getGameData(seed, oldState)
    };
    this.state.letterUse = letterUsage(this.state.keyword, this.state.attempts);
  }

  componentDidMount () {
    this.setDarkMode();
  }

  componentDidUpdate () {
    this.setDarkMode();
  }

  setDarkMode () {
    const { darkMode } = this.state.settings;
    document.body.className = darkMode ? css.darkMode : '';
    const meta = document.documentElement.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', darkMode ? '#111111' : '#e6e6e6');
    }
  }

  getGameData (seed, oldState) {
    const s = oldState || {};
    return {
      gameStatus: s.gameStatus || GAME_PENDING,
      keyword: s.keyword || getTargetWord(seed),
      rowIndex: s.rowIndex || 0,
      seed: s.seed || seed,
      attempts: s.attempts || [ '', '', '', '', '', '' ],
      given: s.given || {}
    };
  }

  onHandicap = () => {
    // fixme: should set state as started
    this.setState(
      state => ({
        gameStatus: GAME_ONGOING,
        given: getGivenLetters(state.seed, state.keyword)
      }),
      () => {
        writeState(this.state);
      }
    );
  };

  onExpose = () => {
    // word has been exposed, enable UI and update keyboard
    writeState(this.state);
    this.setState(state => ({
      lockUI: false,
      letterUse: letterUsage(state.keyword, state.attempts)
    }), () => {
      if (this.state.gameStatus === GAME_ONGOING) {
        this.onCommitAttempt();
      }
    });
  };

  onModalClose = () => {
    this.setState({ modal: null });
  };

  // maybe only send 1 setting at a time?
  onSettingsChange = newSettings => {
    writeSettings(newSettings);
    this.setState({ settings: newSettings });
  };

  onGameOver () {
    const { gameStatus, rowIndex } = this.state;
    const stats = readStats();
    const isWin = gameStatus === GAME_SOLVED;
    stats.gamesPlayed++;
    if (isWin) {
      stats.currentStreak++;
      if (stats.maxStreak < stats.currentStreak) {
        stats.maxStreak = stats.currentStreak;
      }
      stats.gamesWon++;
    }
    else {
      stats.currentStreak = 0;
    }
    // guesses stats
    if (isWin) {
      stats.guesses[rowIndex]++;
    }
    else {
      stats.guesses.fail++;
    }
    writeStats(stats);
    this.setState({ stats });
  }

  onCommitAttempt = () => {
    // We're committing, check if game over
    const { keyword, attempts, rowIndex } = this.state;
    const DELAY = 1500;
    // is the word solved?
    if (attempts.some(d => d === keyword)) {
      this.toaster.toast(winMessages[rowIndex - 1]);
      this.setState({ gameStatus: GAME_SOLVED }, () => {
        writeState(this.state);
        setTimeout(() => {
          this.onGameOver();
          this.setState({ modal: 'stats' });
        }, DELAY);
      });
    }
    // is the game lost?
    else if (rowIndex >= 6) {
      this.setState({ gameStatus: GAME_FAILED }, () => {
        writeState(this.state);
        this.toaster.toast(this.state.keyword, Infinity);
        setTimeout(() => {
          this.onGameOver();
          this.setState({ modal: 'stats' });
        }, DELAY);
      });
    }
  };

  onKey = e => {
    const { key, meta } = e;
    const { attempts, rowIndex, currentAttempt, keyword, lockUI, settings } = this.state;
    if (!meta && !this.isGameOver() && !lockUI) {
      if (key.toLowerCase() === 'backspace') {
        this.setState({
          currentAttempt: currentAttempt.slice(0, currentAttempt.length - 1)
        });
      }
      else if (key.toLowerCase() === 'escape') {
        this.setState({ currentAttempt: '' });
      }
      else if (validLetter(key)) {
        this.setState({
          currentAttempt: (currentAttempt + key.toUpperCase()).slice(0, 5)
        });
      }
      else if (key.toLowerCase() === 'enter') {
        // commit attempt
        let reject = '';
        if (currentAttempt.length !== 5) {
          reject = 'Þig vantar fleiri stafi.';
        }
        else if (!inDictionary(currentAttempt)) {
          reject = 'Orðið er ekki í orðabók.';
        }
        else if (settings.hardMode) {
          // word must use letters prev clues
          reject = hardModeGuess(keyword, attempts, currentAttempt);
        }
        if (reject) {
          this.toaster.toast(reject, 1);
          // FIXME: this is a bit of a mess:
          this.setState({ reject }, () => {
            setTimeout(() => (this.setState({ reject: '' })), 1000);
          });
        }
        else {
          const _attempts = [ ...attempts ];
          _attempts[rowIndex] = currentAttempt;
          this.setState({
            gameStatus: GAME_ONGOING,
            rowIndex: rowIndex + 1,
            currentAttempt: '',
            attempts: _attempts,
            lockUI: true // lock UI while exposing
          });
          // this will be picked back up in onExpose [then: -> onCommitAttempt -> onGameOver]
        }
      }
    }
  };

  isGameOver = () => {
    return (
      this.state.gameStatus === GAME_FAILED ||
      this.state.gameStatus === GAME_SOLVED
    );
  };

  render () {
    const {
      reject, attempts, rowIndex, keyword, currentAttempt, modal,
      stats, given, letterUse, gameStatus, settings, seed
    } = this.state;

    return (
      <div className={csx(css.game, settings.colorblind && css.colorblind)}>
        <Header
          onInfo={() => (this.setState({ modal: 'help' }))}
          onStats={() => (this.setState({ modal: 'stats' }))}
          onSettings={() => (this.setState({ modal: 'settings' }))}
          />
        <KeyHandler onKey={this.onKey} />
        <Board
          keyword={keyword}
          attempts={attempts.map((d, i) => (i === rowIndex ? currentAttempt : d))}
          rowIndex={rowIndex}
          reject={!!reject}
          onExpose={this.onExpose}
          />
        <Keyboard
          givenKeys={given}
          keyStates={letterUse}
          fourRows={settings.keys4}
          layout={settings.qwerty ? 'qwe' : 'abc'}
          handicapButton={settings.handicap6 && gameStatus === GAME_PENDING}
          onKey={this.onKey}
          onHandicap={this.onHandicap}
          />
        <Modal open={modal === 'stats'} onClose={this.onModalClose}>
          <Stats
            gameOver={this.isGameOver()}
            data={stats}
            rowIndex={rowIndex}
            shareText={getShareText(this.state.seed, keyword, attempts, settings.darkMode)}
            />
        </Modal>
        <Modal open={modal === 'help'} onClose={this.onModalClose}>
          <Help />
        </Modal>
        <Modal open={modal === 'settings'} onClose={this.onModalClose}>
          <Settings
            nr={seed - EPOCH}
            settings={settings}
            gameStatus={gameStatus}
            onChange={this.onSettingsChange}
            />
        </Modal>
        <Toaster ref={d => (this.toaster = d)} />
      </div>
    );
  }
}
