import React from 'react';
import PropTypes from 'prop-types';
import csx from 'classnames';
import Icon from './Icon.jsx';
import css from './Modal.css';

export default class Modal extends React.PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  onOverlayClick = e => {
    if (e.currentTarget === e.target && this.props.onClose) {
      this.props.onClose(e);
    }
  };

  render () {
    if (!this.props.open) {
      return null;
    }
    return (
      <div
        className={csx(css.overlay)}
        onClick={this.onOverlayClick}
        >
        <div className={csx(css.content)}>
          <div
            role="button"
            onClick={this.props.onClose}
            className={csx(css.close)}
            >
            <Icon name="close" />
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
