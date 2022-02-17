import React from 'react';
import PropTypes from 'prop-types';
import clx from 'classnames';
import { ABSENT, CORRECT, PRESENT, UNUSED } from './constants.js';
import css from './Tile.css';

const stateToClass = {
  [ABSENT]: css.absent,
  [CORRECT]: css.correct,
  [PRESENT]: css.present,
  [UNUSED]: css.unused
};

export default class Tile extends React.PureComponent {
  static propTypes = {
    char: PropTypes.string,
    locked: PropTypes.bool,
    state: PropTypes.number,
    onFlipped: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this.elm.addEventListener('animationend', this.onAnimationend);
  }

  componentWillUnmount () {
    this.elm.addEventListener('animationend', this.onAnimationend);
  }

  onAnimationend = () => {
    const { locked, onFlipped } = this.props;
    if (locked) {
      this.elm.classList.add(css.exposed);
      if (onFlipped) {
        onFlipped();
      }
    }
  };

  render () {
    const { char, locked, state } = this.props;
    const haveChar = !!char;
    return (
      <span
        className={clx(
          css.tile,
          haveChar && css.filled,
          locked && css.locked,
          locked && stateToClass[state]
        )}
        ref={elm => (this.elm = elm)}
        >
        {char?.toUpperCase() || ' '}
      </span>
    );
  }
}
