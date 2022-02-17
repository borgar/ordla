/* globals requestAnimationFrame */
import React from 'react';
import PropTypes from 'prop-types';
import csx from 'classnames';
import { compareWords } from './utils.js';
import Tile from './Tile.jsx';
import css from './Row.css';

export default class Row extends React.PureComponent {
  static propTypes = {
    keyword: PropTypes.string,
    attempt: PropTypes.string,
    reject: PropTypes.bool,
    done: PropTypes.bool,
    onExpose: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {
      lock1: false,
      lock2: false,
      lock3: false,
      lock4: false,
      lock5: false
    };
  }

  componentDidMount () {
    if (this.props.done) {
      this.flipTiles();
    }
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.done && this.props.done) {
      // animate flipping the tiles
      this.flipTiles();
    }
  }

  flipTiles () {
    const interval = 120;
    const startTime = Date.now();
    const update = () => {
      const time = Date.now() - startTime;
      const { lock1, lock2, lock3, lock4, lock5 } = this.state;
      if (time > interval * 0 && !lock1) {
        this.setState({ lock1: true });
      }
      if (time > interval * 1 && !lock2) {
        this.setState({ lock2: true });
      }
      if (time > interval * 2 && !lock3) {
        this.setState({ lock3: true });
      }
      if (time > interval * 3 && !lock4) {
        this.setState({ lock4: true });
      }
      if (time > interval * 4 && !lock5) {
        this.setState({ lock5: true });
        return; // stop ticking
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  render () {
    const { keyword, attempt, reject } = this.props;
    const [ s1, s2, s3, s4, s5 ] = compareWords(keyword, attempt);
    const { lock1, lock2, lock3, lock4, lock5 } = this.state;
    return (
      <div className={csx(css.row, reject && css.reject)}>
        <Tile {...s1} locked={lock1} />
        <Tile {...s2} locked={lock2} />
        <Tile {...s3} locked={lock3} />
        <Tile {...s4} locked={lock4} />
        <Tile {...s5} locked={lock5} onFlipped={this.props.onExpose} />
      </div>
    );
  }
}
