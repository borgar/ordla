/* globals requestAnimationFrame */
import React from 'react';
import csx from 'classnames';
import css from './Toaster.css';

export default class Toaster extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = { toasts: [] };
  }

  componentDidMount () {
    this.elm.addEventListener('animationend', this.onAnimationend);
    this.tick();
  }

  componentWillUnmount () {
    this.elm.addEventListener('animationend', this.onAnimationend);
  }

  getId () {
    if (!this._t1id) {
      this._t1id = Math.floor(Math.random() * 1e7).toString(36);
      this._t2id = 0;
    }
    this._t2id++;
    return `toast_${this._t1id}_${this._t2id}`;
  }

  onAnimationend = e => {
    const targetId = e.target.id;
    const now = Date.now();
    this.setState(({ toasts }) => ({
      toasts: toasts.filter(toast => {
        if (toast.id === targetId ||
            now > (toast.ttl + 2000)) {
          return false;
        }
        return true;
      })
    }));
  };

  toast = (message, ttl = 3) => {
    this.setState(state => {
      return {
        toasts: [
          ...state.toasts,
          {
            message: message,
            id: this.getId(),
            ttl: Date.now() + ttl * 1000
          }
        ]
      };
    });
  };

  tick = () => {
    const now = Date.now();
    let haveDead = false;
    this.state.toasts.forEach(toast => {
      if (!toast.dead && now > toast.ttl) {
        haveDead = true;
        toast.dead = true;
      }
    });
    if (haveDead) {
      // this.forceRender ?
      this.setState(state => ({
        toasts: [ ...state.toasts ]
      }));
    }
    requestAnimationFrame(this.tick);
  };

  render () {
    return (
      <div
        ref={elm => (this.elm = elm)}
        className={csx(css.toaster)}
        >
        {this.state.toasts.map(({ id, message, dead }) => (
          <div
            className={csx(css.toast, dead && css.fadeout)}
            key={id}
            id={id}
            >
            {message}
          </div>
        ))}
      </div>
    );
  }
}
