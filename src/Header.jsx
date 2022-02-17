import React from 'react';
import PropTypes from 'prop-types';
import csx from 'classnames';
import Icon from './Icon.jsx';
import css from './Header.css';

export default class Header extends React.PureComponent {
  static propTypes = {
    onInfo: PropTypes.func,
    onSettings: PropTypes.func,
    onStats: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <div className={csx(css.header)}>
        <h1>ORÐLA<span>.US</span></h1>
        <button
          type="button"
          className={csx(css.button, css.info)}
          onClick={this.props.onInfo}
          >
          <Icon name="help" />
        </button>
        <button
          type="button"
          className={csx(css.button, css.stats)}
          onClick={this.props.onStats}
          >
          <Icon name="leaderboard" />
        </button>
        <button
          type="button"
          className={csx(css.button, css.settings)}
          onClick={this.props.onSettings}
          >
          <Icon name="settings" />
        </button>
      </div>
    );
  }
}
