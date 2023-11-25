/* globals document requestAnimationFrame */
import React from 'react';
import PropTypes from 'prop-types';
import csx from 'classnames';
import Icon from './Icon.jsx';
import { writeToClipboard } from './utils.js';
import Toaster from './Toaster.jsx';
import css from './Stats.css';

export default class Stats extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    shareText: PropTypes.string,
    rowIndex: PropTypes.number,
    gameOver: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this.clockTick();
  }

  onShare = () => {
    writeToClipboard(this.props.shareText);
    this.toaster.toast('Niðurstaðan er á klemmuspjaldinu!');
  };

  clockTick = () => {
    // time til midnight
    const elm = document.getElementById('countdown');
    if (elm && this.props.gameOver) {
      const secs = 86400 - Math.floor((Date.now() % 864e5) / 1e3);
      const time = [
        String(~~(secs / 3600) % 24).padStart(2, '0'),
        String(~~(secs / 60) % 60).padStart(2, '0'),
        String(secs % 60).padStart(2, '0')
      ].join(':');
      if (elm.textContent !== time) {
        elm.textContent = time;
      }
      requestAnimationFrame(this.clockTick);
    }
  };

  renderBar (n, p, highlight = false) {
    const cls = csx(css.bar, highlight && css.highlight);
    if (p === 0) {
      return (
        <>
          <div className={cls} style={{ width: '2px' }} />
          <span className={css.barlabel}>{n}</span>
        </>
      );
    }
    return (
      <div className={cls} style={{ width: (p * 100) + '%' }}>
        <span className={css.barlabel}>{n}</span>
      </div>
    );
  }

  render () {
    const {
      currentStreak,
      maxStreak,
      guesses,
      gamesWon,
      gamesPlayed
    } = this.props.data;

    const winPercentage = gamesPlayed
      ? Math.floor(gamesWon / gamesPlayed * 100)
      : 0;
    const index = this.props.gameOver ? this.props.rowIndex || 0 : 0;
    const mx = Math.max(guesses[1], guesses[2], guesses[3], guesses[4], guesses[5], guesses[6]);

    return (
      <div className={css.stats}>
        <h2>Tölfræði</h2>

        <div className={css.kpis}>
          <div className={css.kpi}>
            <label>Spilað</label>
            <output>{gamesPlayed}</output>
          </div>
          <div className={css.kpi}>
            <label>% unnið</label>
            <output>{winPercentage}</output>
          </div>
          <div className={css.kpi}>
            <label>Unnið í röð</label>
            <output>{currentStreak}</output>
          </div>
          <div className={css.kpi}>
            <label>Lengsta röð</label>
            <output>{maxStreak}</output>
          </div>
        </div>

        <h2>Dreifing vinninga</h2>
        <table className={css.histogram}>
          <tbody>
            <tr>
              <th>1</th>
              <td>{this.renderBar(guesses[1], mx ? guesses[1] / mx : 0, index === 1)}</td>
            </tr>
            <tr>
              <th>2</th>
              <td>{this.renderBar(guesses[2], mx ? guesses[2] / mx : 0, index === 2)}</td>
            </tr>
            <tr>
              <th>3</th>
              <td>{this.renderBar(guesses[3], mx ? guesses[3] / mx : 0, index === 3)}</td>
            </tr>
            <tr>
              <th>4</th>
              <td>{this.renderBar(guesses[4], mx ? guesses[4] / mx : 0, index === 4)}</td>
            </tr>
            <tr>
              <th>5</th>
              <td>{this.renderBar(guesses[5], mx ? guesses[5] / mx : 0, index === 5)}</td>
            </tr>
            <tr>
              <th>6</th>
              <td>{this.renderBar(guesses[6], mx ? guesses[6] / mx : 0, index === 6)}</td>
            </tr>
          </tbody>
        </table>

        <div
          className={css.foot}
          style={{ display: this.props.gameOver ? '' : 'none' }}
          >
          <div className={css.next}>
            <h3>Næsta Orðla</h3>
            <time id="countdown">00:00:00</time>
          </div>
          <div className={css.divider} />
          <div className={css.share}>
            <button
              type="button"
              onClick={this.onShare}
              >
              <span>Deila</span>
              <Icon name="share" />
            </button>
          </div>
        </div>

        <Toaster ref={d => (this.toaster = d)} />
      </div>
    );
  }
}
