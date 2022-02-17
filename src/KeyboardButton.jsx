import React from 'react';
import PropTypes from 'prop-types';
import csx from 'classnames';
import { ABSENT, CORRECT, PRESENT, UNUSED } from './constants.js';
import css from './KeyboardButton.css';

const stateToClass = {
  [ABSENT]: css.absent,
  [CORRECT]: css.correct,
  [PRESENT]: css.present,
  [UNUSED]: css.unused
};

export default class KeyboardButton extends React.PureComponent {
  static propTypes = {
    given: PropTypes.bool,
    value: PropTypes.string,
    state: PropTypes.number,
    onClick: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  onClick = () => {
    this.props.onClick?.(this.props.value);
  };

  render () {
    const { value, state, given } = this.props;
    const isSpecial = (value === '⌫' || value === '⏎');
    return (
      <span
        role="button"
        tabIndex="0"
        className={csx(
          css.key,
          stateToClass[state],
          given && css.given,
          isSpecial && css.special
        )}
        onClick={this.onClick}
        >
        <span>
          {value.toUpperCase()}
        </span>
      </span>
    );
  }
}
