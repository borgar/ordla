/* globals window */
import React from 'react';
import PropTypes from 'prop-types';
import Row from './Row.jsx';
import css from './Board.css';

export default class Board extends React.PureComponent {
  static propTypes = {
    attempts: PropTypes.array.isRequired,
    keyword: PropTypes.string.isRequired,
    rowIndex: PropTypes.number.isRequired,
    reject: PropTypes.bool,
    onExpose: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    window.addEventListener('resize', this.sizeTiles);
    this.sizeTiles();
  }

  componentDidUpdate () {
    this.sizeTiles();
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.sizeTiles);
  }

  sizeTiles = () => {
    const rect = this.elm.getBoundingClientRect();
    const maxTileWidth = (rect.width / 5) - (4 * 4);
    const maxTileHeight = (rect.height / 6) - (4 * 4);
    const maxTileSize = Math.floor(Math.min(60, maxTileWidth, maxTileHeight));
    this.elm.style = `--tile-size:${maxTileSize}px;`;
  };

  render () {
    const { keyword, attempts, rowIndex, reject, onExpose } = this.props;
    return (
      <div
        className={css.board}
        ref={elm => (this.elm = elm)}
        >
        <Row
          reject={reject && rowIndex === 0}
          attempt={attempts[0]}
          done={rowIndex >= 1}
          keyword={keyword}
          onExpose={onExpose}
          />
        <Row
          reject={reject && rowIndex === 1}
          attempt={attempts[1]}
          done={rowIndex >= 2}
          keyword={keyword}
          onExpose={onExpose}
          />
        <Row
          reject={reject && rowIndex === 2}
          attempt={attempts[2]}
          done={rowIndex >= 3}
          keyword={keyword}
          onExpose={onExpose}
          />
        <Row
          reject={reject && rowIndex === 3}
          attempt={attempts[3]}
          done={rowIndex >= 4}
          keyword={keyword}
          onExpose={onExpose}
          />
        <Row
          reject={reject && rowIndex === 4}
          attempt={attempts[4]}
          done={rowIndex >= 5}
          keyword={keyword}
          onExpose={onExpose}
          />
        <Row
          reject={reject && rowIndex === 5}
          attempt={attempts[5]}
          done={rowIndex >= 6}
          keyword={keyword}
          onExpose={onExpose}
          />
      </div>
    );
  }
}
