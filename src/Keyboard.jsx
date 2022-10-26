import React from 'react';
import PropTypes from 'prop-types';
import KeyboardButton from './KeyboardButton.jsx';
import { UNUSED } from './constants.js';
import css from './Keyboard.css';

const layoutQ = '' +
  'ERTYUÚIÍOPÐ\n' +
  'AÁSDFGHJKLÆ\n' +
  '⏎XVBNMÞÖÓÉÝ⌫';

const layoutQ4 = '' +
  'ÁÉÍÓÚÝÖ\n' +
  'ERTYUIOPÐ\n' +
  'ASDFGHJKLÆ\n' +
  '⏎XVBNMÞ⌫';

const layoutA = '' +
  'AÁBDEÉFGHI⌫\n' +
  'ÍJKLMNOÓPRS\n' +
  'TUÚVXYÝÞÆÐÖ⏎';

const layoutA4 = '' +
  'AÁBDEÉF⌫\n' +
  'GHIÍJKLMN\n' +
  'OÓPRSTUÚV\n' +
  'XYÝÞÆÐÖ⏎';

export default class Keyboard extends React.PureComponent {
  static propTypes = {
    layout: PropTypes.string,
    fourRows: PropTypes.bool,
    givenKeys: PropTypes.object,
    keyStates: PropTypes.object,
    handicapButton: PropTypes.bool,
    onHandicap: PropTypes.func,
    onKey: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  getButtonLayout () {
    const { layout, fourRows } = this.props;
    let buttonLayout = fourRows ? layoutQ4 : layoutQ;
    if (layout === 'abc') {
      buttonLayout = fourRows ? layoutA4 : layoutA;
    }
    return buttonLayout.split('\n').map(d => d.split(''));
  }

  onClick = val => {
    let v = val;
    if (v === '⏎') {
      v = 'enter';
    }
    if (v === '⌫') {
      v = 'backspace';
    }
    this.props?.onKey({
      key: v,
      shift: false,
      ctrl: false,
      alt: false,
      meta: false
    });
  };

  render () {
    const { keyStates, givenKeys, handicapButton, onHandicap } = this.props;
    return (
      <div className={css.keyboard}>
        {handicapButton && (
          <span
            role="button"
            tabIndex="0"
            className={css.handicapButton}
            onClick={onHandicap}
            >
            Afhjúpa 6 ónothæfa stafi
          </span>
        )}
        {this.getButtonLayout().map((r, i) => (
          <div key={i} className={css.row}>
            {r.map(k => (
              <KeyboardButton
                key={k}
                value={k}
                given={!!givenKeys[k]}
                state={keyStates[k] ?? UNUSED}
                onClick={this.onClick}
                />
            ))}
          </div>
        ))}
      </div>
    );
  }
}
